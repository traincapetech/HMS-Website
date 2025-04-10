// scripts/postbuild.js
// Ensures that all necessary files for SPA routing are in the dist folder
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Create directory if it doesn't exist
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// Create _redirects file (for Netlify, Render, etc.)
const redirectsContent = '/* /index.html 200';
fs.writeFileSync(path.join(distPath, '_redirects'), redirectsContent);
console.log('✅ Created _redirects file in dist folder');

// Copy index.html to 200.html (for surge.sh and other hosts)
if (fs.existsSync(path.join(distPath, 'index.html'))) {
  fs.copyFileSync(
    path.join(distPath, 'index.html'), 
    path.join(distPath, '200.html')
  );
  console.log('✅ Created 200.html file in dist folder');
}

// Ensure netlify.toml is copied if it exists
const netlifyPath = path.join(__dirname, '../netlify.toml');
if (fs.existsSync(netlifyPath)) {
  fs.copyFileSync(
    netlifyPath,
    path.join(distPath, 'netlify.toml')
  );
  console.log('✅ Copied netlify.toml to dist folder');
}

console.log('✅ Post-build processing complete!'); 