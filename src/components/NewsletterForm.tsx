import React, { useState } from 'react';

export interface NewsletterFormProps {
  endpointUrl?: string;
  sourceUrl?: string;
  defaultLeadMagnetId?: string;
  className?: string;
}

export const DIAGNOSTIC_OPTIONS = [
  { id: '', label: 'Apenas a Newsletter Quinzenal (Sem Diagnóstico)' },
  { id: 'diag-01', label: 'Diagnóstico 01: Maturidade Agêntica (SDD vs Prompting)' },
  { id: 'diag-02', label: 'Diagnóstico 02: Potencial de Automação de Backoffice' },
  { id: 'diag-03', label: 'Diagnóstico 03: Adequação de IA (API vs RAG vs Fine-Tuning)' },
  { id: 'diag-04', label: 'Diagnóstico 04: Gargalos em Pipelines de Dados' },
  { id: 'diag-05', label: 'Diagnóstico 05: Calculadora de Desperdício Cloud (FinOps)' },
  { id: 'diag-06', label: 'Diagnóstico 06: Radar de Conformidade LGPD & IA' },
  { id: 'diag-07', label: 'Diagnóstico 07: Prontidão para Modernização de Legados' },
  { id: 'diag-08', label: 'Diagnóstico 08: Governança em Serviços Técnicos' },
  { id: 'diag-09', label: 'Diagnóstico 09: Prontidão para Assistentes & Chatbots' },
  { id: 'diag-10', label: 'Diagnóstico 10: Maturidade no Ciclo de Vida Agêntico' },
];

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  endpointUrl = 'https://us-central1-e3m-portal-tec.cloudfunctions.net/subscribeNewsletter',
  sourceUrl,
  defaultLeadMagnetId = '',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [leadMagnetId, setLeadMagnetId] = useState(defaultLeadMagnetId);
  const [consentLgpd, setConsentLgpd] = useState(false);
  const [honeypotWebsite, setHoneypotWebsite] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentLgpd) {
      setStatus('error');
      setErrorMessage('O consentimento com a política de privacidade (LGPD) é obrigatório.');
      return;
    }

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Por favor, informe um endereço de e-mail corporativo válido.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const payload = {
        email: email.trim(),
        name: name.trim() || undefined,
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        leadMagnetId: leadMagnetId || undefined,
        consentLgpd: true,
        honeypotWebsite: honeypotWebsite.trim() || undefined,
        sourceUrl: sourceUrl || (typeof window !== 'undefined' ? window.location.href : undefined),
      };

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data?.message || 'Ocorreu um erro ao registrar sua inscrição. Tente novamente.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Falha na conexão com o servidor. Verifique sua conexão e tente novamente.');
    }
  };

  return (
    <div className={`glass-panel border border-accent-cyan/30 p-8 rounded-2xl relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <span className="text-accent-cyan border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            Newsletter E3M & Diagnósticos B2B
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-2">
            Engenharia de Software, Cloud & IA na Prática
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Receba insights técnicos profundos, análises de arquitetura e receba gratuitamente relatórios 
            dos nossos utilitários interativos direto no seu e-mail corporativo.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center animate-fade-in">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Inscrição Confirmada com Sucesso!</h4>
            <p className="text-sm text-slate-300">
              {leadMagnetId 
                ? 'Seu relatório do diagnóstico e a edição de boas-vindas foram enviados para o seu e-mail.' 
                : 'Você agora faz parte da nossa comunidade executiva. Fique atento à sua caixa de entrada.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Anti-bot Honeypot field (hidden visually and from screen readers) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="website-url">Website</label>
              <input
                id="website-url"
                type="text"
                value={honeypotWebsite}
                onChange={(e) => setHoneypotWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Seu Nome</label>
                <input
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="voce@empresa.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Empresa</label>
                <input
                  type="text"
                  placeholder="Nome da sua organização"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cargo / Função</label>
                <input
                  type="text"
                  placeholder="Ex: Diretor de Tecnologia, CTO"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Diagnóstico Técnico Especializado (Opcional)
              </label>
              <select
                value={leadMagnetId}
                onChange={(e) => setLeadMagnetId(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-accent-cyan transition-colors"
              >
                {DIAGNOSTIC_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              {leadMagnetId && (
                <div className="mt-2.5 p-3 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <span className="text-cyan-400 font-bold">⚡</span>
                    <span>Deseja calcular seu Score e ROI quantitativo agora em ~90s?</span>
                  </div>
                  <a
                    href="https://e3m-roai.web.app/#catalogo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors shrink-0"
                  >
                    Opere a calculadora viva no RO.AI →
                  </a>
                </div>
              )}
            </div>


            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentLgpd}
                  onChange={(e) => setConsentLgpd(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-900 text-accent-cyan focus:ring-accent-cyan/50 focus:ring-offset-0"
                />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Concordo em receber comunicações técnicas da E3M Solutions e declaro ciência da{' '}
                  <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-accent-cyan underline hover:text-white">
                    Política de Privacidade (LGPD)
                  </a>. É possível cancelar a inscrição a qualquer momento.
                </span>
              </label>
            </div>

            {status === 'error' && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-violet hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-accent-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Processando inscrição...</span>
                </>
              ) : (
                <span>Inscrever-se na Newsletter & Receber Diagnóstico</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
