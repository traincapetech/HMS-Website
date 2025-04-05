#!/bin/bash
echo "Running deployment script for TAMD Health website"

# Stop any running server instances
echo "Stopping any running server instances..."
pkill -f "node.*app.js" || echo "No running server to stop"

# Ensure the client is built with the proper base path
echo "Building client with proper configuration..."
cd "$(dirname "$0")/client"
echo "VITE_API_BASE_URL=/api" > .env
npm run build

# Create .htaccess in the client dist directory if it doesn't exist
echo "Setting up .htaccess for client-side routing..."
cat > dist/.htaccess << 'HTACCESS'
# Enable rewrite engine
RewriteEngine On

# If the requested file or directory doesn't exist
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite all requests to the root index.html
RewriteRule ^ index.html [QSA,L]
HTACCESS

# Ensure the server has the catch-all route
echo "Checking server configuration..."
cd ../server

# Create a backup of app.js
cp app.js app.js.backup

# Check if app.js already has the catch-all route
if ! grep -q "app.get('\*'" app.js; then
  echo "Adding catch-all route to app.js..."
  # We'll insert the route just before the app.listen line
  sed -i.bak '
    /app.listen/ i\
\
// Serve static files from the React app\
app.use(express.static(path.resolve(__dirname, '"'"'../client/dist'"'"'))); \
\
// The "catch-all" handler: for any request that doesn'"'"'t match API routes,\
// send back the index.html file so React Router can handle client-side routing\
app.get('"'"'*'"'"', (req, res) => {\
    res.sendFile(path.resolve(__dirname, '"'"'../client/dist/index.html'"'"'));\
});\
' app.js
  echo "Server configuration updated with catch-all route."
else
  echo "Server already has catch-all route."
fi

# Start the server
echo "Starting server..."
npm start &

echo "Deployment fixes completed. Please check that all pages work correctly."
echo "If issues persist, check server logs and ensure your web server is configured correctly."
