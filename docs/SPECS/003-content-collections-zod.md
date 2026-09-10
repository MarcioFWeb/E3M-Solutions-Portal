# SPEC-003: Content Collections & Schema Zod

> **Status:** Aberta para Revisão  
> **Ciclo:** Ciclo 1 (Sistema de Conteúdo e Feed do Blog)  
> **Nota SDD:** Esta especificação é temporária. Ao ser concluída e validada, será registrada no commit e excluída do disco.

---

## 1. Objetivo
Estruturar o coração do gerenciamento de conteúdo da aplicação através da API de Content Collections do Astro v5. Isso inclui definir esquemas (schemas) robustos usando a biblioteca Zod, para tipagem estrita de posts, artigos, cases e experimentos. Como teste inicial, criar três arquivos MDX representativos do domínio da E3M.

## 2. Escopo Técnico

### 2.1. Configuração do Schema Base (`src/content/config.ts`)
- Utilizar `defineCollection` e `z.object()` para modelar as propriedades da coleção `blog`.
- **Propriedades obrigatórias:**
  - `title` (string)
  - `description` (string, max: 200 chars)
  - `pubDate` (date)
  - `author` (string, default: 'Márcio Figueiredo')
  - `type` (enum): Deve mapear a taxonomia definida no HLD-001 (`case`, `article`, `service`, `experiment`, `saas`, `track`, `opinion`, `recommendation`).
- **Propriedades opcionais:**
  - `updatedDate` (date)
  - `heroImage` (string)
  - `tags` (array of strings)

### 2.2. Diretório de Conteúdos
- Criar o diretório `src/content/blog/`.
- Habilitar e configurar adequadamente o processamento MDX no projeto. (Nota: `astro.config.mjs` já possui `mdx()` importado).

### 2.3. Curadoria de Conteúdos MDX Iniciais
Criar 3 posts iniciais representativos do acervo E3M em `src/content/blog/`:
1. `01-case-emissoras-arquitetura.mdx`:
   - **Type**: `case`
   - **Assunto**: Escalabilidade na nuvem e processamento de vídeos para emissoras de grande porte.
2. `02-arquitetura-serverless.mdx`:
   - **Type**: `article`
   - **Assunto**: Benefícios da arquitetura Serverless (Cloud Run, Functions) para redução de custos.
3. `03-engenharia-com-ia.mdx`:
   - **Type**: `opinion`
   - **Assunto**: A revolução da automação de software através de desenvolvimento agêntico e IA integrada.

## 3. Critérios de Aceite
1. O arquivo `src/content/config.ts` é criado com sucesso usando Zod.
2. O diretório de posts (`src/content/blog/`) é criado e populado com os 3 artigos em formato `.mdx`.
3. Os artigos compilam corretamente e têm frontmatter válido que não dispara erros na validação do Zod.
4. O build da aplicação (`npm run build`) termina sem falhas ou avisos de schema.
