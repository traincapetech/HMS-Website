//app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./db.js";
import path from 'path';
import { fileURLToPath } from 'url';
import newuserRouter from "./Routes/newuser.route.js";
import doctorRouter from  "./Routes/doctor.route.js";
import appointRouter from "./Routes/appoint.route.js";
import zoomRouter from "./Routes/zoom.route.js";
import add_docrouter from "./Routes/add_doc.route.js";
import add_patientrouter from "./Routes/add_patient.route.js";
import add_paymentrouter from "./Routes/add_payments.js";

dotenv.config();

// Get directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure PORT is defined and log it for debugging
const port = process.env.PORT || 10000;
console.log(`Using port: ${port}`);

const app = express();
connectdb()

// Update CORS configuration to allow requests from the frontend
const corsOptions = {
  origin: [
    'https://tamd-website.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true, 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// app.use(cors(corsOptions));
app.use(cors({
  origin: true, // Allow all origins or specify specific origins
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining']
}));

app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/newuser', newuserRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/appoint', appointRouter);
app.use('/api/zoom', zoomRouter);
app.use('/api/add_doc', add_docrouter);
app.use('/api/add_patient', add_patientrouter);
app.use('/api/payments', add_paymentrouter);
// API health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        message: 'API is running', 
        timestamp: new Date().toISOString(),
        port: port
    });
});

// Add proper error handling for 404 and other errors

// 404 handler - Must be defined after all routes
app.use((req, res, next) => {
  // Only handle 404s for API routes
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.path}`
    });
  } else {
    // For non-API routes in production, let the static site handler deal with it
    next();
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start the server with proper error handling
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please choose another port.`);
    }
});

export default app;
