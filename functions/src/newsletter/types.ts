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

export type BroadcastMode = 'test' | 'live';

export interface SendBroadcastRequest {
  title: string;                 // Internal name / edition title (e.g. "Edição 04: Modernizando Legados")
  subject: string;               // Email subject line
  htmlContent: string;           // Full formatted HTML content
  mode: BroadcastMode;           // 'test' | 'live'
  testRecipient?: string;        // Required when mode === 'test'
  ideaId?: string;               // Optional link to source idea document
  scheduledAt?: string;          // Optional ISO string for future scheduling
}

export interface SendBroadcastResponse {
  success: boolean;
  message: string;
  mode: BroadcastMode;
  broadcastId?: string;
  testEmailId?: string;
  recipient?: string;
}

export interface AuditEvent {
  action: 'newsletter_subscription' | 'diagnostic_lead_capture' | 'newsletter_broadcast_sent' | 'newsletter_test_sent';
  emailHashSha256?: string;
  timestampUtc: string;
  ipHash: string;
  userAgent?: string;
  leadMagnetId?: string;
  actorUid?: string;
  actorEmail?: string;
  broadcastId?: string;
}

export interface LeadMetricsItem {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  leadMagnetId?: string;
  subscribedAtUtc: string;
}

export interface LeadMetricsSummaryData {
  totalSubscribers: number;
  totalDiagnosticsRequested: number;
  newsletterOnlySubscribers: number;
  diagnosticAttachmentRate: number; // e.g., 0.75 for 75%
  diagnosticsBreakdown: Record<string, number>;
}

export interface RecentAuditEventItem {
  action: string;
  timestampUtc: string;
  leadMagnetId?: string;
  actorEmail?: string;
}

export interface GetLeadMetricsResponse {
  success: boolean;
  message?: string;
  metrics: LeadMetricsSummaryData;
  leads: LeadMetricsItem[];
  recentEvents: RecentAuditEventItem[];
}

