---
title: "Case: Gestão de Salões de Beleza e App de Agendamento — Ecossistema Completo Web e Mobile"
description: "Ecossistema completo Web e Mobile para gestão de salões de beleza, agendamento de clientes com geolocalização e pagamentos com split."
pubDate: 2023-09-25
author: "Marcio Figueiredo"
type: "case"
heroImage: "/images/blog/covers/qual-area-da-ti-eh-a-certa-para-voce.webp"
tags: ["mobile", "web", "agendamento", "marketplace", "react-native", "dotnet", "postgresql", "fintech"]
---

👨‍💻 **Solução:** Suíte integrada de produtos digitais voltada para o mercado de estética e bem-estar, conectando estabelecimentos, profissionais autônomos e clientes finais em uma experiência fluida:

1. **Gestão Operacional e Financeira para Estabelecimentos (Web e PWA):** Gestão completa de agendas de múltiplos profissionais, comandas eletrônicas, controle de estoque de insumos e produtos, fechamento de caixa diário, apuração de comissões por serviço e relatórios de DRE simplificados;
2. **Aplicativo Mobile para Clientes Finais (iOS e Android):** Experiência de marketplace com busca por mapa e geolocalização de estabelecimentos próximos, visualização de portfólio de serviços com preços e avaliações, agendamento online com confirmação em tempo real e pagamento integrado;
3. **Módulo de FinTech & Split de Pagamentos:** Infraestrutura de pagamento online que permite o recebimento por cartão ou Pix, realizando automaticamente a divisão (*split*) entre a parte devida ao estabelecimento e a comissão do profissional parceiro (Lei do Salão-Parceiro).

💼 **Atuação E3M:**
* **Retrofit de Legado e Estabilização:** Assumimos a plataforma de gestão em estado instável e com alto débito técnico, redesenhando a infraestrutura, corrigindo gargalos de concorrência no banco de dados e estabilizando a operação;
* **Engenharia Greenfield do App de Clientes:** Concepção e desenvolvimento do aplicativo mobile de agendamento a partir do zero utilizando React Native e Expo, com arquitetura limpa e experiência de usuário de ponta;
* **Integrações de Pagamento e Mapas:** Conexão com gateways de pagamento, split de recebíveis, APIs de geolocalização do Google Cloud e serviços de notificações push (*Push Notifications*).

🛠️ **Stack Tecnológica & Infraestrutura:**
* 📲 **App Mobile (Clientes):** React Native + Expo com navegação reativa e integração nativa com mapas
* 🖥️ **Portal Web & App Gestão:** Angular e Ionic responsivo adaptado para tablets e telas de balcão
* 📦 **Backend:** Microsserviços em .NET Core com barramento de regras financeiras e APIs RESTful
* 🎲 **Bancos de Dados:** PostgreSQL e Microsoft SQL Server com particionamento de tenants
* ⚙️ **Infraestrutura:** Google Cloud Platform (Google Maps APIs), Expo EAS para builds automatizadas e esteira de CI/CD

✅ **Resultados / Geração de Valor:**
* 🚀 **Adoção Rápida no Mercado:** Estabilização da plataforma permitiu o onboarding acelerado de dezenas de estabelecimentos no primeiro semestre;
* 💳 **Monetização via Fintech:** A cobrança integrada com split de pagamentos eliminou a necessidade de maquininhas físicas e criou uma nova linha de receita sustentável para a startup;
* 📅 **Redução de No-Shows:** Notificações automáticas de lembrete de horário para os clientes reduziram faltas e ociosidade da agenda dos profissionais em mais de 40%.
