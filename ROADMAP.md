# ROADMAP - E3M Solutions Tech Portal

Este roadmap governa a sequência de entregas e especificações técnicas (SPECs) do projeto.
Cada item deve ser implementado via uma **SPEC temporária** em `docs/SPECS/`, executada, validada e posteriormente arquivada/removida, mantendo o histórico de commits como registro definitivo.

---

## Ciclo 0: Fundação Mínima & Ativação Remota (Concluído)
*Objetivo: Estabelecer a aplicação básica funcional, layout inicial e pipeline de deploy contínuo em GitHub Pages.*

- [x] **Setup Estrutural**: Criação das pastas de governança (PRD, HLD, LLD, SPECS, ADR) e Agent Harness.
- [x] **Scaffold Astro v5**: Configuração de base com React, MDX, Tailwind v4 e Glassmorphism.
- [x] **HLD-001**: Arquitetura de Conteúdo, Taxonomia e Curadoria de Referências (`docs/HLD/001-arquitetura-de-conteudo-e-informacao.md`).
- [x] **SPEC-001: Layout Global e Página Base Minimalista**
  - Criação do Layout Astro mestre (`src/layouts/Layout.astro`) com fontes Inter/Roboto, import de `global.css`, Header Glassmorphism e Footer básico.
  - Página Home temporária (`src/pages/index.astro`) exibindo o título, proposta da E3M e menu de navegação.
- [x] **SPEC-002: Inicialização Git, Conexão com Repositório Remoto e Deploy Inicial**
  - Inicialização do repositório Git local.
  - Adição de `.gitignore` completo para Node/Astro/IDE.
  - Commit inicial estrutural.
  - Conexão com repositório remoto no GitHub e configuração do pipeline GitHub Pages (`.github/workflows/deploy.yml`).
  - Validação da primeira URL pública gerada no GitHub Pages (ex: `marciofweb.github.io/e3m-portal-tech`).

---

## Ciclo 1: Sistema de Conteúdo e Feed do Blog (Concluído)
*Objetivo: Estruturar a Content Collection com validação Zod e permitir a publicação de artigos, cases e tutoriais.*

- [x] **SPEC-003: Content Collections & Schema Zod**
  - Definição em `src/content.config.ts` com validação Zod e tipos vigentes (`case`, `artigo`, `video`).
  - Criação de 3 posts iniciais extraídos do acervo real da E3M (posteriormente migrados para `.md`).
- [x] **SPEC-004: Página do Blog & Leitura de Posts MDX**
  - Rota `/blog`: Listagem implementada com filtros interativos via React (`BlogFeed.tsx`).
  - Rota `/blog/[id]`: Template dinâmico de leitura configurado com `@tailwindcss/typography` adaptado ao Dark Glassmorphism.

---

## Ciclo 2: Landing Page Institucional & Páginas Estáticas (Concluído)
*Objetivo: Transformar o portal em uma ferramenta de apresentação e geração de oportunidades para a E3M.*

- [x] **SPEC-005: Landing Page Completa & Correção de Roteamento (Base URL)**
  - Utilitário de caminhos e rotas `src/utils/paths.ts` (inicialmente respeitando `base` do GitHub Pages; hoje `astro.config.mjs` usa `site: 'https://e3m.dev.br'` sem subdiretório).
  - Hero Section de alto impacto com Glassmorphism, métricas e headline clara sobre os 25 anos de experiência.
  - Seção de Especialidades e Serviços em 3 verticais (Modernização em Nuvem, Agentes de IA, FinOps e Governança).
  - Seção de Artigos Recentes consumindo diretamente os 3 últimos posts da Content Collection.
  - Banners institucionais de conversão: "Tem um desafio crítico?", "Agende um Diagnóstico Estratégico".
- [x] **SPEC-006: Páginas Institucionais**
  - `/sobre`: História da E3M, Manifesto de Engenharia (anti-overengineering, foco no cliente, capacitação total), liderança sênior de Marcio Figueiredo (+30 anos desde 1996) e link LinkedIn.
  - `/servicos`: 5 verticais detalhadas (IA & Agentes, Mentoria & CTO as a Service, Atendimento Inteligente & WhatsApp, Dev Customizado/Cloud/Licitações, Staff Augmentation com Gestão Integrada) e metodologia "Como Trabalhamos".
  - `/contato`: Canais diretos (WhatsApp e E-mail), destaque do Diagnóstico Gratuito (30 min) e formulário interativo de contato.
  - `/privacidade` e `/termos`: Páginas completas de compliance sob a legislação brasileira (LGPD, confidencialidade, NDA e termos de serviços de TI).
  - `/cases`: Página de estudos de caso e projetos reais da E3M conectados à Content Collection.

---

## Ciclo 3: Polimento, Harness Agêntico Avançado e Domínio Próprio (Parcial — domínio concluído, performance pendente)
*Objetivo: Elevar a maturidade visual e operacional e apontar o domínio definitivo.*

- [x] **SPEC-008: Apontamento de Domínio Personalizado (`e3m.dev.br`)**
  - `public/CNAME` com `e3m.dev.br` e `site: 'https://e3m.dev.br'` em `astro.config.mjs`.
  - Deploy segue via GitHub Pages (`.github/workflows/deploy.yml`, Node 22).
- [x] **Conteúdo: migração Hashnode**
  - 17 posts em `src/content/blog/` (12 `case` + 5 `artigo`), em `.md` com imagens locais e filtros dedicados em `/blog` e `/cases`.
- [x] **Contato: backend Firebase + Resend**
  - `functions/` (Node 22, `firebase-functions`, `firebase-admin`, `resend`, `cors`) integrado ao formulário de `/contato`; config em `firebase.json` + `.firebaserc`.
- [x] **Social/Footer**
  - Links GitHub `marciofweb`, LinkedIn empresa, X e YouTube `@marciofweb`; remoção do LinkedIn pessoal do rodapé; foto de perfil.
- [ ] **SPEC-007: Automação Agêntica e Otimização de Performance** (restante — SEO fatiado para `SPEC-009`)
  - Scripts de otimização de imagens (`sharp`) e geração de drafts MDX pelo Agent Harness.
  - Otimização para 100 no Lighthouse (Core Web Vitals).
- [ ] **SPEC-009: SEO Mínimo para `e3m.dev.br`** — registrada em `docs/SPECS/009-seo-minimo.md`, **aguardando ordem de execução**
  - Head SEO em `Layout.astro` (`canonical`, `og:*`, `twitter:*`) + `og-default.png`.
  - Sitemap (`@astrojs/sitemap`), RSS (`/rss.xml`) e `robots.txt`.
