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

## Fluxo de Publicação (E3M Content Studio)

O portal E3M utiliza um fluxo descentralizado para a geração de conteúdo assistida por IA (Gemini / NotebookLM). Os rascunhos, vídeos e mídias **não** devem ser versionados neste repositório até que estejam prontos para publicação.

### Regras do Estúdio
- O ambiente de rascunhos vive no Google Drive mapeado localmente e referenciado pela variável `E3M_CONTENT_STUDIO_PATH` no arquivo `.env`.
- **Rascunhos:** Ficam em `$E3M_CONTENT_STUDIO_PATH/workspace/rascunhos/`.
- **Vídeos da IA (NotebookLM):** Ficam em `$E3M_CONTENT_STUDIO_PATH/midia/videos_notebooklm/`.
- Quando um artigo estiver aprovado no Kanban do Drive, ele deve ser promovido para a pasta `src/content/blog/` e sua imagem de capa para `public/images/blog/covers/`.
- Existe uma skill do Antigravity (`e3m-content-studio`) desenhada especificamente para auxiliar nesta promoção de conteúdo. Use o script utilitário `scripts/publish-article.js` caso queira automatizar a movimentação de arquivos via linha de comando.
