const fs = require('fs');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = dir + '/' + file;
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replacements
      content = content.replace(/electric-blue/g, 'brand-green');
      content = content.replace(/blue-600/g, 'lime-600');
      content = content.replace(/to-blue-400/g, 'to-lime-400');
      content = content.replace(/to-blue-500/g, 'to-lime-500');
      content = content.replace(/bg-blue-50/g, 'bg-lime-50');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir('./src');
