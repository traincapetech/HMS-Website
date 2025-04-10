#!/bin/bash
# Script to test production mode locally

echo "Testing server in production mode..."
cd server
NODE_ENV=production node index.js 