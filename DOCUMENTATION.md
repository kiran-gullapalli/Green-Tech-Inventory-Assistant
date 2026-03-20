# Design & Technical Documentation: Green-Tech Inventory Assistant

## 1. Executive Summary
The **Green-Tech Inventory Assistant** is a next-generation asset management platform focused on environmental sustainability and intelligent waste reduction. By merging real-time inventory tracking with Generative AI insights (Google Gemini), the application provides managers with a deterministic way to track, manage, and optimize their supply chains to minimize waste and carbon impact.

---

## 2. Core Architecture Overview

We chose a **Client-Server-Database** architecture pattern designed for high availability and low latency. The entire stack is unified under a single language (JavaScript/Node), ensuring a seamless developer experience and shared logic between the frontend and backend.

### ● High-Level Data Flow:
1.  **React Frontend**: captures user input and displays real-time analytics.
2.  **Express.js API**: serves as the orchestration layer, handling routing, middleware authentication, and validation.
3.  **Intelligent AI Proxy**: interacts with the Google Gemini 1.5 SDK to process natural language prompts.
4.  **Local Storage Layer**: manages a high-performance SQLite database for persistent, thread-safe data storage.

---

## 3. Technology Stack & Design Choices

| Component | Technology | Rationale & Design Choice |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | **Vite** was chosen over Create React App (CRA) for its blazing-fast Hot Module Replacement (HMR) and superior build-time performance. **React 18** provides the latest concurrent features, enabling a highly responsive UI even with large data sets. |
| **Backend** | Node.js (v22) + Express | Express.js is a lightweight, battle-tested framework. It allows us to build a modular REST API that can easily scale into microservices in the future. |
| **Styling** | Vanilla CSS + Tailwind | We used a "Premium" design philosophy: vibrant gradients, glassmorphism card styles, and Tailwind’s utility-first classes to ensure consistent spacing and accessibility across all screen sizes. |
| **Database** | SQLite (better-sqlite3) | Unlike traditional PostgreSQL/MongoDB which requires a separate service, **SQLite** is embedded. This makes the app truly "portable"—perfect for a 48-hour challenge and simple for users to clone and run in one step. |
| **AI LLM** | Google Gemini 1.5 Flash | **Gemini Flash** was chosen because it is significantly faster and more cost-effective than Gemini Pro or OpenAI's GPT-4, making it ideal for real-time task categorization and reordering prompts. |

---

## 4. Key Logic & Internal Systems

### ● The Sustainability Score (Our Custom Metric)
We moved beyond simple "Stock Counts" to develop a proprietary scoring algorithm focused on **Waste Prevention**.
*   **Healthy State**: An item contributes positively if it is **Not Expired** AND **Not at Low Stock**.
*   **Formula**: `(Verified Safe Items / Total Inventory Count) * 100`.
*   **Goal**: This shifts the manager's behavioral psychology from "just ordering more" to "using what we have before it spoils."

### ● AI Suggestion vs Human Autonomy
A major design choice was the **"Suggest, Don't Force"** policy.
*   The "AI-Fill" button predicts Category, Unit, and Threshold.
*   However, all fields remain fully editable by the user. 
*   **Why?** This prevents "AI Hallucinations" from corrupting the database, ensuring the user remains the ultimate ground truth.

### ● Rule-Based Fallback Engine
To ensure **99.9% uptime** even without an Internet connection for AI calls:
*   We implemented a mirrored logic bridge in `server/routes/ai.js`.
*   If the Gemini API call fails (due to quota, 404, or network), a local rule-engine generates a formatted report based on deterministic code. 
*   The UI displays a transparent warning banner: *"AI Unavailable - Showing Rule-Based Analysis."*

---

## 5. Security & Quality Assurance 

### ● Environment & Key Safety
We use a strict `.env` strategy. Our `.gitignore` explicitly prevents API keys or database files from being committed to public repositories. We provided a `.env.example` so the dev setup is consistent and secure for every teammate.

### ● Input Validation
We implemented multi-layered validation:
1.  **React Frontend**: Prevents basic form submission errors.
2.  **Express Backend**: Validates data types, name lengths, and critical business logic (e.g., *Expiry Date cannot be before Purchase Date*).

### ● Automated Testing
Our test suite (`server/tests`) covers both the "Happy Path" (successful creation) and "Edge Cases" (invalid dates, missing data). This prevents regressions when we add new AI features.

---

## 6. Future Strategic Roadmap

### ● Phase 1: Operational Efficiency 
*   **Mobile OCR**: Integrating camera support to allow users to scan labels and have the AI populate inventory automatically.
*   **QR/Barcode Generator**: Generating unique scannable labels for every item directly from the Dashboard.

### ● Phase 2: Intelligence & Integration
*   **Predictive Forecasting**: Using historical inventory snapshot data to train a time-series model (or use AI) to predict exactly when an item will hit zero.
*   **Supply Chain ESG**: Connecting to external ESG (Environmental, Social, and Governance) databases to verify supplier sustainability claims in real-time.

### ● Phase 3: Scaling
*   **Multi-Vault support**: Moving from a single SQLite file to a distributed PostgreSQL system for multi-site warehouse operations.
*   **Offline-First Mobile App**: Using PWA technologies to ensure the warehouse floor team can update stock even without Wi-Fi.
