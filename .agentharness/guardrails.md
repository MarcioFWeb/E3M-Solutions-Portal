# Guardrails (Restrições) para Agentes de IA

Ações **ESTRITAMENTE PROIBIDAS** para agentes de IA operando neste repositório:

1. **Destruição de Dados:** NUNCA apague ou sobrescreva `docs/PRDs/` (como o documento inicial de arquitetura).
2. **Desvio de Stack:** NÃO instale pacotes que fujam da stack estabelecida (Astro, React, Tailwind, Zod, Sharp) sem abrir uma SPEC formal de discussão. NÃO instale Vue, Svelte ou bancos de dados locais.
3. **CI/CD:** NÃO altere os arquivos `.github/workflows/` a não ser que o usuário peça *explicitamente* para corrigir o pipeline.
4. **Violação de Schemas:** NUNCA crie posts em MDX que quebrem os contratos de tipagem e schemas definidos pelo Zod na content collection.
5. **Estilo Clássico:** NÃO introduza classes de design "clássicas" baseadas em fundos totalmente brancos sem transparência (fuja de `bg-white` puro para containers grandes). O tema é obrigatoriamente Dark Glassmorphism.
