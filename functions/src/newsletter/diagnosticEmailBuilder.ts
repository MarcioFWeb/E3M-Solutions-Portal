export const DIAGNOSTIC_TITLES: Record<string, string> = {
  'diag-01': 'Diagnóstico de Maturidade Agêntica (SDD vs Prompting Ad-hoc)',
  'diag-02': 'Raio-X de Potencial de Automação de Backoffice & Operações',
  'diag-03': 'Auditor de Adequação de IA Generativa: API vs Fine-Tuning vs RAG',
  'diag-04': 'Mapeador de Gargalos em Pipelines de Dados & Analytics',
  'diag-05': 'Calculadora Rápida de Desperdício Cloud (FinOps & Severless Readiness)',
  'diag-06': 'Radar de Conformidade LGPD & Segurança para Sistemas de IA',
  'diag-07': 'Diagnóstico de Prontidão para Modernização de Legados (Donor Matrix)',
  'diag-08': 'Termômetro de Governança para Contratos de Prestação de Serviços Técnicos',
  'diag-09': 'Índice de Prontidão para Assistentes & Chatbots de Alto Impacto',
  'diag-10': 'Régua de Maturidade em Ciclo de Vida Agêntico (ADLC 6 Fases)'
};

export interface DiagnosticEmailOptions {
  name?: string;
  leadMagnetId?: string;
  diagnosticAnswers?: Record<string, any>;
}

export function buildDiagnosticEmailHtml(options: DiagnosticEmailOptions): { subject: string; html: string } {
  const recipientName = options.name?.trim() || 'Líder Técnico';
  const diagId = options.leadMagnetId;
  const diagTitle = diagId ? DIAGNOSTIC_TITLES[diagId] || 'Diagnóstico de IA & Engenharia' : null;

  if (diagTitle) {
    const subject = `Seu Relatório: ${diagTitle} — E3M Solutions`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Olá, ${recipientName}!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">
          Obrigado por responder ao nosso <strong>${diagTitle}</strong>.
        </p>
        <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb;">Síntese do seu Enquadramento</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 0;">
            Avaliamos suas respostas e identificamos oportunidades claras para acelerar entregas, reduzir desperdício e blindar a arquitetura contra retrabalhos.
          </p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Quer aprofundar esses pontos na prática com o nosso time de arquitetura?
        </p>
        <p style="margin: 24px 0;">
          <a href="https://e3m.dev.br/contato" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
            Agendar Sessão Técnica de 30 Minutos (Sem Custo)
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
          Você está recebendo este e-mail porque solicitou um utilitário técnico no portal <a href="https://e3m.dev.br" style="color: #2563eb;">e3m.dev.br</a>.<br>
          E3M Solutions • Engenharia de Software & IA Aplicada
        </p>
      </div>
    `;
    return { subject, html };
  }

  // E-mail de Boas-vindas Newsletter Padrão
  const subject = `Bem-vindo à Newsletter Semanal da E3M Solutions`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">Olá, ${recipientName}!</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #334155;">
        Sua inscrição na <strong>Newsletter da E3M Solutions</strong> foi confirmada com sucesso!
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Toda semana compartilhamos aprendizados reais de produção: desenvolvimento agêntico (SDD/ADLC), arquitetura serverless pragmática e inteligência artificial aplicada a decisões corporativas.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        E3M Solutions • <a href="https://e3m.dev.br" style="color: #2563eb;">e3m.dev.br</a>
      </p>
    </div>
  `;
  return { subject, html };
}
