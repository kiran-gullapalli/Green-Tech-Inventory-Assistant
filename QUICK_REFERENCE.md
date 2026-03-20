# 🚀 Quick Reference Card

## 3-Minute Setup

```bash
# 1. Use correct Node version
nvm use

# 2. Run setup
./setup.sh

# 3. Start servers in 2 terminals
cd server && npm run dev        # Terminal 1
cd client && npm run dev        # Terminal 2

# 4. Open browser
http://localhost:3000
```

---

## If Something Breaks

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `npm cache clean --force` → `npm install` |
| Port already in use | `lsof -ti:3000 \| xargs kill -9` |
| Blank page | Check browser console (F12) for errors |
| API errors | Verify backend running: `curl http://localhost:3001/api/health` |
| Node version wrong | `nvm use 22.3.0` |

---

## Files You Need to Know

| File | Purpose |
|------|---------|
| `.env` | Your API key (copy from `.env.example` and add key) |
| `.nvmrc` | Locks Node to v22.3.0 |
| `server/index.js` | Backend entry point |
| `client/src/App.jsx` | Frontend entry point |
| `server/db/inventory.db` | Database (created by `npm run seed`) |

---

## Important Commands

```bash
# Setup
cp .env.example .env          # Copy env template
nvm use                       # Switch to v22.3.0
npm install                   # Install all dependencies (works from root)

# Development
npm run dev                   # Start backend (in server/)
npm run dev                   # Start frontend (in client/)

# Database
npm run seed                  # Populate sample data (in server/)

# Testing
npm test                      # Run tests (in server/)

# Cleanup (if needed)
rm -rf node_modules
npm cache clean --force
npm install
```

---

## Where to Find Help

- **Setup issues?** → See [SETUP.md](SETUP.md)
- **What was fixed?** → See [FIXES_APPLIED.md](FIXES_APPLIED.md)
- **Full summary?** → See [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md)
- **Quick start?** → See [README.md](README.md)

---

## API Key Setup

1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Create an API key
4. Add to `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```
5. Restart backend server

---

## Verification

After setup, verify:
- ✅ `node -v` shows v22.3.0
- ✅ `.env` file exists with API key
- ✅ Backend runs on port 3001
- ✅ Frontend runs on port 3000
- ✅ Browser shows inventory app
- ✅ Can add items
- ✅ No red errors in console

---

**Status:** ✅ Ready to use!

Keep this card handy for quick reference.
