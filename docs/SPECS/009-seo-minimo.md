# SPEC-009: SEO Mínimo para `e3m.dev.br` (OpenGraph, Sitemap, RSS, Robots)

> **Status:** Registrada — aguardando ordem de execução (NÃO executar sem autorização expressa)
> **Ciclo:** Ciclo 3 (Polimento, Harness Agêntico Avançado e Domínio Próprio)
> **Origem:** Fatiamento do item SEO de `SPEC-007`. `SPEC-007` permanece válida apenas para `sharp`/automação agêntica e Lighthouse.
> **Nota SDD:** Esta especificação é temporária. Ao ser concluída e validada, será registrada no commit e excluída do disco.

---

## 1. Objetivo

Garantir que cada página/post do portal gere preview correto ao ser compartilhada (título, descrição, imagem, URL canônica) e seja descoberta pelo Google, agora que o domínio definitivo `e3m.dev.br` está apontado (`public/CNAME`, `site: 'https://e3m.dev.br'` em `astro.config.mjs`).

Estado atual (fato): `src/layouts/Layout.astro` (linhas 12–24) emite apenas `description` genérica, sem `canonical`, `og:*` ou `twitter:*`; não há integração de sitemap, feed RSS, `robots.txt` nem imagem OG padrão versionada.

---

## 2. Escopo Técnico

### 2.1 Head SEO em `src/layouts/Layout.astro`

Estender `Props` com campos opcionais (mantendo `title` obrigatório):

- `description?` (fallback: `"E3M Solutions — Engenharia de Software, Nuvem & IA descomplicadas."`)
- `image?` (fallback: `/images/og-default.png`)
- `canonical?` (fallback: URL absoluta derivada de `Astro.site` + `Astro.url.pathname`)
- `type?` (`"website"` | `"article"`, default `"website"`)
- `pubDate?` (para `article:published_time`)

Emitir no `<head>`:

- `<link rel="canonical">` (URL absoluta via `site`, NÃO via `getPath()` — OG/canonical exigem absoluta; `getPath()` segue para assets internos)
- `og:title`, `og:description`, `og:url`, `og:site_name` (`E3M Solutions`), `og:locale` (`pt_BR`), `og:type`, `og:image` (absoluta)
- `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`
- `theme-color`, `description` por página, `article:published_time` + `article:author` quando `type === "article"`

Página de leitura (`src/pages/blog/[id]` ou equivalente): alimentar as props com o frontmatter (`title`, `description`, `heroImage`, `pubDate`) e forçar `type="article"`.

### 2.2 Imagem OG padrão

- Criar `public/images/og-default.png` (1200×630) com identidade E3M (mote: "Engenharia Prática, IA, Resultados").
- Posts sem `heroImage` usam o default; posts com `heroImage` local usam o próprio cover (URL absoluta).

### 2.3 Sitemap (`@astrojs/sitemap` em `astro.config.mjs`)

- Adicionar a integração ao lado de `react()` e `mdx()`.
- Incluir apenas rotas públicas: `/`, `/blog`, `/blog/*`, `/cases`, `/sobre`, `/servicos`, `/contato` (+ `/privacidade`, `/termos` se desejado).
- Excluir `404`, rascunhos e rotas internas.
- Validar `dist/sitemap-index.xml` após o build.

### 2.4 RSS (`src/pages/rss.xml.js`)

- Feed único em `/rss.xml` (path padrão recomendado).
- Fonte: `src/content/blog/` (17 posts atuais: 12 `case` + 5 `artigo`), ordenados por `pubDate` desc.
- Itens com `title`, `description`, `pubDate`, `link` absoluto (via `site`) e categoria = `type` do frontmatter.
- Incluir `case` e `artigo`; `video` entra automaticamente quando o primeiro post desse tipo for publicado.

### 2.5 `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://e3m.dev.br/sitemap-index.xml
```

---

## 3. Arquivos Envolvidos

| Arquivo | Ação |
|---|---|
| `src/layouts/Layout.astro` | Estender `Props` + emitir tags SEO |
| `src/pages/blog/[id]` (reader) | Passar frontmatter para o Layout (`type="article"`) |
| `astro.config.mjs` | Adicionar `@astrojs/sitemap` (+ dependência em `package.json`) |
| `src/pages/rss.xml.js` | Criar feed RSS |
| `public/robots.txt` | Criar |
| `public/images/og-default.png` | Criar (1200×630) |

---

## 4. Critérios de Aceite

1. `<head>` de `/`, `/blog/<id>` e `/cases` contém `canonical`, `og:*` e `twitter:*` com URLs absolutas `https://e3m.dev.br/...`.
2. Post com `heroImage` expõe o próprio cover no `og:image`; página sem cover expõe `og-default.png`.
3. `npm run build` gera `dist/sitemap-index.xml`, `dist/rss.xml` e `dist/robots.txt` sem erros (`npx astro check` limpo).
4. `/rss.xml` lista os posts ordenados por `pubDate` desc, com links absolutos e categoria = `type`.
5. Nenhuma rota de rascunho/404 aparece no sitemap.

---

## 5. Verificação Pós-Implementação

- `npm run build` + checar existência de `dist/sitemap-index.xml`, `dist/rss.xml`, `dist/robots.txt`.
- `npm run preview` + `curl` nos 3 arquivos + inspeção do `<head>` em `/`, `/blog/<id>`, `/cases`.
- Compartilhar 1 URL em validador OpenGraph (opcional) + registrar `e3m.dev.br` no Search Console após o deploy.

---

## 6. Fora de Escopo (fatia 3 / `SPEC-007` remanescente)

- Otimização de imagens (`sharp`, responsivas).
- `JSON-LD` / dados estruturados.
- Meta fina por `tags`.
- i18n e perseguição de Lighthouse 100 full (Core Web Vitals).

## 7. Riscos e Decisões Registradas

- OG/canonical usam URL absoluta (`Astro.site`); `getPath()` permanece apenas para assets internos.
- Feed único `/rss.xml` em vez de `/blog/rss.xml` (padrão mais descoberto).
- RSS inclui `case` + `artigo` (categoria = `type`); `video` entra por consequência quando existir.
- Imagem default nova (`og-default.png`) em vez de reutilizar cover existente, para mensagem institucional consistente.
