---
title: "Case: Solicitações de Materiais e Comunicações entre Afiliadas — Plataforma Flutter e Web para Emissoras de TV"
description: "Sistema multiplataforma Flutter e Web para tráfego e aprovação de materiais publicitários e chamadas entre emissoras e afiliadas."
pubDate: 2023-11-28
author: "Marcio Figueiredo"
type: "case"
heroImage: "/images/blog/covers/serverless-descomplicando-cloud-functions-gcp.jpeg"
tags: ["mobile", "flutter", "web", "cross-platform", "midia", "broadcast", "dart"]
---

Em redes nacionais de televisão aberta, a comunicação entre a **cabeça de rede** e dezenas de **emissoras afiliadas regionais** envolve um volume diário crítico de materiais audiovisuais: vinhetas de patrocínio regional, chamadas locais de programação, matrizes de publicidade nacional com janelas de corte local e comunicados urgentes de jornalismo.

O tráfego descentralizado dessas solicitações por e-mails avulsos, serviços de compartilhamento genéricos de arquivos e telefonemas provocava frequentes atrasos na veiculação e riscos operacionais no departamento de tráfego de mídia.

A **E3M Solutions** projetou e implementou uma **Plataforma Integrada Web e Mobile multiplataforma (Flutter / Dart) para governança, solicitação, aprovação e entrega de materiais operacionais e publicitários entre a rede e suas afiliadas**.

---

### 1. O Desafio de Negócio

* **Descentralização e Perda de Prazos de Tráfego:** Pedidos de chamadas ou vinhetas ficavam dispersos em caixas de entrada de e-mails, sem controle claro de quem solicitou, quando precisava ir ao ar e qual o prazo de aprovação legal;
* **Incompatibilidade de Padrões Técnicos:** Arquivos enviados em codecs ou resoluções divergentes das exigidas pela automação de exibição exigiam retrabalho constante da equipe técnica;
* **Falta de Notificação em Tempo Real:** Afiliadas em diferentes fusos horários precisavam de agilidade para baixar materiais emergenciais de jornalismo e plantões.

---

### 2. A Solução Arquitetural Desenvolvida

A solução foi estruturada para garantir agilidade e confiabilidade na ponta móvel e controle total na central:

1. **Aplicativo Mobile Multiplataforma (Flutter):** Permite que diretores de programação e operadores das afiliadas solicitem materiais, acompanhem o status de produção e recebam notificações instantâneas diretamente no celular (iOS e Android);
2. **Painel Web Corporativo:** Interface para a equipe central de tráfego e produção da rede gerenciar a fila de solicitações, validar conformidade técnica dos arquivos e liberar links seguros de download;
3. **Validação Automatizada de Metadados:** Verificação obrigatória de títulos, datas de validade de veiculação e parâmetros técnicos de mídia antes da aprovação do material;
4. **Armazenamento Seguro de Mídia:** Armazenamento em nuvem com links efêmeros de download e acelerador de transferência de arquivos pesados.

---

### 3. Stack Tecnológica & Engenharia

* 📲 **Mobile:** Flutter e Dart com compilação nativa para iOS e Android com desempenho de 60fps
* 🖥️ **Web:** Aplicação Web responsiva e integrada para a equipe interna de tráfego
* 📦 **Backend:** APIs em Node.js com arquitetura limpa e barramentos assíncronos de notificação
* 🎲 **Bancos de Dados:** Banco relacional com auditoria completa de aprovações e downloads
* ⚙️ **Mensageria:** Firebase Cloud Messaging (FCM) para envio em tempo real de notificações push segmentadas por região

---

### 4. Resultados e Valor Gerado

* 📺 **Redução de 85% em Erros de Veiculação:** Padronização dos metadados garantiu que nenhum material fosse ao ar fora da janela permitida;
* ⏱️ **Agilidade de Resposta em Plantões:** Afiliadas recebem materiais urgentes de rede em minutos com avisos sonoros prioritários no app;
* 📊 **Rastreabilidade e SLA de Atendimento:** Relatórios consolidados sobre o tempo de atendimento da produção para cada afiliada;
* 🤝 **Comunicação Centralizada e Oficial:** Eliminação definitiva de canais paralelos informais para troca de arquivos de exibição.
