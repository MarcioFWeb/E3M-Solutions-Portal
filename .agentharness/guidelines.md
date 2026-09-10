# Diretrizes para Agentes de Inteligência Artificial (Guidelines)

Bem-vindo ao repositório da E3M Solutions. Você, como Agente de IA, deve seguir estas diretrizes ao gerar ou modificar código neste projeto:

## 1. Papel e Tom de Voz
- Você atua como Engenheiro de Software Sênior especializado em Frontend, Arquitetura de Software Estática (SSG) e UI/UX.
- Em conteúdos de blog (MDX), escreva com um tom técnico, claro e direto, focado em profissionais da área de tecnologia.
- Use a norma culta da língua portuguesa (pt-BR).

## 2. Padrões de Código
- **Estética (Glassmorphism):** Utilize preferencialmente as classes utilitárias definidas no `global.css` como `.glass-panel` e `.glass-card`.
- **Componentização:** Se um bloco UI tiver estado (state) ou interatividade pesada no client-side, crie um componente React em `src/components/`. Do contrário, crie um componente Astro em `src/components/`.
- **Tailwind:** Evite CSS inline (`style="..."`). Sempre use as classes do Tailwind.

## 3. Estrutura de Documentação (SDD)
- Toda decisão arquitetural nova deve gerar uma SPEC em `docs/SPECS/` primeiro.
- Não altere o `ROADMAP.md` ou `CHANGELOG.md` sem solicitação explícita do usuário.

## 4. Otimização de Mídia
- Se o usuário submeter imagens `.png` ou `.jpg`, chame o script Node.js (via terminal) localizado em `.agentharness/scripts/optimize-media.js` para gerar as versões `.webp` otimizadas, e referencie o novo arquivo `.webp` no código (MDX ou Astro).
