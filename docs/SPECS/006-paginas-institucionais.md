# SPEC-006: Páginas Institucionais (Sobre, Serviços, Contato, Compliance)

> **Status:** Aberta para Revisão e Aprovação  
> **Ciclo:** Ciclo 2 (Landing Page Institucional & Páginas Estáticas)  
> **Nota SDD:** Esta especificação é temporária. Ao ser concluída e validada, será registrada no commit e excluída do disco.

---

## 1. Objetivo
Desenvolver as páginas institucionais core do E3M Solutions Portal (`/sobre`, `/servicos`, `/contato`, `/privacidade`, `/termos`), transmitindo a maturidade de mais de 30 anos de mercado, o posicionamento agnóstico a tecnologias de modinha (foco no ROI e objetivo do cliente) e a expertise profunda em IA, Nuvem e Engenharia de Software.

---

## 2. Escopo Técnico e de Conteúdo

### 2.1 Página `/sobre` (Nossa Essência & Liderança)
A página deve mesclar a força de uma consultoria estruturada com a autoridade de quem a lidera.
- **Seção 1: Quem Somos**
  - Foco na E3M como uma consultoria que resolve problemas de negócios através da tecnologia (SaaS, integrações, automação, agentes de IA).
- **Seção 2: O Manifesto de Engenharia (Visão e Valores)**
  - *O Objetivo é do Cliente:* Nosso papel é habilitar ROI, lucro, performance e visibilidade. O sucesso da engenharia é medido pelo sucesso do negócio.
  - *Arquitetura Pragmática:* Combate ativo ao *overengineering*, excessos de custos e apego a "stacks preferidas". Valor justo que faça sentido para o cliente.
  - *Repasse de Conhecimento:* Nós não geramos dependência. Entregamos a solução, capacitamos os usuários/desenvolvedores do cliente, documentamos e transferimos o conhecimento.
- **Seção 3: Liderança (Márcio Figueiredo)**
  - Foto em destaque (glassmorphism/estilizada).
  - Mini-bio: Mais de 30 anos de atuação (desde 1996) construindo soluções de software e consultoria.
  - Link direto para o LinkedIn.

### 2.2 Página `/servicos` (Portfólio Completo)
A home exibe um resumo. Esta página será o catálogo detalhado da operação.
- **Vertical 1: Inteligência Artificial & Ecossistemas Agênticos**
  - Desenvolvimento de agentes autônomos, Machine Learning, camadas de IA integradas a aplicações legadas, fluxos e processos empresariais.
- **Vertical 2: Mentoria & Liderança Técnica (CTO as a Service)**
  - Liderança técnica para times internos, upskilling, estruturação de fluxos de desenvolvimento modernos (ex: SDD) e gestão de projetos pontuais.
- **Vertical 3: Atendimento Inteligente & Omnichannel**
  - Chatbots avançados, automação via WhatsApp, IA no atendimento ao cliente integrado com fluxos internos.
- **Vertical 4: Desenvolvimento Customizado, Cloud & Modernização**
  - SaaS, Micro-SaaS, Serverless, Portais, ERP, LMS e Dashboards.
  - *B2B & Licitações:* Parcerias estratégicas (você ganha a licitação, nós operacionalizamos ou atuamos em parceria no desenvolvimento/sustentação).
- **Vertical 5: Staff Augmentation (Alocação com Liderança Integrada)**
  - Alocação de talentos (Dev, QA, IA, Dados, PO), mas com **gestão e liderança técnica da E3M** garantindo resultados, em vez de ser um mero "body shop".
- **Seção de Metodologia ("Como Trabalhamos"):**
  1. *Diagnóstico & Entendimento:* Mergulho nos objetivos e restrições do cliente.
  2. *Arquitetura Pragmática:* Desenho focado no ROI, descartando ferramentas desnecessárias.
  3. *Execução Orientada a Valor:* Construção ou liderança da equipe com foco em velocidade e qualidade.
  4. *Capacitação & Entrega:* Handover completo, treinando os times e garantindo autonomia.

### 2.3 Página `/contato` (Captação e Conversão)
- **Layout Limpo & Conversível:**
  - Painel de informações diretas: E-mail corporativo, botão direto para o WhatsApp.
  - Formulário de Contato Inteligente: Nome, E-mail, Empresa, Mensagem.
  - *Checkbox de Intenção:* Opção para "Desejo agendar uma call de Diagnóstico Gratuito".

### 2.4 Páginas `/privacidade` e `/termos` (Compliance Institucional)
- Utilizar o layout de renderização Markdown (similar ao do Blog, via `@tailwindcss/typography`).
- Injetar um conteúdo real padrão adaptado para empresas brasileiras de TI (incluindo tratamento de dados em adequação geral à LGPD, política de cookies e confidencialidade de projetos/dados dos clientes).

---

## 3. Arquitetura Frontend e Design System
- Todas as páginas devem herdar de `Layout.astro` e manter os componentes `Header.astro` e `Footer.astro` devidamente ajustados com `base_url` (SPEC-005).
- Aplicar o sistema *Dark Glassmorphism* (usando `.glass-panel`, `.glass-card` e `.glass-button`).
- Adicionar gradientes suaves e micro-interações para uma experiência fluida.
- Refatorar a **Home** pontualmente caso precise alinhar os 3 ou 4 blocos principais com as verticais descritas no item 2.2.

---

## 4. Critérios de Aceite
1. Rotas `/sobre`, `/servicos`, `/contato`, `/privacidade` e `/termos` renderizando sem erros (404).
2. Todo o roteamento cruzado utilizando a utilidade `getPath()`.
3. Página `/contato` com formulário desenhado (UI/UX) e links de WhatsApp.
4. Páginas de compliance com textos jurídicos padrão (e não *Lorem Ipsum* puro) aplicados usando a classe `prose prose-invert`.
5. Build (`npm run build`) passando sem erros de tipagem (`npx astro check`).
