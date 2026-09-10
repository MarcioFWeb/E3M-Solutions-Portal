Para atender aos seus dois cenários com uma solução comum, o caminho ideal é a adoção de um **Gerador de Sites Estáticos (SSG)** fortemente acoplado ao **MDX** (Markdown com componentes React) e um **Harness Agêntico** rodando localmente na sua IDE (VS Code ou Antigravity).

### **01: Ideação, Decisões e Padrões Arquiteturais**

**O Framework: Astro (com integração React)** Para o seu stack e objetivo, o Astro é atualmente a melhor opção de mercado. Ele gera HTML puramente estático (zero banco de dados, máxima otimização de SEO para a E3M Solutions) e permite o uso de componentes React de forma "ilhada" (apenas onde precisa de interatividade). O formato de escrita será o **MDX**, que é o padrão que os LLMs mais dominam para gerar documentação estruturada com mídia embutida.

**Hospedagem e Infraestrutura (GitLab Corp e GitHub Pessoal)** Sim, é perfeitamente possível e extremamente vantajoso usar as plataformas "Pages" nativas.

> * **Corporativo (GitLab Pages):** É a solução definitiva para o seu cenário. O GitLab possui uma feature nativa chamada **Pages Access Control**. Com ela, o site estático gerado fica protegido pelo próprio SSO do GitLab. Apenas quem está na VPN e tem acesso ao repositório ou grupo no GitLab consegue visualizar o blog. Nenhuma infra extra ou gestão de autenticação é necessária no código.  
> * **E3M / Pessoal (GitHub Pages):** Como o repositório E3M gera um artefato estático idêntico na estrutura, o GitHub Pages hospeda gratuitamente de forma pública, com excelente performance. O apontamento de domínio personalizado (seu site/portfólio) é nativo.

**O Harness Agêntico (Operação de Conteúdo Assistida)** Para que o Gemini e o Copilot operem não apenas o código, mas a *criação e operação do blog*, o projeto deve nascer com um ecossistema de ferramentas locais utilitárias em Node.js ou Python que os agentes possam invocar.

> * **Geração e Edição:** Criação de diretórios com templates de *Frontmatter* (título, tags, SEO, descrição).  
> * **Mídias e Utilitários:** Scripts no projeto (ex: npm run agent:optimize-images) usando a biblioteca *Sharp* (Node.js) para converter imagens para .webp e redimensioná-las automaticamente. O agente sugere a imagem, aciona o script, e embute no MDX.  
> * **Diagramas:** Uso de blocos de código nativos do Mermaid.js. O agente gera o diagrama de arquitetura em texto e o Astro renderiza no build final sem precisar gerar arquivos de imagem.

### **02: Documento de Requisitos do Produto (PRD)**

Abaixo está o PRD estruturado para você instanciar no VS Code / Antigravity e solicitar a geração da base do projeto pelo seu agente preferido.

# **PRD: Plataforma Unificada de Tech Blog Estático (Agent-Driven)**

## **1\. Visão Geral do Produto**

Um ecossistema padronizado de geração de blogs técnicos estáticos, projetado para operar em dois ambientes distintos (Corporativo Privado e Público/Empresarial). A plataforma não possui banco de dados, é alimentada via arquivos MDX e sua operação (criação, edição, otimização de imagens, diagramação e SEO) é integralmente orquestrada por agentes de Inteligência Artificial operando diretamente na IDE do desenvolvedor.

## **2\. Requisitos de Negócio e Casos de Uso**

| Cenário | Público-Alvo | Hospedagem & Acesso | Distribuição de Conteúdo |
| :---- | :---- | :---- | :---- |
| **Corporativo** | Times internos, engenharia, squads de produto. | GitLab Pages (Privado). Acesso restrito via VPN e SSO nativo do GitLab. | Documentação de arquitetura, spikes, tutoriais de onboarding, vídeos de tech talks internos. |
| **Público (E3M)** | Comunidade tech, prospecção de clientes, portfólio. | GitHub Pages (Público). Domínio personalizado. | Artigos técnicos, tutoriais, SEO orgânico, republicação automática ou manual no LinkedIn. |

## **3\. Decisões Arquiteturais e Stack**

