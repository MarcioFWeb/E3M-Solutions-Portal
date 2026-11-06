import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleGetLeadMetrics } from '../metricsHandler';

describe('handleGetLeadMetrics', () => {
  let mockFirestore: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates metrics correctly for empty subscribers', async () => {
    mockFirestore = {
      collection: vi.fn((colName: string) => {
        if (colName === 'newsletter_subscribers') {
          return {
            get: vi.fn().mockResolvedValue({ docs: [] }),
          };
        }
        if (colName === 'audit_events') {
          return {
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                get: vi.fn().mockResolvedValue({ docs: [] }),
              }),
            }),
          };
        }
        return {};
      }),
    };

    const result = await handleGetLeadMetrics({ firestore: mockFirestore });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.metrics.totalSubscribers).toBe(0);
    expect(result.body.metrics.totalDiagnosticsRequested).toBe(0);
    expect(result.body.metrics.newsletterOnlySubscribers).toBe(0);
    expect(result.body.metrics.diagnosticAttachmentRate).toBe(0);
    expect(result.body.leads).toEqual([]);
    expect(result.body.recentEvents).toEqual([]);
  });

  it('aggregates subscriber leads with direct and history leadMagnetId', async () => {
    const subscriberDocs = [
      {
        id: 'hash1',
        data: () => ({
          email: 'lead1@enterprise.com',
          name: 'Lead One',
          company: 'Acme Corp',
          role: 'CTO',
          leadMagnetId: 'diag-01',
          firstSubscribedAtUtc: '2026-11-01T10:00:00Z',
          lastSubscribedAtUtc: '2026-11-01T10:00:00Z',
        }),
      },
      {
        id: 'hash2',
        data: () => ({
          email: 'lead2@consulting.com',
          name: 'Lead Two',
          company: 'Consult Co',
          role: 'Tech Lead',
          sourceHistory: [
            { leadMagnetId: 'diag-02', subscribedAtUtc: '2026-11-02T12:00:00Z' },
          ],
          firstSubscribedAtUtc: '2026-11-02T12:00:00Z',
        }),
      },
      {
        id: 'hash3',
        data: () => ({
          email: 'lead3@general.com',
          name: 'Lead Three',
          firstSubscribedAtUtc: '2026-11-03T08:00:00Z',
        }),
      },
      {
        id: 'hash4',
        data: () => ({
          email: 'lead4@enterprise.com',
          leadMagnetId: 'diag-01',
          firstSubscribedAtUtc: '2026-11-04T15:00:00Z',
        }),
      },
    ];

    const auditDocs = [
      {
        id: 'event-1',
        data: () => ({
          action: 'diagnostic_lead_capture',
          timestampUtc: '2026-11-04T15:00:00Z',
          leadMagnetId: 'diag-01',
          actorEmail: 'lead4@enterprise.com',
        }),
      },
    ];

    mockFirestore = {
      collection: vi.fn((colName: string) => {
        if (colName === 'newsletter_subscribers') {
          return {
            get: vi.fn().mockResolvedValue({ docs: subscriberDocs }),
          };
        }
        if (colName === 'audit_events') {
          return {
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                get: vi.fn().mockResolvedValue({ docs: auditDocs }),
              }),
            }),
          };
        }
        return {};
      }),
    };

    const result = await handleGetLeadMetrics({ firestore: mockFirestore });

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.metrics.totalSubscribers).toBe(4);
    expect(result.body.metrics.totalDiagnosticsRequested).toBe(3); // lead 1, 2, 4
    expect(result.body.metrics.newsletterOnlySubscribers).toBe(1); // lead 3
    expect(result.body.metrics.diagnosticAttachmentRate).toBe(0.75); // 3 / 4
    expect(result.body.metrics.diagnosticsBreakdown).toEqual({
      'diag-01': 2,
      'diag-02': 1,
    });

    // Check leads list order (sorted descending by date)
    expect(result.body.leads.length).toBe(4);
    expect(result.body.leads[0].email).toBe('lead4@enterprise.com');
    expect(result.body.leads[1].email).toBe('lead3@general.com');

    // Check audit events
    expect(result.body.recentEvents.length).toBe(1);
    expect(result.body.recentEvents[0].action).toBe('diagnostic_lead_capture');
    expect(result.body.recentEvents[0].leadMagnetId).toBe('diag-01');
  });

  it('handles firestore errors gracefully', async () => {
    mockFirestore = {
      collection: vi.fn().mockReturnValue({
        get: vi.fn().mockRejectedValue(new Error('Firestore unavailable')),
      }),
    };

    const result = await handleGetLeadMetrics({ firestore: mockFirestore });
    expect(result.status).toBe(500);
    expect(result.body.success).toBe(false);
    expect(result.body.message).toContain('Internal server error');
  });
});
