#!/bin/bash

# deploy-hostinger.sh - Script to prepare files for Hostinger deployment
echo "Preparing files for Hostinger deployment..."

# Ensure the client is built with the proper configuration
echo "Building client..."
cd "$(dirname "$0")/client"

# Create optimized .env for production
echo "VITE_API_BASE_URL=/api" > .env

# Run build
npm run build

# Verify .htaccess file exists in dist
if [ -f "dist/.htaccess" ]; then
  echo ".htaccess file created successfully."
else
  echo "ERROR: .htaccess file not found in dist folder."
  echo "Creating it manually..."
  cat > dist/.htaccess << 'EOL'
# Enable rewrite engine
RewriteEngine On
RewriteBase /

# If the requested file or directory doesn't exist
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite all requests to the root index.html
RewriteRule . /index.html [L]
EOL
fi

# Ensure a visible copy exists for easy uploading
echo "Creating visible htaccess.txt copy..."
cp dist/.htaccess dist/htaccess.txt

# Create a web.config file for IIS server (some Hostinger plans use Windows servers)
echo "Creating web.config file for IIS support..."
cat > dist/web.config << 'EOL'
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(api)" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
EOL

# Create a deployment checklist file
echo "Creating deployment checklist..."
cat > dist/HOSTINGER_DEPLOYMENT_CHECKLIST.txt << 'EOL'
HOSTINGER DEPLOYMENT CHECKLIST
==============================

1. IMPORTANT: Upload the .htaccess file
   - Make sure to upload the .htaccess file (hidden file)
   - If your FTP client doesn't show hidden files, use the htaccess.txt file and rename it to .htaccess after uploading

2. File Structure
   - Upload ALL files from the dist folder to public_html folder on Hostinger
   - Make sure to include the htaccess.txt and web.config files

3. Verify Configuration
   - After uploading, verify that the .htaccess file is in the root directory
   - Check that your domain is correctly configured in Hostinger's control panel

4. Test Routes
   - Test direct URL access (e.g., yourdomain.com/admin/login)
   - If you get 404 errors, check that the .htaccess file was uploaded correctly
   
5. API Configuration (if backend is on same server)
   - Make sure the backend server is configured properly
   - If your backend is on the same server, update any necessary paths

For questions, refer to the documentation or contact support.
EOL

# Create a ZIP archive of the dist folder for easy upload
echo "Creating ZIP archive for easy upload..."
cd dist
zip -r ../hostinger-deploy.zip .
cd ..

echo ""
echo "==================================="
echo "DEPLOYMENT PREPARATION COMPLETE"
echo "==================================="
echo ""
echo "To deploy to Hostinger:"
echo "1. Upload ALL files from the 'client/dist' folder to your Hostinger public_html directory"
echo "2. IMPORTANT: Make sure to upload the .htaccess file (it's hidden)"
echo "   - If you can't see hidden files, upload htaccess.txt and rename it to .htaccess on the server"
echo "3. Alternatively, upload the generated hostinger-deploy.zip file and extract it on the server"
echo ""
echo "Your build files are ready in: $(pwd)/client/dist"
echo "A ZIP archive for easy upload is available at: $(pwd)/hostinger-deploy.zip"
echo "" 