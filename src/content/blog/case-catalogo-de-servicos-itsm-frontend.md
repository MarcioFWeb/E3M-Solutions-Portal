---
title: "Case: Catálogo de Serviços ITSM — Portal Unificado de Requisições e Integrações Corporativas"
description: "Portal corporativo de catálogo de serviços e ITSM com arquitetura de micro-integrações para a maior locadora de TI do Brasil."
pubDate: 2022-11-10
author: "Marcio Figueiredo"
type: "case"
heroImage: "/images/blog/covers/serverless-descomplicando-cloud-functions-gcp.jpeg"
tags: ["itsm", "frontend", "integracoes", "enterprise", "portal", "nodejs", "sqlserver"]
---

👨‍💻 **Solução:** Portal corporativo desenvolvido para simplificar, organizar e padronizar a solicitação e o atendimento de chamados, requisições de equipamentos e serviços internos dentro da maior empresa de aluguel de equipamentos e infraestrutura de TI do Brasil. Além do uso operacional interno por milhares de colaboradores, a plataforma foi estruturada como um produto white-label de alto valor agregado para ser comercializado junto aos contratos de sustentação de TI e outsourcing da organização.

A aplicação atua como uma **fachada desacoplada (BFF - Backend-for-Frontend)** com integrações a múltiplos sistemas legados, permitindo busca semântica, indexação de serviços por área de negócio, formulários dinâmicos e aprovações multinível.

💼 **Atuação E3M:** Atuação desde a ideação e mapeamento de processos até o lançamento e governança:
* Mapeamento de integrações complexas com sistemas legados (Active Directory / LDAP corporativo, ERP de faturamento e sistema central de ITSM/ServiceDesk);
* Desenho da arquitetura de microsserviços desacoplados e Gateway corporativo unificado;
* Desenvolvimento fullstack, esteira de deploy contínuo, instrumentação de métricas e manuais de treinamento para operadores.

🛠️ **Stack Tecnológica & Infraestrutura:**
* 🖥️ **Frontend:** Aplicação Web rápida com renderização otimizada e componentes customizados para formulários de chamados
* 📦 **Backend:** Microsserviços e Gateway REST em Node.js com contratos de API estritos
* 🎲 **Banco de Dados:** Microsoft SQL Server para persistência de catálogo, histórico de auditoria e configurações
* ⚙️ **Infraestrutura:** Servidores Windows com IIS e Node-Windows com isolamento de processos e alta disponibilidade

✅ **Resultados / Geração de Valor:** 
* 🎯 **Adesão Superior a 95% nos Processos Oficiais:** Eliminação de chamados dispersos por e-mails ou conversas informais;
* ⏱️ **Redução de 65% no Tempo de Triagem:** Solicitações já nascem categorizadas, com os dados obrigatórios preenchidos e roteadas automaticamente para a equipe responsável;
* 🔄 **Desacoplamento Tecnológico:** A camada de fachada permitiu que a empresa atualizasse sistemas de backend (como troca de ERP ou upgrade do ITSM) sem impactar a interface ou a experiência dos colaboradores;
* 💼 **Ativo Comercial para Novos Contratos:** O catálogo passou a compor as propostas comerciais de outsourcing de TI da empresa como diferencial competitivo de entrega.
