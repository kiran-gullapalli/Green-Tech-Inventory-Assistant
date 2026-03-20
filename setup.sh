#!/bin/bash

# Green-Tech Inventory Assistant - Quick Setup Script
# This script automates the setup process

set -e

echo "================================"
echo "Green-Tech Setup Script"
echo "================================"
echo ""

# Check Node version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Current: $NODE_VERSION"

if command -v nvm &> /dev/null; then
    echo "nvm found. Switching to v22.3.0..."
    eval "$(nvm env --shell=bash)"
    nvm use 22.3.0 || (echo "Installing Node 22.3.0..." && nvm install 22.3.0 && nvm use 22.3.0)
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "Using Node: $NODE_VERSION"
echo "Using npm: $NPM_VERSION"
echo ""

# Check .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your ANTHROPIC_API_KEY"
    echo ""
fi

# Clean install
echo "Cleaning up old dependencies..."
rm -rf server/node_modules client/node_modules
rm -f package-lock.json server/package-lock.json client/package-lock.json
npm cache clean --force

echo "Installing server dependencies..."
cd server
npm install --legacy-peer-deps
echo "Seeding database..."
npm run seed
cd ..

echo "Installing client dependencies..."
cd client
npm install --legacy-peer-deps
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development servers, run:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"  
echo "  cd client && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
