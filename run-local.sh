#!/bin/bash
echo "Starting CS2 Nades Telegram Mini App locally..."

# Change to project directory 
cd /F/cs2

# Install dependencies
echo "Installing dependencies..."
npm install

# Run the server
echo "Starting server..."
npx ts-node server/server.ts