import app from './server.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set NODE_ENV to production for Render deployment if not specified
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log('Running in environment:', process.env.NODE_ENV);

// Get port from environment and store in Express
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please choose another port.`);
  }
}); 