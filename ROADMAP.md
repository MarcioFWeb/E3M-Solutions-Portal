# ROADMAP - E3M Solutions Tech Portal

Este roadmap governa a sequência de entregas e especificações técnicas (SPECs) do projeto.
Cada item deve ser implementado via uma **SPEC temporária** em `docs/SPECS/`, executada, validada e posteriormente arquivada/removida, mantendo o histórico de commits como registro definitivo.

---

## Ciclo 0: Fundação Mínima & Ativação Remota (Em Andamento)
*Objetivo: Estabelecer a aplicação básica funcional, layout inicial e pipeline de deploy contínuo em GitHub Pages.*

- [x] **Setup Estrutural**: Criação das pastas de governança (PRD, HLD, LLD, SPECS, ADR) e Agent Harness.
- [x] **Scaffold Astro v5**: Configuração de base com React, MDX, Tailwind v4 e Glassmorphism.
- [x] **HLD-001**: Arquitetura de Conteúdo, Taxonomia e Curadoria de Referências (`docs/HLD/001-arquitetura-de-conteudo-e-informacao.md`).
- [x] **SPEC-001: Layout Global e Página Base Minimalista**
  - Criação do Layout Astro mestre (`src/layouts/Layout.astro`) com fontes Inter/Roboto, import de `global.css`, Header Glassmorphism e Footer básico.
  - Página Home temporária (`src/pages/index.astro`) exibindo o título, proposta da E3M e menu de navegação.
- [ ] **SPEC-002: Inicialização Git, Conexão com Repositório Remoto e Deploy Inicial**
  - Inicialização do repositório Git local.
  - Adição de `.gitignore` completo para Node/Astro/IDE.
  - Commit inicial estrutural.
  - Conexão com repositório remoto no GitHub e configuração do pipeline GitHub Pages (`.github/workflows/deploy.yml`).
  - Validação da primeira URL pública gerada no GitHub Pages (ex: `marciofweb.github.io/e3m-portal-tech`).

---

## Ciclo 1: Sistema de Conteúdo e Feed do Blog
*Objetivo: Estruturar a Content Collection com validação Zod e permitir a publicação de artigos, cases e tutoriais.*

- [ ] **SPEC-003: Content Collections & Schema Zod**
  - Definição em `src/content/config.ts` com todos os tipos (`case`, `article`, `service`, `experiment`, `saas`, `track`, `opinion`, `recommendation`).
  - Migração/curadoria de 3 posts iniciais de exemplo extraídos do acervo real da E3M (ex: Case Emissoras, Artigo Cloud/Serverless, Artigo IA/Automação).
- [ ] **SPEC-004: Página do Blog & Leitura de Posts MDX**
  - Rota `/blog`: Listagem com filtros interativos (pílulas de categoria/tipo) e busca básica.
  - Rota `/blog/[slug]`: Template de leitura do artigo com estilização tipográfica, caixas de destaque (Callouts), diagramas Mermaid e botões de compartilhamento.

---

## Ciclo 2: Landing Page Institucional & Páginas Estáticas
*Objetivo: Transformar o portal em uma ferramenta de apresentação e geração de oportunidades para a E3M.*

- [ ] **SPEC-005: Landing Page Completa (Home)**
  - Hero Section de alto impacto com Glassmorphism e headline clara sobre os 25 anos de experiência.
  - Seção de Destaques: Cases de Sucesso e Artigos recentes.
  - Seção de Serviços e Competências (Nuvem, IA, Arquitetura, Squads).
  - Banners institucionais de conversão: "Tem um projeto?", "Vamos conversar?", "Diagnóstico Gratuito".
- [ ] **SPEC-006: Páginas Institucionais**
  - `/sobre`: História da E3M, perfil de liderança de Márcio Figueiredo, filosofia de entrega.
  - `/servicos`: Detalhamento de cada frente de consultoria e engenharia.
  - `/contato`: Página com links diretos (WhatsApp comercial, E-mail, agendamento de diagnóstico).
  - `/privacidade` e `/termos`: Páginas de compliance institucional.

---

## Ciclo 3: Polimento, Harness Agêntico Avançado e Domínio Próprio
*Objetivo: Elevar a maturidade visual e operacional e apontar o domínio definitivo.*

- [ ] **SPEC-007: Automação Agêntica e Otimização de Performance**
  - Scripts de otimização de imagens (`sharp`) e geração de drafts MDX pelo Agent Harness.
  - Otimização para 100 no Lighthouse (Core Web Vitals, OpenGraph, sitemap.xml, RSS feed).
- [ ] **SPEC-008: Apontamento de Domínio Personalizado (`e3m.dev.br`)**
  - Configuração do CNAME no GitHub Pages e documentação de DNS quando aprovado pelo usuário.
