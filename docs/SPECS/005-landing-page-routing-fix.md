# SPEC-005: Landing Page Completa & Correção de Roteamento (Base URL)

> **Status:** Aberta para Revisão  
> **Ciclo:** Ciclo 2 (Landing Page Institucional & Páginas Estáticas)  
> **Nota SDD:** Esta especificação é temporária. Ao ser concluída e validada, será registrada no commit e excluída do disco.

---

## 1. Objetivo
Esta especificação possui dois objetivos primários:
1. **Correção Crítica (Hotfix):** Resolver o problema de navegação (`href`) identificado, onde os links do Header, Footer e Cards não estavam respeitando a configuração de `base: '/E3M-Solutions-Portal'` do Astro. Isso causava erros 404 durante a navegação interativa e manual localmente ou no GitHub Pages.
2. **Nova Feature:** Transformar a Home Page (`src/pages/index.astro`) de um placeholder para uma verdadeira **Landing Page Institucional** de alto impacto para a E3M Solutions, destacando experiência de mercado, serviços e conexão com os artigos recentes do blog.

## 2. Escopo Técnico

### 2.1. Correção de Roteamento (Base URL Fix)
Como o projeto está hospedado no GitHub Pages em um subdiretório, links absolutos como `href="/blog"` resolvem para a raiz do domínio (ignorando a base).
- **Ação:** Refatorar todos os links em componentes chaves para utilizar a variável de ambiente `import.meta.env.BASE_URL` nativa do Astro e Vite.
  - Onde refatorar:
    - `src/components/Header.astro` (Menu principal)
    - `src/components/Footer.astro` (Links de rodapé)
    - `src/components/BlogFeed.tsx` (Cards de acesso aos artigos) -> Utilizar `import.meta.env.BASE_URL` ou prefixo injetado.
    - `src/pages/blog/[id].astro` (Botão de "Voltar para o Blog" e tags).
    - `src/pages/index.astro` (Links de CTA).

### 2.2. Construção da Landing Page (Home)
Substituir o layout de demonstração atual de `src/pages/index.astro` por um layout estratégico e vendedor.
- **Hero Section:** 
  - Headline destacando "Mais de 25 anos de mercado" e expertise em Arquitetura, Nuvem e IA.
  - Dois CTAs principais (Primário: Agendar Diagnóstico, Secundário: Explorar Cases).
- **Seção de Serviços (Competências):**
  - Exibição em formato de cards de vidro (`glass-card`) focada em 3 grandes verticais (ex: Modernização para Nuvem, Integração de Agentes de IA, e Governança/FinOps).
- **Seção de Destaques (Feed Híbrido):**
  - Consultar a coleção de blog via `getCollection('blog')`.
  - Exibir apenas os 3 posts mais recentes diretamente na Home, com um botão "Ver todos os Artigos" que direcione para `/blog`.
- **Banners de Conversão Institucional (CTA Final):**
  - "Tem um projeto de arquitetura complexa?" -> Botão direcionando para contato.

### 2.3. Manutenção do Design System
- Garantir a utilização das classes `.glass-panel` e `.glass-card`.
- Utilizar os gradientes textuais (Cyan para Violeta) criados na SPEC-001.

## 3. Critérios de Aceite
1. **Roteamento Correto:** O clique no botão "Blog" no Header, e o clique em um *Card de Artigo*, leva com sucesso para a respectiva página usando a Base URL correta sem resultar em `Not Found (404)`.
2. A Home exibe a nova Landing Page com seções de Serviços e Feed de Artigos Recentes integrados.
3. Não existem links quebrando (dead links) nas interações principais (Home -> Blog -> Post -> Voltar para o Blog).
4. Build (`npm run build`) executado com sucesso e passando na verificação de tipagem do Astro (`astro check`).
