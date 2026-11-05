import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSendBroadcast } from '../broadcastHandler';
import { SendBroadcastRequest } from '../types';

describe('handleSendBroadcast', () => {
  let mockFirestore: any;
  let mockResend: any;
  let mockAdd: any;
  let mockDocSet: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAdd = vi.fn().mockResolvedValue({ id: 'audit-broadcast-123' });
    mockDocSet = vi.fn().mockResolvedValue({});

    const mockDoc = {
      set: mockDocSet,
      collection: vi.fn(),
    };
    mockDoc.collection.mockReturnValue({
      doc: vi.fn().mockReturnValue(mockDoc),
    });

    mockFirestore = {
      collection: vi.fn().mockReturnValue({
        doc: vi.fn().mockReturnValue(mockDoc),
        add: mockAdd,
      }),
    };

    mockResend = {
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'email-preview-123' }, error: null }),
      },
      broadcasts: {
        create: vi.fn().mockResolvedValue({ data: { id: 'broadcast-live-789' }, error: null }),
        send: vi.fn().mockResolvedValue({ data: { id: 'broadcast-live-789' }, error: null }),
      },
    };
  });

  describe('Validation', () => {
    it('fails with 400 when title is missing or empty', async () => {
      const payload: SendBroadcastRequest = {
        title: '',
        subject: 'Assunto',
        htmlContent: '<p>Conteudo</p>',
        mode: 'test',
      };

      const result = await handleSendBroadcast(payload, { resend: mockResend });
      expect(result.status).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('Title is required');
    });

    it('fails with 400 when subject is missing or empty', async () => {
      const payload: SendBroadcastRequest = {
        title: 'Edicao 01',
        subject: '   ',
        htmlContent: '<p>Conteudo</p>',
        mode: 'test',
      };

      const result = await handleSendBroadcast(payload, { resend: mockResend });
      expect(result.status).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('Subject is required');
    });

    it('fails with 400 when htmlContent is missing or empty', async () => {
      const payload: SendBroadcastRequest = {
        title: 'Edicao 01',
        subject: 'Assunto',
        htmlContent: '',
        mode: 'test',
      };

      const result = await handleSendBroadcast(payload, { resend: mockResend });
      expect(result.status).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('HTML content is required');
    });

    it('fails with 400 when mode is invalid', async () => {
      const payload: any = {
        title: 'Edicao 01',
        subject: 'Assunto',
        htmlContent: '<p>Ola</p>',
        mode: 'invalid-mode',
      };

      const result = await handleSendBroadcast(payload, { resend: mockResend });
      expect(result.status).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('Invalid mode');
    });
  });

  describe('Mode: TEST', () => {
    it('dispatches test email via resend.emails.send and records audit event', async () => {
      const payload: SendBroadcastRequest = {
        title: 'Edicao 04: Modernizando Legados',
        subject: 'Modernizando Legados sem Riscos',
        htmlContent: '<h1>Edicao 04</h1><p>Newsletter E3M</p>',
        mode: 'test',
        testRecipient: 'contato@marcio.dev.br',
      };

      const result = await handleSendBroadcast(payload, {
        firestore: mockFirestore,
        resend: mockResend,
        clientIp: '192.168.1.1',
        userAgent: 'Vitest/Agent',
        actorUid: 'user-master-uid',
        actorEmail: 'marciofweb@gmail.com',
      });

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.mode).toBe('test');
      expect(result.body.testEmailId).toBe('email-preview-123');
      expect(result.body.recipient).toBe('contato@marcio.dev.br');

      expect(mockResend.emails.send).toHaveBeenCalledWith({
        from: 'E3M Solutions <contato@msg.marcio.dev.br>',
        to: 'contato@marcio.dev.br',
        subject: '[PRÉVIA TESTE] Modernizando Legados sem Riscos',
        html: '<h1>Edicao 04</h1><p>Newsletter E3M</p>',
      });

      expect(mockFirestore.collection).toHaveBeenCalledWith('audit_events');
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'newsletter_test_sent',
          actorUid: 'user-master-uid',
          actorEmail: 'marciofweb@gmail.com',
        })
      );
    });

    it('fails with 400 when testRecipient is invalid email', async () => {
      const payload: SendBroadcastRequest = {
        title: 'Edicao 01',
        subject: 'Assunto',
        htmlContent: '<p>Ola</p>',
        mode: 'test',
        testRecipient: 'not-an-email',
      };

      const result = await handleSendBroadcast(payload, {
        resend: mockResend,
        actorEmail: undefined,
      });

      expect(result.status).toBe(400);
      expect(result.body.success).toBe(false);
      expect(mockResend.emails.send).not.toHaveBeenCalled();
    });

    it('returns 502 when Resend reports an error on test send', async () => {
      mockResend.emails.send.mockResolvedValueOnce({
        data: null,
        error: { message: 'Domain not verified' },
      });

      const payload: SendBroadcastRequest = {
        title: 'Edicao 01',
        subject: 'Assunto',
        htmlContent: '<p>Ola</p>',
        mode: 'test',
        testRecipient: 'contato@marcio.dev.br',
      };

      const result = await handleSendBroadcast(payload, {
        resend: mockResend,
      });

      expect(result.status).toBe(502);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('Domain not verified');
    });
  });

  describe('Mode: LIVE', () => {
    it('creates and sends broadcast, audits event and updates idea in Firestore', async () => {
      const payload: SendBroadcastRequest = {
        title: 'Edicao 04: Modernizando Legados',
        subject: 'Modernizando Legados sem Riscos (Donor Matrix)',
        htmlContent: '<h1>Edicao Oficial</h1>',
        mode: 'live',
        ideaId: 'idea-seed-case-0004-donor-matrix',
      };

      const result = await handleSendBroadcast(payload, {
        firestore: mockFirestore,
        resend: mockResend,
        audienceId: 'aud-e3m-subscribers-123',
        clientIp: '200.100.50.25',
        actorUid: 'uid-admin',
        actorEmail: 'marciofweb@gmail.com',
      });

      expect(result.status).toBe(200);
      expect(result.body.success).toBe(true);
      expect(result.body.mode).toBe('live');
      expect(result.body.broadcastId).toBe('broadcast-live-789');

      expect(mockResend.broadcasts.create).toHaveBeenCalledWith({
        audienceId: 'aud-e3m-subscribers-123',
        from: 'E3M Solutions <contato@msg.marcio.dev.br>',
        subject: 'Modernizando Legados sem Riscos (Donor Matrix)',
        html: '<h1>Edicao Oficial</h1>',
        name: 'Edicao 04: Modernizando Legados',
      });

      expect(mockResend.broadcasts.send).toHaveBeenCalledWith('broadcast-live-789');

      expect(mockFirestore.collection).toHaveBeenCalledWith('audit_events');
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'newsletter_broadcast_sent',
          broadcastId: 'broadcast-live-789',
          actorUid: 'uid-admin',
        })
      );
      expect(mockDocSet).toHaveBeenCalledWith(
        expect.objectContaining({
          broadcastStatus: 'sent',
          broadcastId: 'broadcast-live-789',
        }),
        { merge: true }
      );
    });

    it('fails with 400 when audienceId is invalid or placeholder', async () => {
      const payload: SendBroadcastRequest = {
        title: 'Edicao 01',
        subject: 'Assunto',
        htmlContent: '<p>Ola</p>',
        mode: 'live',
      };

      const result = await handleSendBroadcast(payload, {
        resend: mockResend,
        audienceId: 'none',
      });

      expect(result.status).toBe(400);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('Valid Resend audienceId is required');
      expect(mockResend.broadcasts.create).not.toHaveBeenCalled();
    });

    it('returns 502 when Resend reports error creating broadcast', async () => {
      mockResend.broadcasts.create.mockResolvedValueOnce({
        data: null,
        error: { message: 'Audience not found' },
      });

      const payload: SendBroadcastRequest = {
        title: 'Edicao 01',
        subject: 'Assunto',
        htmlContent: '<p>Ola</p>',
        mode: 'live',
      };

      const result = await handleSendBroadcast(payload, {
        resend: mockResend,
        audienceId: 'aud-valid-123',
      });

      expect(result.status).toBe(502);
      expect(result.body.success).toBe(false);
      expect(result.body.message).toContain('Audience not found');
      expect(mockResend.broadcasts.send).not.toHaveBeenCalled();
    });
  });
});
