#!/usr/bin/env node

/**
 * Utilitário E3M Content Studio - Promove um artigo do GDrive para o Repositório
 * Uso: node scripts/publish-article.js nome-do-arquivo.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const studioPath = process.env.E3M_CONTENT_STUDIO_PATH;
if (!studioPath) {
    console.error("❌ ERRO: A variável E3M_CONTENT_STUDIO_PATH não está definida no .env");
    process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Uso: npm run publish <nome-do-arquivo.md>");
    console.log("Arquivos disponíveis em rascunhos:");
    const draftsDir = path.join(studioPath, 'workspace', 'rascunhos');
    if (fs.existsSync(draftsDir)) {
        const files = fs.readdirSync(draftsDir).filter(f => f.endsWith('.md'));
        files.forEach(f => console.log(`  - ${f}`));
    }
    process.exit(0);
}

const fileName = args[0];
const sourceFile = path.join(studioPath, 'workspace', 'rascunhos', fileName);
const destFile = path.join(projectRoot, 'src', 'content', 'blog', fileName);

if (!fs.existsSync(sourceFile)) {
    console.error(`❌ ERRO: Arquivo não encontrado em: ${sourceFile}`);
    process.exit(1);
}

// Promove o arquivo
try {
    fs.copyFileSync(sourceFile, destFile);
    console.log(`✅ SUCESSO: Artigo promovido para ${destFile}`);
    
    // Atualiza a data de publicação automaticamente (opcional)
    let content = fs.readFileSync(destFile, 'utf8');
    const today = new Date().toISOString().split('T')[0];
    content = content.replace(/pubDate:\s*['"]?.*['"]?/, `pubDate: "${today}"`);
    fs.writeFileSync(destFile, content);
    console.log(`📅 Data de publicação (pubDate) atualizada para: ${today}`);
    console.log(`\nLembre-se de verificar se as imagens de capa foram copiadas para public/images/blog/covers/!`);
} catch (e) {
    console.error("❌ ERRO ao copiar arquivo:", e);
}
