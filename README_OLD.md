# Green-Tech-Inventory-Assistant
# Green-Tech Inventory Assistant

A lightweight inventory management app for small businesses, cafes, nonprofits, and university labs. Uses AI to track assets, predict expiry/reorder timing, and suggest sustainable procurement alternatives. Designed for ease of use and waste reduction.

## Setup Instructions

1. Copy environment variables:
	```bash
	cp .env.example .env
	# Fill in your ANTHROPIC_API_KEY
	```
2. Install dependencies:
	```bash
	cd server && npm install
	cd ../client && npm install
	```
3. Seed the database:
	```bash
	cd ../server
	npm run seed
	```
4. Start development servers concurrently:
	```bash
	npm run dev
	# (in server) and
	npm run dev
	# (in client)
	```

## Running Tests

Run backend tests inside the server folder:
```bash
npm test
```

## AI Features & Fallbacks
- Predictive categorization, reorder insights, and supplier suggestions powered by Anthropic Claude API.
- If AI is unavailable, rule-based/static fallbacks are used automatically.
- All AI responses include `{ source: "ai" | "fallback" }` for transparency.

## Sustainability Score Formula

Sustainability Score = \( \frac{\text{items_consumed_before_expiry}}{\text{total_items}} \times 100 \)

Displayed as a percentage ring/bar in the dashboard.

## Known Limitations & Responsible AI Notes
- AI suggestions are not guaranteed accurate; always verify before procurement.
- ANTHROPIC_API_KEY is never logged or stored.
- .env must never be committed; ensure it’s in .gitignore.
- No external UI libraries except Tailwind CSS.
- Designed for small teams; not a full enterprise solution.

---

For hackathon support or questions, contact the project maintainers.
