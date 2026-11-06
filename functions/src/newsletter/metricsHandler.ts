import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import cors from 'cors';
import {
  GetLeadMetricsResponse,
  LeadMetricsItem,
  LeadMetricsSummaryData,
  RecentAuditEventItem,
} from './types';

// Allowed origins for CORS (production portal, PWA SaaS, and dev servers)
const allowedOrigins = [
  'https://e3m-content-machine.web.app',
  'https://e3m-content-machine.firebaseapp.com',
  'https://e3m.dev.br',
  'https://www.e3m.dev.br',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
});

export interface MetricsHandlerDependencies {
  firestore?: admin.firestore.Firestore;
  actorUid?: string;
  actorEmail?: string;
}

/**
 * Extracts the most relevant leadMagnetId from a subscriber doc.
 */
function extractLeadMagnetId(docData: any): string | undefined {
  if (docData.leadMagnetId && typeof docData.leadMagnetId === 'string' && docData.leadMagnetId.trim().length > 0) {
    return docData.leadMagnetId.trim();
  }

  if (Array.isArray(docData.sourceHistory) && docData.sourceHistory.length > 0) {
    for (let i = docData.sourceHistory.length - 1; i >= 0; i--) {
      const entry = docData.sourceHistory[i];
      if (entry?.leadMagnetId && typeof entry.leadMagnetId === 'string' && entry.leadMagnetId.trim().length > 0) {
        return entry.leadMagnetId.trim();
      }
    }
  }

  return undefined;
}

/**
 * Core business handler decoupled from Cloud Functions HTTP wrapper for unit testing.
 */
export async function handleGetLeadMetrics(
  deps: MetricsHandlerDependencies
): Promise<{ status: number; body: GetLeadMetricsResponse }> {
  const firestore = deps.firestore || admin.firestore();

  try {
    // 1. Fetch subscribers from Firestore
    const subscribersSnap = await firestore
      .collection('newsletter_subscribers')
      .get();

    const leads: LeadMetricsItem[] = [];
    const diagnosticsBreakdown: Record<string, number> = {};
    let totalDiagnosticsRequested = 0;
    let newsletterOnlySubscribers = 0;

    for (const doc of subscribersSnap.docs) {
      const data = doc.data();
      const leadMagnetId = extractLeadMagnetId(data);
      const email = data.email || doc.id;
      const subscribedAtUtc = data.lastSubscribedAtUtc || data.firstSubscribedAtUtc || new Date().toISOString();

      if (leadMagnetId) {
        totalDiagnosticsRequested++;
        diagnosticsBreakdown[leadMagnetId] = (diagnosticsBreakdown[leadMagnetId] || 0) + 1;
      } else {
        newsletterOnlySubscribers++;
      }

      leads.push({
        id: doc.id,
        email,
        name: data.name || undefined,
        company: data.company || undefined,
        role: data.role || undefined,
        leadMagnetId,
        subscribedAtUtc,
      });
    }

    // Sort leads chronologically descending
    leads.sort((a, b) => new Date(b.subscribedAtUtc).getTime() - new Date(a.subscribedAtUtc).getTime());

    const totalSubscribers = leads.length;
    const diagnosticAttachmentRate = totalSubscribers > 0
      ? Number((totalDiagnosticsRequested / totalSubscribers).toFixed(2))
      : 0;

    const metrics: LeadMetricsSummaryData = {
      totalSubscribers,
      totalDiagnosticsRequested,
      newsletterOnlySubscribers,
      diagnosticAttachmentRate,
      diagnosticsBreakdown,
    };

    // 2. Fetch recent audit events (last 20 events)
    let recentEvents: RecentAuditEventItem[] = [];
    try {
      const eventsSnap = await firestore
        .collection('audit_events')
        .orderBy('timestampUtc', 'desc')
        .limit(20)
        .get();

      recentEvents = eventsSnap.docs.map((doc) => {
        const d = doc.data();
        return {
          action: d.action || 'unknown',
          timestampUtc: d.timestampUtc || new Date().toISOString(),
          leadMagnetId: d.leadMagnetId || undefined,
          actorEmail: d.actorEmail || undefined,
        };
      });
    } catch (eventsErr) {
      logger.warn('Could not fetch audit_events for metrics (index may be building)', eventsErr);
      // Non-blocking: continue without audit events if query fails
    }

    return {
      status: 200,
      body: {
        success: true,
        metrics,
        leads,
        recentEvents,
      },
    };
  } catch (err: any) {
    logger.error('Error in handleGetLeadMetrics', err);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error calculating lead metrics.',
        metrics: {
          totalSubscribers: 0,
          totalDiagnosticsRequested: 0,
          newsletterOnlySubscribers: 0,
          diagnosticAttachmentRate: 0,
          diagnosticsBreakdown: {},
        },
        leads: [],
        recentEvents: [],
      },
    };
  }
}

/**
 * Cloud Function v2 HTTPS endpoint: getLeadMetrics
 * Authenticated via Firebase Auth ID token (multi-project support for e3m-content-machine).
 */
export const getLeadMetrics = onRequest(
  {
    region: 'us-central1',
    cors: false,
  },
  (request, response) => {
    corsMiddleware(request, response, async () => {
      if (request.method !== 'GET' && request.method !== 'POST') {
        response.status(405).json({
          success: false,
          message: 'Method Not Allowed. Use GET or POST.',
        });
        return;
      }

      try {
        if (!admin.apps.length) {
          admin.initializeApp();
        }

        // Authenticate bearer token
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          response.status(401).json({
            success: false,
            message: 'Unauthorized. Bearer token is required.',
          });
          return;
        }

        const idToken = authHeader.split('Bearer ')[1].trim();
        let decodedToken: admin.auth.DecodedIdToken;

        try {
          // Multi-project token verification: verify against e3m-content-machine or fallback to default
          let cmApp = admin.apps.find((a) => a?.name === 'content-machine-auth');
          if (!cmApp) {
            cmApp = admin.initializeApp(
              { projectId: 'e3m-content-machine' },
              'content-machine-auth'
            );
          }

          try {
            decodedToken = await cmApp.auth().verifyIdToken(idToken);
          } catch (cmErr: any) {
            if (cmErr?.code === 'auth/argument-error' && cmErr?.message?.includes('aud')) {
              decodedToken = await admin.auth().verifyIdToken(idToken);
            } else {
              throw cmErr;
            }
          }
        } catch (authErr: any) {
          logger.warn('Invalid auth token in getLeadMetrics', authErr);
          response.status(401).json({
            success: false,
            message: `Unauthorized: ${authErr?.message || 'Invalid or expired authentication token.'}`,
          });
          return;
        }

        const firestore = admin.firestore();
        const result = await handleGetLeadMetrics({
          firestore,
          actorUid: decodedToken.uid,
          actorEmail: decodedToken.email,
        });

        response.status(result.status).json(result.body);
      } catch (err: any) {
        logger.error('Unhandled error in getLeadMetrics', err);
        response.status(500).json({
          success: false,
          message: 'Internal server error processing lead metrics.',
        });
      }
    });
  }
);
