import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing app setup
import app from './app.js';

// Set environment for consistent checking
const isProduction = process.env.NODE_ENV === 'production';
console.log('ENV Check in server.js:', { NODE_ENV: process.env.NODE_ENV, isProduction });

// Only serve static files in development environment
// In production, static files are served by Render's static site hosting
if (!isProduction) {
  // Specify the client directory path for development
  const clientBuildPath = path.join(__dirname, '../client/dist');

  // Check if client/dist exists and serve static files if it does
  if (fs.existsSync(clientBuildPath)) {
    console.log('Serving static files from:', clientBuildPath);
    
    // Serve static files
    app.use(express.static(clientBuildPath));
    
    // For any other routes, serve the index.html file
    app.get('*', (req, res, next) => {
      // Skip API routes
      if (req.url.startsWith('/api')) {
        return next();
      }
      
      const indexPath = path.join(clientBuildPath, 'index.html');
      
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error('index.html not found in', clientBuildPath);
        res.status(404).send('index.html not found');
      }
    });
  } else {
    console.log('Client build directory not found at:', clientBuildPath);
    console.log('Only API routes will be available.');
  }
} else {
  console.log('Running in production mode - static files are served by Render static site hosting');
  
  // Add a catch-all route for API routes only in production
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    
    // For non-API routes, inform that this server only handles API requests
    res.status(404).json({
      success: false,
      message: 'This server only handles API requests. Frontend is served separately.'
    });
  });
}

// Export the app for use in the entry point
export default app; 