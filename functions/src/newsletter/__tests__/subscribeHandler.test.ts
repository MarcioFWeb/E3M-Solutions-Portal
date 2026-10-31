import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleNewsletterSubscription } from '../subscribeHandler';
import { SubscribeNewsletterRequest } from '../types';

describe('handleNewsletterSubscription', () => {
  let mockFirestore: any;
  let mockResend: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFirestore = {
      collection: vi.fn().mockReturnThis(),
      doc: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({ exists: false, data: () => null }),
        set: vi.fn().mockResolvedValue({}),
      }),
      add: vi.fn().mockResolvedValue({ id: 'audit-123' }),
    };

    mockResend = {
      contacts: {
        create: vi.fn().mockResolvedValue({ data: { id: 'contact-abc' }, error: null }),
      },
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'email-xyz' }, error: null }),
      },
    };
  });

  it('rejects bot submission when honeypot field is filled', async () => {
    const payload: SubscribeNewsletterRequest = {
      email: 'bot@example.com',
      consentLgpd: true,
      honeypotWebsite: 'http://spam.org',
    };

    const result = await handleNewsletterSubscription(payload, {
      firestore: mockFirestore,
      resend: mockResend,
      clientIp: '1.2.3.4',
      audienceId: 'aud-test',
    });

    expect(result.status).toBe(200); // Silent drop for bots
    expect(result.body.success).toBe(true);
    expect(mockFirestore.collection).not.toHaveBeenCalled();
    expect(mockResend.emails.send).not.toHaveBeenCalled();
  });

  it('fails with 400 when consentLgpd is missing or false', async () => {
    const payload: SubscribeNewsletterRequest = {
      email: 'user@company.com',
      consentLgpd: false,
    };

    const result = await handleNewsletterSubscription(payload, {
      firestore: mockFirestore,
      resend: mockResend,
      clientIp: '1.2.3.4',
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toContain('LGPD consent is mandatory');
  });

  it('fails with 400 when email is invalid', async () => {
    const payload: SubscribeNewsletterRequest = {
      email: 'not-an-email',
      consentLgpd: true,
    };

    const result = await handleNewsletterSubscription(payload, {
      firestore: mockFirestore,
      resend: mockResend,
      clientIp: '1.2.3.4',
    });

    expect(result.status).toBe(400);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toContain('Valid email address is required');
  });

  it('successfully subscribes new user and sends welcome email', async () => {
    const payload: SubscribeNewsletterRequest = {
      email: 'cto@techcorp.com',
      name: 'Jane Doe',
      company: 'TechCorp',
      role: 'CTO',
      consentLgpd: true,
      sourceUrl: 'https://e3m.dev.br/blog',
    };

    const result = await handleNewsletterSubscription(payload, {
      firestore: mockFirestore,
      resend: mockResend,
      clientIp: '127.0.0.1',
      audienceId: 'aud-test-123',
    });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.resendContactId).toBe('contact-abc');

    // Firestore record saved with SHA-256 hash
    expect(mockFirestore.collection).toHaveBeenCalledWith('newsletter_subscribers');
    expect(mockFirestore.collection).toHaveBeenCalledWith('audit_events');

    // Resend Audience contact created
    expect(mockResend.contacts.create).toHaveBeenCalledWith({
      audienceId: 'aud-test-123',
      email: 'cto@techcorp.com',
      firstName: 'Jane',
      lastName: 'Doe',
      unsubscribed: false,
    });

    // Welcome email dispatched
    expect(mockResend.emails.send).toHaveBeenCalledTimes(1);
  });

  it('successfully handles diagnostic lead capture and delivers diagnostic report', async () => {
    const payload: SubscribeNewsletterRequest = {
      email: 'director@enterprise.com',
      name: 'Carlos Silva',
      leadMagnetId: 'diag-01',
      consentLgpd: true,
    };

    const result = await handleNewsletterSubscription(payload, {
      firestore: mockFirestore,
      resend: mockResend,
      clientIp: '127.0.0.1',
    });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.diagnosticDelivered).toBe(true);
    expect(mockResend.emails.send).toHaveBeenCalledTimes(1);
  });
});
