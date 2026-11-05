import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import cors from 'cors';
import {
  SendBroadcastRequest,
  SendBroadcastResponse,
  AuditEvent,
} from './types';
import { isValidEmail, sha256 } from './subscribeHandler';

// Secrets injection for Firebase Functions v2
const resendApiKey = defineSecret('RESEND_API_KEY');
const resendAudienceId = defineSecret('RESEND_AUDIENCE_ID');

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
  methods: ['POST', 'OPTIONS'],
});

export interface BroadcastHandlerDependencies {
  firestore?: admin.firestore.Firestore;
  resend?: any;
  audienceId?: string;
  clientIp?: string;
  userAgent?: string;
  actorUid?: string;
  actorEmail?: string;
}

/**
 * Core business handler decoupled from Cloud Functions HTTP wrapper for unit testing.
 */
export async function handleSendBroadcast(
  payload: SendBroadcastRequest,
  deps: BroadcastHandlerDependencies
): Promise<{ status: number; body: SendBroadcastResponse }> {
  // 1. Basic validation
  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
    return {
      status: 400,
      body: {
        success: false,
        message: 'Title is required.',
        mode: payload.mode || 'test',
      },
    };
  }

  if (!payload.subject || typeof payload.subject !== 'string' || payload.subject.trim().length === 0) {
    return {
      status: 400,
      body: {
        success: false,
        message: 'Subject is required.',
        mode: payload.mode || 'test',
      },
    };
  }

  if (!payload.htmlContent || typeof payload.htmlContent !== 'string' || payload.htmlContent.trim().length === 0) {
    return {
      status: 400,
      body: {
        success: false,
        message: 'HTML content is required.',
        mode: payload.mode || 'test',
      },
    };
  }

  if (payload.mode !== 'test' && payload.mode !== 'live') {
    return {
      status: 400,
      body: {
        success: false,
        message: 'Invalid mode. Must be "test" or "live".',
        mode: 'test',
      },
    };
  }

  const nowUtc = new Date().toISOString();
  const clientIp = deps.clientIp || '127.0.0.1';
  const ipHash = sha256(clientIp);

  // 2. Execution Mode: TEST
  if (payload.mode === 'test') {
    const recipient = payload.testRecipient?.trim().toLowerCase() || deps.actorEmail || 'contato@marcio.dev.br';
    if (!isValidEmail(recipient)) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Valid testRecipient email is required for test mode.',
          mode: 'test',
        },
      };
    }

    if (!deps.resend) {
      return {
        status: 500,
        body: {
          success: false,
          message: 'Resend provider is not initialized.',
          mode: 'test',
        },
      };
    }

    try {
      const emailRes = await deps.resend.emails.send({
        from: 'E3M Solutions <contato@msg.marcio.dev.br>',
        to: recipient,
        subject: `[PRÉVIA TESTE] ${payload.subject.trim()}`,
        html: payload.htmlContent,
      });

      if (emailRes.error) {
        logger.error('Resend error sending test email', emailRes.error);
        return {
          status: 502,
          body: {
            success: false,
            message: `Failed to deliver test email: ${emailRes.error.message || 'Resend error'}`,
            mode: 'test',
          },
        };
      }

      // Audit trail
      if (deps.firestore) {
        try {
          const auditEvent: AuditEvent = {
            action: 'newsletter_test_sent',
            emailHashSha256: sha256(recipient),
            timestampUtc: nowUtc,
            ipHash,
            userAgent: deps.userAgent,
            actorUid: deps.actorUid,
            actorEmail: deps.actorEmail,
          };
          await deps.firestore.collection('audit_events').add(auditEvent);
        } catch (auditErr) {
          logger.warn('Failed to record test audit event', auditErr);
        }
      }

      return {
        status: 200,
        body: {
          success: true,
          message: `Test email dispatched successfully to ${recipient}.`,
          mode: 'test',
          testEmailId: emailRes.data?.id,
          recipient,
        },
      };
    } catch (err: any) {
      logger.error('Unhandled exception sending test email', err);
      return {
        status: 500,
        body: {
          success: false,
          message: `Internal error sending test email: ${err.message || 'unknown error'}`,
          mode: 'test',
        },
      };
    }
  }

  // 3. Execution Mode: LIVE
  if (!deps.resend) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Resend provider is not initialized.',
        mode: 'live',
      },
    };
  }

  const audienceId = deps.audienceId?.trim();
  if (!audienceId || audienceId === 'none' || audienceId.length < 5) {
    return {
      status: 400,
      body: {
        success: false,
        message: 'Valid Resend audienceId is required for live broadcast.',
        mode: 'live',
      },
    };
  }

  try {
    // 3.1 Create Broadcast
    const createRes = await deps.resend.broadcasts.create({
      audienceId,
      from: 'E3M Solutions <contato@msg.marcio.dev.br>',
      subject: payload.subject.trim(),
      html: payload.htmlContent,
      name: payload.title.trim(),
    });

    if (createRes.error || !createRes.data?.id) {
      logger.error('Resend error creating broadcast', createRes.error);
      return {
        status: 502,
        body: {
          success: false,
          message: `Failed to create broadcast: ${createRes.error?.message || 'Unknown error'}`,
          mode: 'live',
        },
      };
    }

    const broadcastId = createRes.data.id;

    // 3.2 Send Broadcast immediately
    const sendRes = await deps.resend.broadcasts.send(broadcastId);
    if (sendRes.error) {
      logger.error('Resend error triggering broadcast send', sendRes.error);
      return {
        status: 502,
        body: {
          success: false,
          message: `Broadcast created (${broadcastId}) but failed to trigger dispatch: ${sendRes.error.message}`,
          mode: 'live',
          broadcastId,
        },
      };
    }

    // 3.3 Audit trail & optional status update in Firestore
    if (deps.firestore) {
      try {
        const auditEvent: AuditEvent = {
          action: 'newsletter_broadcast_sent',
          timestampUtc: nowUtc,
          ipHash,
          userAgent: deps.userAgent,
          actorUid: deps.actorUid,
          actorEmail: deps.actorEmail,
          broadcastId,
        };
        await deps.firestore.collection('audit_events').add(auditEvent);

        if (payload.ideaId) {
          await deps.firestore
            .collection('organizations')
            .doc('e3m-solutions')
            .collection('ideas')
            .doc(payload.ideaId)
            .set(
              {
                broadcastStatus: 'sent',
                broadcastId,
                broadcastSentAtUtc: nowUtc,
              },
              { merge: true }
            );
        }
      } catch (auditErr) {
        logger.warn('Failed to record broadcast audit event', auditErr);
      }
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Live broadcast created and triggered successfully.',
        mode: 'live',
        broadcastId,
      },
    };
  } catch (err: any) {
    logger.error('Unhandled exception executing live broadcast', err);
    return {
      status: 500,
      body: {
        success: false,
        message: `Internal error triggering live broadcast: ${err.message || 'unknown error'}`,
        mode: 'live',
      },
    };
  }
}

