# Green-Tech Inventory Assistant - Project Report

**Candidate Name:** Kiran Gullapalli
**Scenario Chosen:** Green-Tech Inventory Assistant (Sustainability-focused Inventory Management)
**Estimated Time Spent:** ~16hours (Core development, AI integration, and Refinement)

---

## Getting Started

To get the application up and running on your local machine, please follow the detailed instructions in the [**SETUP.md**](./SETUP.md) file.


---

## AI Disclosure

### ● Did you use an AI assistant? 
**Yes.** I used an AI assistant to help with the boilerplate React components, complex CSS styling for the "premium" look, and for setting up the initial logic for the Google Gemini API integration.

### ● How did you verify the suggestions?
I verified the AI's suggestions through:
1.  **Manual Code Review**: Checking every line for potential logic errors or outdated syntax.
2.  **API Testing**: Using `curl` and custom test scripts (like `server/test-ai.js`) to ensure the Gemini SDK was responding correctly to prompts.
3.  **UI Verification**: Interacting with the "Add Item" form to ensure AI categorization didn't cause application state crashes.

### ● Three AI Suggestions I Rejected/Changed:
I disagreed with several AI-generated patterns and rejected them to preserve the application's premium feel and data accuracy:
1.  **AI 'Note' Content Disagreement**: The AI suggested automatically populating the "Notes" field with repetitive generic text (like "Sustainable choice!"). I **rejected** this to keep the inventory clean for actual operational notes and metadata.
2.  **Categorization Over-Automation**: The AI suggested making the category and unit fields "Read-Only" once the AI prediction arrived. I **rejected** this because AI is not perfect—I insisted on a pattern where AI *suggests* but the user always has the final override authority.
3.  **Supplier Hallucinations**: In the reorder suggestions, the AI initially tried to name specific small businesses that it "hallucinated." I **rejected** these specific names in favor of broader "Sustainable Category" types to ensure all data presented to the user is 100% verified.

---

## Technical Highlight: Individual Reorder Threshold (My Addition)

A critical feature I added on my own—which was not part of the initial AI-suggested boilerplate—is the **Individual Reorder Threshold** for every item.

*   **The Problem**: Default inventory trackers usually have a single "Low Stock" warning for everything (e.g., alert if count < 5).
*   **My Solution**: I manually modified the schema, the "Add Item" form, and the Dashboard logic to support item-specific thresholds. This means a user can set a threshold of 1 for a Laptop and 500 for LED Bulbs.
*   **Technical Implementation**: I integrated this value directly into the **Sustainability Score** calculation, ensuring that an item is only considered "Healthy" if it is above its specific threshold.

---

## Tradeoffs & Prioritization

### ● What did you cut to stay within the 48 hour limit?
*   **User Authentication**: I prioritized core inventory and AI features over building a robust multi-user login system.
*   **Real-time Image Recognition**: I cut this to ensure the text-based Intelligent Categorization was 100% stable.
*   **Complex Supplier Analytics**: I replaced a full module with a streamlined AI-powered "Insight Panel."

### ● What would you build next if you had more time?
1.  **Predictive Consumption**: Using historical data to predict exactly when a specific item will hit its threshold.
2.  **Barcode/QR Scanning**: Mobile-friendly camera integration for instant stock updates.
3.  **Third-Party ESG Integration**: Syncing with environmental standards for even more accurate sustainability scores.

### ● Known limitations:
*   **SQLite Storage**: The backend uses better-sqlite3, which is incredibly fast but requires persistent disk storage for non-ephemeral deployments.
*   **API Rate Limits**: The Free Tier of the Gemini API is limited to roughly 15 requests per minute.

---

## Sustainability Score Calculation

The **Sustainability Score** (visible on the Dashboard) is the core metric of the application. It is calculated dynamically based on real-time inventory health using the following logic:

### The Formula:
`Sustainability Score = (Healthy Items / Total Items) * 100`

