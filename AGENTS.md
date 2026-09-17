## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Arquitetura de Conteúdo: Categorias/Tipos e Tags

A coleção de conteúdo `blog` (`src/content/blog/`) atende tanto artigos técnicos quanto estudos de caso (cases) e vídeos através de uma tipagem rigorosa:

### 1. Tipos / Categorias (`type`)
O campo `type` é estrutural, determina o layout/badge e os filtros de exibição nas páginas:
- **`case`**: Estudos de caso, histórico de projetos e resultados reais de clientes. Exibido prioritariamente em `/cases`.
- **`artigo`**: Artigos técnicos aprofundados, opiniões, tutoriais de engenharia de software, nuvem e IA. Exibido em `/blog`.
- **`video`**: Vídeos, gravações de palestras, demos ou webcasts técnicos. Exibido em `/blog`.

### 2. Tags (`tags`)
O campo `tags` contém classificadores temáticos flexíveis (estilo hashtags), sempre em minúsculas e sem `#`:
- Exemplos: `ia`, `agente`, `cloud`, `gcp`, `aws`, `frontend`, `backend`, `react`, `mobile`, `arquitetura`, `serverless`, `agile`, `testes`, `devops`.

### 3. Imagens Locais
Todos os posts que utilizam imagens de capa (`heroImage`) ou imagens de conteúdo devem ter seus assets salvos dentro do projeto (ex: `public/images/blog/covers/` ou `public/images/posts/`). Não depender de CDNs externas (como Hashnode ou Unsplash direto) para garantir resiliência e independência do portal.

