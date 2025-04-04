# Deployment Guide for TAMD Health Website

This guide provides instructions to fix the "page lost" error that occurs when navigating between pages.

## Understanding the Issue

The "page lost" error occurs because:

1. The application uses client-side routing (React Router)
2. When a user refreshes the page or accesses a direct URL (like `/about`), the server tries to find a file at that path
3. Since these routes don't exist as files on the server, it returns a 404 error

## Solution

This repository contains several files to fix these issues:

### 1. Run the Deployment Script

We've created a deployment script that automatically configures the server:

```bash
# Make script executable (if needed)
chmod +x deploy.sh

# Run the script
./deploy.sh
```

The script:
- Builds the client application
- Creates an .htaccess file for Apache
- Updates the server to include a catch-all route
- Restarts the server

### 2. Server Configuration (Already done by script)

The server needs a "catch-all" route that sends the index.html file for any URL that doesn't match API routes:

```javascript
// Already added by the script
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});
```

### 3. Apache Configuration (.htaccess)

For Apache servers, the .htaccess file (created by the script) should contain:

```
# Enable rewrite engine
RewriteEngine On

# If the requested file or directory doesn't exist
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Rewrite all requests to the root index.html
RewriteRule ^ index.html [QSA,L]
```

### 4. Nginx Configuration

For Nginx servers, use the `nginx.conf` file provided in this repository. The key section for client-side routing is:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Testing the Fix

1. After running the deployment script, navigate to the website's homepage
2. Click on different navigation links to ensure pages load correctly
3. Refresh the page while on a non-home route to confirm it still works
4. Try accessing a route directly (e.g., by typing the URL) to ensure it loads correctly

## Still Having Issues?

If you still encounter the "page lost" error:

1. Check server logs for any errors
2. Ensure your web server (Apache/Nginx) is properly configured
3. Verify that the build process completed successfully
4. Check that the API endpoints are accessible

For Nginx-specific deployments, make sure to update the domain and path in nginx.conf to match your environment.

## Production Deployment

For production deployment:

1. Update the nginx.conf with your actual domain and SSL certificate paths
2. Point the root directory to your actual build location
3. Make sure you have SSL certificates available if using HTTPS

Remember to restart your web server after making configuration changes. 