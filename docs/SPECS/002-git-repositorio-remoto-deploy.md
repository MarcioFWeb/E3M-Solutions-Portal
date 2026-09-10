# SPEC-002: Inicialização Git, Conexão com Repositório Remoto e Deploy Inicial

> **Status:** Aberta para Revisão  
> **Ciclo:** Ciclo 0 (Fundação Mínima & Ativação Remota)  
> **Nota SDD:** Esta especificação é temporária. Ao ser concluída e validada, será registrada no commit e excluída do disco.

---

## 1. Objetivo
Inicializar o controle de versão Git local com `.gitignore` adequado, efetuar o commit inicial estrutural de toda a arquitetura v0.1 e preparar a vinculação com o repositório remoto no GitHub para viabilizar o deploy automático via GitHub Actions (GitHub Pages).

## 2. Escopo Técnico

### 2.1. Arquivo de Ignorados (`.gitignore`)
Garantir a exclusão de:
- Dependências: `node_modules/`
- Build e caches: `dist/`, `.astro/`, `.vite/`
- Logs e variáveis de ambiente: `*.log`, `.env*`
- Arquivos de sistema/IDE: `.DS_Store`, `.vscode/`, `.idea/` (mantendo arquivos de harness como `.cursorrules` e `.agentharness/`).

### 2.2. Inicialização Git Local e Commit Inicial
- Executar `git init` e padronizar o branch principal como `main`.
- Adicionar todos os arquivos rastreados (`git add .`).
- Criar o commit semântico inicial:
  `chore(init): initial scaffold astro v5, glassmorphism dark theme, agent harness and base layout v0.1`

### 2.3. Conexão com Repositório Remoto (GitHub)
- Adicionar o repositório remoto (`origin`) apontando para: `https://github.com/MarcioFWeb/E3M-Solutions-Portal.git`
- Executar `git branch -M main`.
- Executar `git push -u origin main` para enviar o código para o GitHub.

### 2.4. Validação da Pipeline de CI/CD
- Validar se o workflow `.github/workflows/deploy.yml` está compatível com a branch `main` e permissões do GitHub Pages.
- Acompanhar a primeira publicação da URL pública.

## 3. Critérios de Aceite
1. Repositório Git inicializado localmente com branch `main`.
2. `.gitignore` cobrindo todas as saídas de build e dependências.
3. Commit estrutural registrado.
4. Repositório remoto configurado e sincronizado via `git push`.
5. GitHub Actions disparado e site publicado com sucesso no GitHub Pages.
