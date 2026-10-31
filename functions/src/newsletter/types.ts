export interface SubscribeNewsletterRequest {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  leadMagnetId?: string;       // e.g., 'diag-01'
  diagnosticAnswers?: Record<string, any>;
  consentLgpd: boolean;
  honeypotWebsite?: string;    // anti-bot invisible field
  sourceUrl?: string;
}

export interface SubscribeNewsletterResponse {
  success: boolean;
  message: string;
  subscriberId?: string;
  resendContactId?: string;
  diagnosticDelivered?: boolean;
}

export interface SubscriberRecord {
  email: string;
  emailHashSha256: string;
  name?: string;
  company?: string;
  role?: string;
  active: boolean;
  consentLgpd: boolean;
  firstSubscribedAtUtc: string;
  lastSubscribedAtUtc: string;
  sourceHistory: Array<{
    sourceUrl?: string;
    leadMagnetId?: string;
    subscribedAtUtc: string;
  }>;
  resendContactId?: string;
}

export interface AuditEvent {
  action: 'newsletter_subscription' | 'diagnostic_lead_capture';
  emailHashSha256: string;
  timestampUtc: string;
  ipHash: string;
  userAgent?: string;
  leadMagnetId?: string;
}
