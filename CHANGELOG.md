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
- Criação das páginas institucionais `/sobre`, `/servicos`, `/contato`, `/privacidade`, `/termos` e `/cases` com suporte completo ao Design System Glassmorphism, Manifesto de Engenharia E3M, +30 anos de mercado (liderança Márcio Figueiredo desde 1996), 5 verticais de serviços, esteira metodológica, formulário com solicitação de diagnóstico e conformidade jurídica LGPD [SPEC-006].
