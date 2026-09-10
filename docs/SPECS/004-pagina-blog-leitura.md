# SPEC-004: Página do Blog & Leitura de Posts MDX

> **Status:** Aberta para Revisão  
> **Ciclo:** Ciclo 1 (Sistema de Conteúdo e Feed do Blog)  
> **Nota SDD:** Esta especificação é temporária. Ao ser concluída e validada, será registrada no commit e excluída do disco.

---

## 1. Objetivo
Construir a interface voltada para o usuário (UI) para o consumo da `Content Collection` de blog definida na SPEC-003. O objetivo é entregar a página de listagem dos artigos com filtragem por categorias e as páginas individuais de leitura (dinâmicas), mantendo o padrão visual *Dark Glassmorphism* e utilizando a estilização tipográfica apropriada para o formato Markdown/MDX.

## 2. Escopo Técnico

### 2.1. Rota de Listagem (`src/pages/blog/index.astro`)
- **Consulta de Dados:** Utilizar `getCollection('blog')` do módulo `astro:content` para resgatar todos os posts.
- **Ordenação:** Ordenar os artigos por `pubDate` de forma decrescente (mais recentes primeiro).
- **Interface Visual (Glassmorphism):**
  - Hero Header para a seção de Blog ("Artigos, Cases e Reflexões").
  - Grid responsivo (1 coluna mobile, 2 ou 3 em desktop) exibindo os *cards* de cada post.
  - Cada *card* (`.glass-card`) deve exibir: Título, Descrição, Data formatada, Tipo (como uma pílula/badge) e as Tags.
- **Filtros Interativos (Opcional/React):**
  - Implementar uma área de pílulas (badges) com os tipos disponíveis (`case`, `article`, `opinion`, etc.).
  - Como a integração com `@astrojs/react` está ativa, pode-se criar um componente React (ex: `BlogFeed.tsx` com diretiva `client:load`) para gerenciar o estado do filtro sem recarregar a página, ou gerenciar isso via Vanilla JS / CSS. Fica a critério da implementação visando a melhor performance e UX.

### 2.2. Rota de Leitura Dinâmica (`src/pages/blog/[id].astro`)
- **Geração Estática:** Implementar a função obrigatória `export async function getStaticPaths()` que itera sobre `getCollection('blog')` e retorna as rotas baseadas no `id` de cada post.
- **Renderização MDX:** 
  - Utilizar a função auxiliar `render(post)` importada de `astro:content` (Astro v5) para extrair o componente `<Content />`.
- **Estilização Tipográfica:**
  - O conteúdo renderizado deve ser envolvido em uma tag `article` ou `div` com as classes do plugin oficial do Tailwind: `prose prose-invert`.
  - Ajustar o esquema de cores do `prose` (através de extensões no Tailwind se necessário) para casar perfeitamente com o fundo Midnight e efeitos de vidro, garantindo excelente leiturabilidade (contrast ratio).
- **Cabeçalho do Post:**
  - Exibir o Título como H1, Metadados (Data, Autor, Tempo estimado de leitura caso desejado) e Tipo de artigo.
- **Botões de Ação:** Um botão "Voltar para o Blog".

### 2.3. Estilização Global de Markdown
- Garantir que elementos como Blocos de Código (fenced code blocks) funcionem corretamente e tenham um visual compatível com o tema escuro.

## 3. Critérios de Aceite
1. O acesso à rota `/blog` lista com sucesso os 3 artigos de exemplo gerados na SPEC-003.
2. É possível filtrar a listagem pelo `type` do artigo de forma funcional.
3. O clique em um card direciona corretamente para a rota `/blog/slug-do-arquivo`.
4. A leitura do post ocorre de forma fluida, o texto é legível e o plugin de tipografia do Tailwind (`prose`) foi aplicado sem quebrar o layout global.
5. O comando `npx astro check` e `npm run build` passam sem erros, advertências ou dicas (hints) relacionadas ao novo código.