### Defining a "Healthy" (Waste-Reducing) Item:
The code specifically marks an item as contributing to the score if it meets these criteria:
1.  **No Expiry Threat**: If the item has an expiry date, it must be in the future. Expired items represent wasted product and negative environmental impact.
2.  **Sufficient Stock**: The item's current quantity must be **strictly greater** than its `reorder_threshold`.
3.  **Non-Perishable Safety**: Items without any expiry date are automatically considered "safe" contributors to the score.

By focusing on the ratio of "Ready-to-use" items vs "Expired/Restocking" items, the score encourages a "Just-in-Time" inventory model that minimizes over-ordering and waste.

---

## Project Features (Detailed Descriptions)

1.  **Comprehensive Dashboard**: Provides an at-a-glance view of 5 key metrics: Total Items, Expiring Soon (7-day window), Low Stock items, direct count of Expired goods, and the overall Sustainability Score.
2.  **Sustainability Tracking**: Automatically calculates a "Green Score" based on waste-prevention metrics. This encourages users to prioritize expiring items and prevent product waste.
3.  **Intelligent AI Categorization**: When adding a new item, the "AI-Fill" button sends the item name to Gemini to predict its Category, Unit (e.g., kg/L/pcs), and a safe Reorder Threshold.
4.  **Generative AI Risk Reports**: Generates a human-readable intelligence report summarizing current inventory risks and providing 3 actionable recommendations for the manager.
5.  **Smart Inventory Management**: Full CRUD capabilities with premium UI components (modals, status badges) and real-time search/filtering.
6.  **Sustainable Reorder Recommendations**: For low-stock items, the AI suggests 2-3 local or eco-friendly supplier alternatives to reduce the company's carbon footprint.

---

## Extra Credit: Reliability & UX Features

1.  **Dynamic AI Model Discovery**: The backend probes the Gemini API to find the most compatible model (Flash vs Pro) for your key, preventing 404 errors during Google updates.
2.  **AI Markdown Sanitization**: AI responses are automatically sanitized using regex to strip code blocks, ensuring a clean and professional look in the UI.
3.  **Manual Reorder Thresholds**: This feature allows for individual alert levels per item, ensuring that different stock types (e.g., computers vs office supplies) are managed correctly.

---

## Minimum Requirement Checklist & Implementation

### 1. Core Flow (Success)
*   **The Flow**: I implemented a complete **Create → View → Update** cycle. Users can add an item, view it in the inventory table (with search/filter), and update its stock or details via a modal.
*   **Search/Filter**: The application supports real-time search by name and filtering by Category or Status (e.g., "See only Perishables that are Low Stock").

### 2. AI Integration + Fallback (Success)
*   **AI Capability**: I implemented dual AI capabilities: **Intelligent Categorization** and **Natural Language Risk Summarization**.
*   **Manual/Rule-Based Fallback**: 
    *   If the Gemini API is unreachable, the **Categorization** feature falls back to a safe default ("Office Supply").
    *   The **Risk Report** feature switches to a **Rule-Based Engine** that manually calculates expiration and stock counts to present a formatted text report even when offline.

### 3. Basic Quality (Success)
*   **Input Validation**: Both frontend (React hooks) and backend (Express middleware) validate item data. For example, it's impossible to save an item with an expiry date that precedes the purchase date.
*   **Clear Error Messages**: The UI displays user-friendly red alert banners with specific instructions when a request fails.
*   **Tests**: I included 2+ automated tests in `server/tests/inventory.test.js`:
    *   **Happy Path**: `POST /api/inventory with valid data → 201 Success`.
    *   **Edge Case**: `POST /api/inventory with expiry before purchase → 400 Bad Request`.

### 4. Data Safety (Success)
*   **Synthetic Data Only**: All items in the initial database are realistic but synthetic (e.g., "LED Bulbs", "Organic Milk"). 
*   **Sample Data**: A small sample JSON file is included at `server/data/sample_inventory.json` for easy database seeding/review.

### 5. Security (Success)
*   **No Hardcoded Keys**: No API keys are committed to the repository.
*   **Environment Management**: All secrets (GEMINI_API_KEY) are managed via a `.env` file. I have provided a `.env.example` in the root directory for easy configuration.
