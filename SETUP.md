# Setup & Troubleshooting Guide

## Prerequisites

### Required
- **Node.js**: v22.3.0 (use nvm to switch if needed)
- **npm**: v10.0.0 or higher
- **Anthropic API Key**: Get from https://console.anthropic.com/

### Optional but Recommended
- **nvm** (Node Version Manager) - for managing Node versions

## Quick Start (Recommended Approach)

### Step 1: Switch to Correct Node Version

If you have nvm installed:
```bash
cd Green-Tech-Inventory-Assistant
nvm use
# or manually: nvm use 22.3.0
```

If you get "version not installed":
```bash
nvm install 22.3.0
nvm use 22.3.0
```

Verify:
```bash
node --version  # Should output v22.3.0
npm --version   # Should output 10.x.x
```

### Step 2: Setup Environment Variables

```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

### Step 3: Clean Install (IMPORTANT - Do This!)

**Delete existing node_modules** to avoid conflicts:
```bash
rm -rf server/node_modules client/node_modules
rm package-lock.json server/package-lock.json client/package-lock.json 2>/dev/null
```

### Step 4: Install Dependencies

```bash
# Install server dependencies
cd server
npm install
npm run seed
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 5: Start Development Servers

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# You should see: Server running on port 3001
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
# You should see: VITE v5.x.x  ready in XXX ms
# Local: http://localhost:3000/
```

Visit http://localhost:3000 in your browser.

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'better-sqlite3'"

**Cause**: Native module compilation failed  
**Solution**:
```bash
cd server
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

If still fails:
```bash
# On Mac/Linux, you might need build tools
npm install --build-from-source
```

### Issue 2: "Port 3000 already in use" or "Port 3001 already in use"

**Solution - Kill existing process:**

```bash
# Find and kill processes
lsof -ti:3000 | xargs kill -9  # Kill port 3000
lsof -ti:3001 | xargs kill -9  # Kill port 3001

# Or specify different ports
cd client
PORT=3002 npm run dev

cd ../server
PORT=3002 npm run dev
```

### Issue 3: "EACCES: permission denied" error

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Change npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Reinstall
cd server && npm install
cd ../client && npm install
```

### Issue 4: React/Vite Compilation Errors

**Solution**:
```bash
cd client
rm -rf node_modules dist .vite package-lock.json
npm cache clean --force
npm install
npm run dev
```

### Issue 5: "Module not found: '@anthropic-ai/sdk'"

**This should not happen after setup**, but if it does:
```bash
cd server
npm install @anthropic-ai/sdk@latest
```

### Issue 6: "Error: Cannot find module 'express'"

**Solution**:
```bash
cd server
npm install
npm list  # Verify all packages are installed
```

### Issue 7: Blank page or CORS errors in browser console

**Cause**: Frontend can't reach backend  
**Solution**:
1. Verify backend is running: `curl http://localhost:3001/api/health`
2. Check browser console (F12) for CORS errors
3. Ensure API_URL is correct in [client/src/App.jsx](client/src/App.jsx#L9)
4. Restart both servers

### Issue 8: "npm ERR! code ENOENT" or missing node_modules

**Solution - Complete Clean:**
```bash
# From project root
rm -rf node_modules server/node_modules client/node_modules
find . -name "package-lock.json" -delete
npm cache clean --force

# Reinstall from scratch
cd server && npm install
cd ../client && npm install
```

---

## Environment Variables

Create `.env` file in project root:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

**Never commit `.env`** - it's in `.gitignore`

---

## Debugging Tips

### 1. Check Node/npm versions:
```bash
node --version
npm --version
npx -v
```

### 2. Verify packages installed:
```bash
cd server && npm list --depth=0
cd ../client && npm list --depth=0
```

### 3. Check what's listening on ports:
```bash
lsof -i :3000
lsof -i :3001
```

### 4. View npm logs:
```bash
npm install --verbose
npm run dev -- --debug
```

### 5. Test backend directly:
```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/inventory
```

### 6. Check .env is loaded:
```bash
cd server
node -e "require('dotenv').config(); console.log(process.env.ANTHROPIC_API_KEY ? 'API Key loaded' : 'API Key NOT found')"
```

---

## Advanced Troubleshooting

### If Nothing Works - Nuclear Option:

```bash
# Complete reset
cd Green-Tech-Inventory-Assistant

# Remove all node stuff
rm -rf node_modules server/node_modules client/node_modules dist build
find . -name "package-lock.json" -delete
find . -name ".vite" -type d -exec rm -rf {} + 2>/dev/null
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null

# Clear npm cache
npm cache clean --force

# Fresh install
npm install --legacy-peer-deps

cd server
npm install --legacy-peer-deps
npm run seed

cd ../client
npm install --legacy-peer-deps

cd ..
echo "Fresh install complete! Try npm run dev again"
```

### Using Docker (Alternative - Avoids Node Issues):

Create `Dockerfile` in project root:
```dockerfile
FROM node:22.3.0

WORKDIR /app

# Server
COPY server/package*.json ./server/
RUN cd server && npm install

# Client
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .

# Build client (optional)
# RUN cd client && npm run build

EXPOSE 3000 3001

CMD ["sh", "-c", "cd server && npm run seed & npm run dev & cd ../client && npm run dev"]
```

Run with:
```bash
docker build -t green-tech .
docker run -p 3000:3000 -p 3001:3001 --env-file .env green-tech
```

---

## Verification Checklist

After setup, verify everything works:

- [ ] `node --version` shows v22.3.0
- [ ] `npm --version` shows v10+
- [ ] `.env` file exists with ANTHROPIC_API_KEY
- [ ] `cd server && npm run seed` completes without errors
- [ ] `cd server && npm run dev` shows "Server running on port 3001"
- [ ] `cd client && npm run dev` shows Vite dev server running
- [ ] Browser shows app at http://localhost:3000
- [ ] Backend health check: `curl http://localhost:3001/api/health`
- [ ] Can add an item in the UI
- [ ] Can see items in the inventory table

## Support

If you still have issues:

1. **Check Node version** - This is #1 cause of failures
2. **Delete node_modules** - Always try this first
3. **Check .env file exists** - Copy .env.example to .env
4. **Check ports** - Make sure 3000 and 3001 are free
5. **Read error messages carefully** - Note the exact error and search for it

---

Last Updated: March 20, 2026
