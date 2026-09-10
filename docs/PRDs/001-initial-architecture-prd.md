# PRD: Tech Blog & Portal Institucional E3M Solutions (Agent-Driven)

## 1. Visão Geral
Este documento estabelece as bases arquiteturais, de design e fluxo de trabalho para a versão inicial (v1) do portal institucional e tech blog da **E3M Solutions**. O projeto é guiado por metodologias de **Agent-Driven Development (SDD)** e utilizará geração de sites estáticos (SSG) para otimizar performance, SEO e custos, sendo publicado exclusivamente via **GitHub Pages**.

## 2. Direcionamento de Design (UI/UX)
O projeto adotará uma estética **Premium, Escura e Moderna**.
*   **Tema Geral:** Dark Mode obrigatório como estilo primário.
*   **Estilo Visual:** *Glassmorphism* (Efeito de vidro fosco). O uso extensivo de fundos translúcidos (`backdrop-blur`), bordas sutis brilhantes e sombras profundas para criar camadas de profundidade sem sobrecarregar a visão.
*   **Tipografia:** Moderna e de altíssima legibilidade. Prioridade para **Inter** (estilo tech/clean) ou **Roboto** para todo o corpo de texto e títulos.
*   **Paleta de Cores (Diretriz Base):**
    *   *Backgrounds:* Tons extremamente escuros como Midnight Blue (`#020617`) ou Slate muito escuro (`#0f172a`).
    *   *Superfícies (Vidro):* Fundos transparentes (`bg-white/5` a `bg-white/10`) com bordas delicadas (`border-white/10`).
    *   *Texto:* Branco brilhante para contraste máximo em títulos (`text-slate-50`) e cinza claro acalmado (`text-slate-400`) para parágrafos longos.
    *   *Acentos (Calls to Action):* Gradientes vivos em Cyan e Violeta ou tons que remetam a tecnologia de ponta.

## 3. Fluxo de Documentação e Ciclo de Vida (SDD)
O repositório do projeto conterá sua própria gestão de produto, evolução e decisões:
*   **Gestão de Evolução:** Arquivos `ROADMAP.md` e `CHANGELOG.md` na raiz.
*   **Documentação Estruturada (`docs/`):**
    *   `docs/PRDs/`: Mantém a visão de produto e requisitos (onde este arquivo reside).
    *   `docs/SPECS/`: **Temporárias**. Durante cada ciclo de desenvolvimento, as *Specs* serão criadas aqui. Ao finalizar o ciclo, a Spec é referenciada (no log de commits/changelog) e **apagada**. Seu registro definitivo fica apenas no Git history.
    *   `docs/ADR/` (Architecture Decision Records): Para registrar mudanças arquiteturais complexas.
    *   `docs/HLD/` e `docs/LLD/`: Diagramas e documentos de High Level e Low Level Design.

## 4. Arquitetura Tecnológica
*   **Framework Principal:** Astro (SSG).
*   **Renderização Interativa:** React (Arquitetura de Ilhas).
*   **Conteúdo Base:** Arquivos `.mdx` validados com Zod.
*   **Estilização:** Tailwind CSS (essencial para agilizar o design Glassmorphism via prompts).
*   **Mídia e Diagramação:** Mermaid.js e pipeline Node.js local (`sharp`) para compressão de `.webp`.
*   **Publicação:** GitHub Actions conectada ao GitHub Pages.

## 5. Agent Harness (Arcabouço Agêntico)
Um conjunto completo de utilitários para garantir consistência em ambientes de IA (VS Code/Cursor/Antigravity/Copilot).
*   **Pasta `.agentharness/`**: Conterá `guidelines.md` (como o agente deve agir), `guardrails.md` (o que NUNCA fazer), ferramentas (`scripts/`) e configurações adicionais.
*   **Metadados IA:** Configurações como `.cursorrules` ou arquivos `.github/copilot-instructions.md` serão criados para reforçar o contexto do agente IDE.

---
*Este PRD é um documento vivo que guiará a inicialização estrutural e os próximos ciclos de SPECS.*
