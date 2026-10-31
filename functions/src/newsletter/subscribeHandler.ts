import { createHash } from 'crypto';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import cors from 'cors';
import {
  SubscribeNewsletterRequest,
  SubscribeNewsletterResponse,
  SubscriberRecord,
  AuditEvent,
} from './types';
import { buildDiagnosticEmailHtml } from './diagnosticEmailBuilder';

// Secrets injection for Firebase Functions v2
const resendApiKey = defineSecret('RESEND_API_KEY');
const resendAudienceId = defineSecret('RESEND_AUDIENCE_ID');

// Allowed origins for CORS (production domains + local Astro dev server)
const allowedOrigins = [
  'https://e3m.dev.br',
  'https://www.e3m.dev.br',
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

export interface HandlerDependencies {
  firestore?: admin.firestore.Firestore;
  resend?: any;
  clientIp?: string;
  userAgent?: string;
  audienceId?: string;
}

/**
 * Computes deterministic SHA-256 hex string for privacy/anti-leak hashing.
 */
export function sha256(val: string): string {
  return createHash('sha256').update(val.trim().toLowerCase()).digest('hex');
}

/**
 * Basic email syntax validation.
 */
export function isValidEmail(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Core business handler decoupled from Cloud Functions HTTP wrapper for unit testing.
 */
export async function handleNewsletterSubscription(
  payload: SubscribeNewsletterRequest,
  deps: HandlerDependencies
): Promise<{ status: number; body: SubscribeNewsletterResponse }> {
  // 1. Anti-bot honeypot check: silent 200 drop if invisible field was filled
  if (payload.honeypotWebsite && payload.honeypotWebsite.trim().length > 0) {
    logger.warn('Bot subscription attempt intercepted via honeypot', {
      honeypot: payload.honeypotWebsite,
    });
    return {
      status: 200,
      body: {
        success: true,
        message: 'Subscription processed successfully.',
      },
    };
  }

  // 2. Validate mandatory LGPD consent
  if (payload.consentLgpd !== true) {
    return {
      status: 400,
      body: {
        success: false,
        message: 'LGPD consent is mandatory for subscription.',
      },
    };
  }

  // 3. Validate email
  if (!isValidEmail(payload.email)) {
    return {
      status: 400,
      body: {
        success: false,
        message: 'Valid email address is required.',
      },
    };
  }

  const normalizedEmail = payload.email.trim().toLowerCase();
  const emailHash = sha256(normalizedEmail);
  const nowUtc = new Date().toISOString();
  const clientIp = deps.clientIp || '127.0.0.1';
  const ipHash = sha256(clientIp);

  // 4. Firestore Idempotent Upsert & Audit Trail
  let subscriberDocId = emailHash;
  if (deps.firestore) {
    try {
      const subscriberRef = deps.firestore.collection('newsletter_subscribers').doc(emailHash);
      const existingSnap = await subscriberRef.get();

      let sourceHistory: Array<{
        sourceUrl?: string;
        leadMagnetId?: string;
        subscribedAtUtc: string;
      }> = [];
      let firstSubscribedAt = nowUtc;

      if (existingSnap.exists) {
        const existingData = existingSnap.data() as SubscriberRecord;
        sourceHistory = existingData.sourceHistory || [];
        firstSubscribedAt = existingData.firstSubscribedAtUtc || nowUtc;
      }

      sourceHistory.push({
        sourceUrl: payload.sourceUrl,
        leadMagnetId: payload.leadMagnetId,
        subscribedAtUtc: nowUtc,
      });

      const subscriberRecord: SubscriberRecord = {
        email: normalizedEmail,
        emailHashSha256: emailHash,
        name: payload.name?.trim(),
        company: payload.company?.trim(),
        role: payload.role?.trim(),
        active: true,
        consentLgpd: true,
        firstSubscribedAtUtc: firstSubscribedAt,
        lastSubscribedAtUtc: nowUtc,
        sourceHistory,
      };

      await subscriberRef.set(subscriberRecord, { merge: true });

      // Audit log entry for data protection compliance
      const auditRef = deps.firestore.collection('audit_events');
      const auditEvent: AuditEvent = {
        action: payload.leadMagnetId ? 'diagnostic_lead_capture' : 'newsletter_subscription',
        emailHashSha256: emailHash,
        timestampUtc: nowUtc,
        ipHash,
        userAgent: deps.userAgent,
        leadMagnetId: payload.leadMagnetId,
      };
      await auditRef.add(auditEvent);
    } catch (fsErr) {
      logger.error('Error persisting subscriber in Firestore', fsErr);
      // Non-fatal if offline/mocked, continue flow
    }
  }

  // 5. Resend Audience Sync
  let resendContactId: string | undefined;
  if (deps.resend && deps.audienceId) {
    try {
      const names = (payload.name || '').trim().split(' ');
      const firstName = names[0] || undefined;
      const lastName = names.slice(1).join(' ') || undefined;

      const contactRes = await deps.resend.contacts.create({
        audienceId: deps.audienceId,
        email: normalizedEmail,
        firstName,
        lastName,
        unsubscribed: false,
      });

      if (contactRes?.data?.id) {
        resendContactId = contactRes.data.id;
      }
    } catch (resendContactErr) {
      logger.warn('Failed to register contact in Resend Audience', resendContactErr);
    }
  }

  // 6. Deliver Diagnostic Report or Welcome Email
  let diagnosticDelivered = false;
  if (deps.resend) {
    try {
      const emailContent = buildDiagnosticEmailHtml({
        name: payload.name,
        leadMagnetId: payload.leadMagnetId,
        diagnosticAnswers: payload.diagnosticAnswers,
      });

      await deps.resend.emails.send({
        from: 'E3M Solutions <contato@msg.marcio.dev.br>',
        to: normalizedEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });
      diagnosticDelivered = true;
    } catch (resendSendErr) {
      logger.error('Failed to send transactional newsletter email', resendSendErr);
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Subscription confirmed successfully.',
      subscriberId: subscriberDocId,
      resendContactId,
      diagnosticDelivered,
    },
  };
}

/**
 * Cloud Function v2 HTTPS Entrypoint
 */
export const subscribeNewsletter = onRequest(
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
        });
        return;
      }

      try {
        if (!admin.apps.length) {
          admin.initializeApp();
        }

        const firestore = admin.firestore();
        const resend = new Resend(resendApiKey.value());
        const audienceId = resendAudienceId.value();
        const clientIp =
          (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          request.socket.remoteAddress ||
          '';
        const userAgent = request.headers['user-agent'] as string | undefined;

        const result = await handleNewsletterSubscription(request.body, {
          firestore,
          resend,
          audienceId,
          clientIp,
          userAgent,
        });

        response.status(result.status).json(result.body);
      } catch (err: any) {
        logger.error('Unhandled error in subscribeNewsletter', err);
        response.status(500).json({
          success: false,
          message: 'Internal server error processing subscription.',
        });
      }
    });
  }
);