> * **Framework Principal:** Astro (Static Site Generation).  
> * **Engine de Renderização UI:** React (apenas para componentes interativos isolados).  
> * **Linguagem:** TypeScript e MDX (Markdown for the component era).  
> * **Estilização:** TailwindCSS (para estilização rápida via prompts contextuais e facilidade de manutenção em temas Dark/Light).  
> * **Diagramação:** Mermaid.js (Diagrams as Code).  
> * **Processamento de Mídia:** Node.js \+ biblioteca Sharp (para automação local).

## **4\. Estrutura do Harness Agêntico (AI Toolkit)**

O repositório base conterá uma pasta oculta .agentharness com instruções, regras de contexto (ex: .cursorrules, prompts/) e scripts utilitários que as IAs (Copilot Pro / Gemini Pro) deverão acionar durante a operação diária.

### **4.1. Operações Suportadas pelos Agentes**

> 1. **Draft to Post:** O usuário joga um arquivo .txt solto de anotações e pede ao agente: *"Transforme em um artigo técnico"*. O agente deve formatar em MDX, gerar o Frontmatter correto e salvar em src/content/blog/.  
> 2. **SEO Optimizer:** O agente revisa um rascunho MDX e preenche as tags, descrição com limites exatos de caracteres, URL canônica e gera sugestão de título.  
> 3. **Image Pipeline:** Quando o usuário adiciona uma imagem pesada (.png ou .jpg) na pasta, o agente deve sugerir e executar o comando de terminal preexistente npm run optimize-media, que converte a imagem para .webp, gera tamanhos responsivos e atualiza as tags no arquivo MDX.  
> 4. **Diagram Generation:** O agente converte explicações de fluxo (ex: "um client chama uma API Gateway que joga num tópico Kafka") diretamente para a sintaxe Markdown do Mermaid.js dentro da postagem.

## **5\. Estrutura do Conteúdo (MDX)**

Cada postagem técnica deverá seguir um contrato estrito de Frontmatter para garantir que o pipeline SSG construa as páginas corretamente, alimente o RSS e prepare as tags meta para redes sociais.

`---`  
`title: "Título SEO Otimizado do Artigo"`  
`description: "Resumo de até 160 caracteres para SEO."`  
`date: 2026-09-08`  
`author: "Marcio Figueiredo"`  
`tags: ["React", "Nodejs", "GenAI"]`  
`coverImage: "./assets/destaque-otimizado.webp"`  
`draft: false`  
`type: "tutorial" # ou "spike", "portfolio", "news"`  
`---`

`# Introdução`  
`Conteúdo dinâmico aqui...`

`<Callout type="warning">Componente React embutido no MDX alertando sobre depreciação de API.</Callout>`

## **6\. Pipelines de Integração e Deploy (CI/CD)**

O sistema deve ser autônomo na entrega e construído em código. O agente base deverá gerar os arquivos de pipeline de acordo com a origem do repositório.

### **6.1. Pipeline GitHub (Público)**

> * **Trigger:** Push na branch main.  
> * **Steps:** Checkout do código, Setup do Node.js, npm ci, build do Astro, publicação do artefato no branch gh-pages ou deploy nativo no ambiente GitHub Pages.

### **6.2. Pipeline GitLab (Corporativo)**

> * **Trigger:** Push na branch master/main.  
> * **Steps:** Imagem Docker Node Alpine. Rodar testes estáticos de markdown e linter. Rodar o build do Astro gerando a pasta public. Fazer o upload do artefato.  
> * **Segurança:** A configuração do repositório no GitLab deve estar com o Pages access control ativado (Project Members only).

## **7\. Passos para Inicialização Agêntica (Prompt de Setup)**

*Para iniciar a codificação deste PRD na IDE, instrua o agente com o seguinte fluxo:*

> 1. Gerar a estrutura inicial usando create-astro@latest.  
> 2. Configurar a pasta src/content/blog com schema de validação Zod para o Frontmatter.  
> 3. Criar os componentes React base de tipografia (Headings, Blockquotes, Code Blocks e Callouts).  
> 4. Configurar as integrações do Astro: @astrojs/mdx, @astrojs/react e @astrojs/tailwind.  
> 5. Criar a pasta ./scripts com utilitários de tratamento de imagem em Node.js (com Sharp).  
> 6. Gerar os templates de CI/CD para GitHub Actions e GitLab CI no padrão configurado neste PRD.