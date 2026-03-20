# Green-Tech Inventory Assistant

A lightweight, AI-powered inventory management app for small businesses, cafes, nonprofits, and university labs. Uses AI to track assets, predict expiry/reorder timing, and suggest sustainable procurement alternatives. Designed for ease of use and waste reduction.

## ⚡ Quick Start (3 Steps)

### 1. Install Node v22.3.0
Use nvm (recommended):
```bash
nvm use
# or: nvm install 22.3.0 && nvm use 22.3.0
```

### 2. Run Setup Script
```bash
./setup.sh
# Or manually: cp .env.example .env, then npm install both client & server
```

### 3. Start Development Servers
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd client && npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📋 Setup Instructions (Detailed)

1. **Clone and configure environment:**
	```bash
	cp .env.example .env
	# Edit .env and add your ANTHROPIC_API_KEY from https://console.anthropic.com/
	```

2. **Install dependencies:**
	```bash
	cd server && npm install && npm run seed
	cd ../client && npm install
	```

3. **Start development servers concurrently:**
	```bash
	# Terminal 1 - Backend
	cd server && npm run dev
	
	# Terminal 2 - Frontend
	cd client && npm run dev
	```

Visit `http://localhost:3000`

---

## 🧪 Running Tests

```bash
cd server
npm test
```

---

## 🤖 AI Features & Fallbacks

- **Predictive Categorization**: AI suggests category, unit, and reorder threshold for new items
- **Reorder Insights**: AI analyzes inventory for expiring items and low stock  
- **Supplier Suggestions**: AI recommends sustainable/local suppliers

All features include **automatic fallbacks** if AI is unavailable:
```json
{ "source": "ai" | "fallback" }
```

---

## 📊 Sustainability Score Formula

Sustainability Score = (items_consumed_before_expiry / total_items) × 100

Displayed as a percentage in the dashboard.

---

## 🛠 Project Structure

```
Green-Tech-Inventory-Assistant/
├── server/                    # Node.js + Express backend
│   ├── index.js              # Server entry point
│   ├── routes/
│   │   ├── inventory.js       # Inventory CRUD + status
│   │   └── ai.js             # AI categorization & insights
│   ├── db/
│   │   ├── database.js        # SQLite setup
│   │   └── seed.js            # Sample data
│   └── package.json
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── components/       # UI components
│   │   └── main.jsx
│   └── package.json
├── .env.example              # Environment template
└── SETUP.md                  # Detailed troubleshooting guide
```

---

## ⚠️ Troubleshooting

**Most issues are solved by:**
1. Check Node version: `node --version` (should be v22.3.0)
2. Delete node_modules: `rm -rf server/node_modules client/node_modules`
3. Clear npm cache: `npm cache clean --force`
4. Reinstall: `npm install`

**See SETUP.md for detailed solutions to:**
- Port conflicts
- Module not found errors
- CORS/API connection issues  
- Build failures

---

## 🔐 Security & Responsible AI

- ✅ API keys stored in `.env`, never committed
- ✅ AI suggestions verified before use (not guaranteed accurate)
- ✅ Fallback system ensures app works without AI
- ✅ Synthetic sample data only (no live scraping)
- ✅ All `.env` details in `.gitignore`

---

## 📦 Tech Stack

**Backend:**
- Node.js v22.3.0
- Express.js
- SQLite (better-sqlite3)
- Anthropic Claude API

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS

---

## 🎯 Known Limitations

- Designed for small teams (< 100 users)
- SQLite not suitable for large-scale deployment
- AI suggestions should always be verified
- No user authentication/permissions system

---

## 📝 Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx  # Required
PORT=3001                                # Optional (default 3001)
NODE_ENV=development                     # Optional
VITE_API_URL=http://localhost:3001      # Optional
```

---

**For detailed setup help and troubleshooting, see [SETUP.md](SETUP.md).**

For hackathon support, contact the project maintainers.
