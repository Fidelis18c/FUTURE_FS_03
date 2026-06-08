const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const productsDir = '/home/fidelis/Projects/HSSTORE/FUTURE_FS_03/Frontend/src/assets/products';
const dataDir = '/home/fidelis/Projects/HSSTORE/FUTURE_FS_03/Frontend/src/data';

async function processImages() {
  const files = fs.readdirSync(productsDir).filter(f => f.match(/\.(png|jpg|jpeg)$/i));
  let totalSaved = 0;
  
  for (const file of files) {
    const inputPath = path.join(productsDir, file);
    const parsed = path.parse(file);
    const outputFileName = `${parsed.name}.webp`;
    const outputPath = path.join(productsDir, outputFileName);
    
    try {
      const inputStats = fs.statSync(inputPath);
      const inputSizeMB = inputStats.size / (1024 * 1024);
      
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);
        
      const outputStats = fs.statSync(outputPath);
      const outputSizeMB = outputStats.size / (1024 * 1024);
      
      const savedMB = inputSizeMB - outputSizeMB;
      totalSaved += savedMB;
      
      console.log(`Converted ${file}: ${inputSizeMB.toFixed(2)}MB -> ${outputSizeMB.toFixed(2)}MB (Saved ${savedMB.toFixed(2)}MB)`);
      
      // Delete original
      fs.unlinkSync(inputPath);
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }
  
  console.log(`\nTotal space saved: ${totalSaved.toFixed(2)} MB`);
  
  // Update JSON files
  console.log('Updating JSON data files...');
  const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  for (const jsonFile of jsonFiles) {
    const filePath = path.join(dataDir, jsonFile);
    let dataStr = fs.readFileSync(filePath, 'utf8');
    
    // Replace .png, .jpg, .jpeg with .webp
    const newDataStr = dataStr.replace(/\.(png|jpg|jpeg)(['"])/gi, '.webp$2');
    
    if (dataStr !== newDataStr) {
      fs.writeFileSync(filePath, newDataStr);
      console.log(`Updated ${jsonFile}`);
    }
  }
  
  console.log('All done!');
}

processImages();
