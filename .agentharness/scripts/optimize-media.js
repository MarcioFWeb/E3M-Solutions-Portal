const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../../src/assets');

if (!fs.existsSync(ASSETS_DIR)) {
  console.log('Pasta de assets não encontrada.');
  process.exit(1);
}

const files = fs.readdirSync(ASSETS_DIR);

files.forEach(file => {
  if (file.match(/\.(png|jpe?g)$/i)) {
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const inputPath = path.join(ASSETS_DIR, file);
    const outputPath = path.join(ASSETS_DIR, `${basename}.webp`);

    if (fs.existsSync(outputPath)) {
      console.log(`Pulando: ${file} (webp já existe)`);
      return;
    }

    console.log(`Otimizando: ${file}...`);
    
    sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ Sucesso: ${basename}.webp criado.`);
      })
      .catch(err => {
        console.error(`❌ Erro ao processar ${file}:`, err);
      });
  }
});