/**
 * Cloud Function v2 HTTPS Entrypoint with Firebase Auth protection
 */
export const sendNewsletterBroadcast = onRequest(
  {
    secrets: [resendApiKey, resendAudienceId],
    region: 'us-central1',
    cors: false, // Managed manually via corsMiddleware
  },
  (request, response) => {
    corsMiddleware(request, response, async () => {
      if (request.method !== 'POST') {
        response.status(405).json({
          success: false,
          message: 'Method Not Allowed. Only POST requests are supported.',
          mode: 'test',
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
            mode: 'test',
          });
          return;
        }

        const idToken = authHeader.split('Bearer ')[1].trim();
        let decodedToken: admin.auth.DecodedIdToken;

        try {
          // Multi-project token verification: verify against e3m-content-machine (PWA tenant) or fallback to default project
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
          logger.warn('Invalid auth token in sendNewsletterBroadcast', authErr);
          response.status(401).json({
            success: false,
            message: `Unauthorized: ${authErr?.message || 'Invalid or expired authentication token.'}`,
            mode: 'test',
          });
          return;
        }

        const firestore = admin.firestore();
        const resend = new Resend(resendApiKey.value());
        const audienceId = resendAudienceId.value();
        const clientIp =
          (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          request.socket.remoteAddress ||
          '';
        const userAgent = request.headers['user-agent'] as string | undefined;

        const result = await handleSendBroadcast(request.body, {
          firestore,
          resend,
          audienceId,
          clientIp,
          userAgent,
          actorUid: decodedToken.uid,
          actorEmail: decodedToken.email,
        });

        response.status(result.status).json(result.body);
      } catch (err: any) {
        logger.error('Unhandled error in sendNewsletterBroadcast', err);
        response.status(500).json({
          success: false,
          message: 'Internal server error processing newsletter broadcast.',
          mode: 'test',
        });
      }
    });
  }
);
