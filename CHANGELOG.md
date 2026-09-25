# CHANGELOG

Todas as modificações notáveis neste projeto serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [Unreleased]

### Added
- Documento PRD Inicial `001-initial-architecture-prd.md`.
- Documento HLD-001 `001-arquitetura-de-conteudo-e-informacao.md` com estudo das referências e curadoria de dados.
- Estrutura de documentação (SPECS, ADR, HLD, LLD).
- ROADMAP.md refinado por Ciclos e sequenciamento de SPECs (SPEC-001 a SPEC-008).
- CHANGELOG.md e README.md.
- Implementação de Content Collections do Astro (`src/content.config.ts`) com validação estrita via Zod [SPEC-003].
- Adição dos 3 primeiros artigos MDX do acervo E3M (`case`, `article`, `opinion`).
- Criação das rotas de Blog (`/blog` e `/blog/[id]`) com filtro em React (`BlogFeed.tsx`) e renderização tipográfica (`@tailwindcss/typography`) adaptada ao design Glassmorphism [SPEC-004].
- Hotfix de roteamento de links respeitando o subdiretório do GitHub Pages (`import.meta.env.BASE_URL`) via `src/utils/paths.ts` em Header, Footer, BlogFeed e Post Reader [SPEC-005].
- Implementação da Landing Page completa em `src/pages/index.astro` com Hero Section ("25+ anos"), Métricas/Estatísticas, Cards de Especialidades/Serviços, Destaque dos 3 artigos mais recentes e Banner de Conversão Final [SPEC-005].
- Criação das páginas institucionais `/sobre`, `/servicos`, `/contato`, `/privacidade`, `/termos` e `/cases` com suporte completo ao Design System Glassmorphism, Manifesto de Engenharia E3M, +30 anos de mercado (liderança Marcio Figueiredo desde 1996), 5 verticais de serviços, esteira metodológica, formulário com solicitação de diagnóstico e conformidade jurídica LGPD [SPEC-006].
- Adequações na Landing Page e Rodapé: remoção da menção de anos de história da empresa (restringindo +30 anos exclusivamente à trajetória do Marcio), novo Hero com Opção B ("Soluções Inteligentes em Software, Nuvem e IA"), vitrine rica de tipos de solução (IA, Agentes, Automações, Integrações, SaaS, Portais, Cloud, Dev Agêntico), alinhamento dos cards de especialidades com as 5 verticais, novo CTA de conversão focado em IA/Engenharia e rodapé atualizado para "E3M Solutions. Engenharia Prática, IA, Resultados.".
- Revisão completa da página `/sobre`: alinhamento com a nova identidade institucional e serviços reais da E3M Solutions, inclusão de seção com as 5 verticais de especialidade, remoção de contagem de anos atribuída à empresa e centralização dos 30+ anos (desde 1996) na trajetória do fundador Marcio Figueiredo, acompanhado de destaque para o MBA em Inteligência Artificial Generativa (UFG) e os 3 badges oficiais de certificação do Google Cloud (Professional Cloud Developer, Professional Data Engineer e Generative AI Leader).
- Ajuste de padrão nominal: padronização para "Marcio Figueiredo" (sem acento) em todas as páginas, componentes e artigos.
- Migração de conteúdo do Hashnode: 17 posts em `src/content/blog/` (12 `case` + 5 `artigo`) em `.md` com imagens locais e filtros dedicados em `/blog` e `/cases`.
- Integração do formulário de `/contato` com Firebase Functions (Node 22) e Resend (`functions/`, `firebase.json`).
- Links sociais no rodapé: GitHub `marciofweb`, LinkedIn da empresa, X e YouTube `@marciofweb`; remoção do LinkedIn pessoal do fundador; foto de perfil.
- Domínio próprio `e3m.dev.br`: `public/CNAME` e `site: 'https://e3m.dev.br'` em `astro.config.mjs`; deploy mantido via GitHub Pages (Node 22).

