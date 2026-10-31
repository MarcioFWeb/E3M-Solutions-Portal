import { describe, it, expect } from 'vitest';
import { buildDiagnosticEmailHtml, DIAGNOSTIC_TITLES } from '../diagnosticEmailBuilder';

describe('diagnosticEmailBuilder (Email Templates)', () => {
  it('gera e-mail com relatório personalizado quando leadMagnetId informado', () => {
    const result = buildDiagnosticEmailHtml({
      name: 'João Silva',
      leadMagnetId: 'diag-01'
    });

    expect(result.subject).toContain(DIAGNOSTIC_TITLES['diag-01']);
    expect(result.html).toContain('Olá, João Silva!');
    expect(result.html).toContain(DIAGNOSTIC_TITLES['diag-01']);
    expect(result.html).toContain('https://e3m.dev.br/contato');
  });

  it('gera e-mail padrão de boas-vindas quando leadMagnetId não é informado', () => {
    const result = buildDiagnosticEmailHtml({
      name: 'Ana Costa'
    });

    expect(result.subject).toContain('Bem-vindo à Newsletter Semanal da E3M Solutions');
    expect(result.html).toContain('Olá, Ana Costa!');
    expect(result.html).toContain('Newsletter da E3M Solutions');
  });
});
