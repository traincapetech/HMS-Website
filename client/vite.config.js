import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

// Function to copy .htaccess and _redirects to build folder
const copyHtaccess = () => ({
  name: 'copy-htaccess',
  closeBundle() {
    const htaccessContent = `
# Enable rewrite engine
RewriteEngine On

# If the requested file or directory doesn't exist
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite all requests to the root index.html
RewriteRule ^ index.html [QSA,L]
`
    // Create .htaccess in the dist folder
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist')
    }
    fs.writeFileSync('dist/.htaccess', htaccessContent)
    
    // Also create a visible copy for manually uploading
    fs.writeFileSync('dist/htaccess.txt', htaccessContent)
    
    // Create _redirects file for Render.com and other static hosts
    // This is critical for routing in SPA applications
    const redirectsContent = `
/* /index.html 200
/payment/success /index.html 200
/payment/cancel /index.html 200
`
    fs.writeFileSync('dist/_redirects', redirectsContent)
    console.log('✅ Created _redirects file for Render deployment')
    
    // Copy _redirects from public if it exists (as a backup)
    if (fs.existsSync('public/_redirects')) {
      fs.copyFileSync('public/_redirects', 'dist/_redirects')
      console.log('✅ Copied _redirects from public folder')
    }
    
    // Create a fallback 200.html file (for some static hosts)
    if (fs.existsSync('dist/index.html')) {
      fs.copyFileSync('dist/index.html', 'dist/200.html')
      console.log('✅ Created 200.html fallback file')
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    copyHtaccess()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port: 8080,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
})