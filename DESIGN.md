# Design Documentation: Green-Tech Inventory Assistant

## 1. Vision & Design Philosophy

The **Green-Tech Inventory Assistant** was designed to bridge the gap between traditional warehouse management and environmental responsibility. Our design philosophy centers on three pillars:

1.  **Sustainability-First**: Every data point is used to calculate and visualize environmental impact (waste prevention).
2.  **Intelligence-Native**: AI is not an "add-on" but is baked into the core workflow (e.g., Categorization, Analysis, and Reordering).
3.  **Premium Experience**: A "Next-Gen" UI featuring glassmorphism, vibrant gradients, and micro-animations to make inventory management feel modern and engaging.

---

## 2. High-Level Architecture

The application follows a standard **Client-Server-Database** architecture, optimized for speed and simplicity:

### ● Frontend (The Dashboard)
*   **Framework**: React 18 with Vite.
*   **State Management**: React Hooks (useState/useEffect) for lightweight, responsive state.
*   **Styling**: Tailwind CSS for a scalable, mobile-first design system.
*   **Philosophy**: A tabbed navigation system that separates real-time analytics from operational management.

### ● Backend (The Intelligence Layer)
*   **Runtime**: Node.js 22.
*   **API Framework**: Express.js.
*   **Features**:
    *   RESTful API endpoints for Inventory CRUD.
    *   A dedicated AI Controller that bridges the gap between raw data and the Gemini LLM.
    *   Automated Health Check system for monitoring API availability.

### ● Database (The Storage)
*   **Engine**: SQLite via `better-sqlite3`.
*   **Rationale**: We chose SQLite for its zero-configuration requirement, incredible read/write speed for single-machine applications, and its "Database-as-a-File" portability.

### ● AI Engine (The Brain)
*   **Provider**: Google Gemini Pro & Flash (1.5).
*   **Integration**: Direct SDK integration with a dynamic model-discovery layer.
*   **Use Cases**: 
    1.  **Named Entity Recognition**: Extracting units and categories from free-text item names.
    2.  **Analytical Reasoning**: Summarizing stock risks into management action plans.
    3.  **Alternative Recommendation**: Suggesting sustainable vendors.

---

## 3. Tech Stack Breakdown

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Blazing fast hot-module replacement and modern component architecture. |
| **Backend** | Node.js | Unified JavaScript ecosystem for both frontend and backend teams. |
| **API** | Express | Lightweight, modular routing for fast development. |
| **Database** | SQLite | High performance with zero setup overhead; perfect for local-first apps. |
| **Styling** | Tailwind CSS | Utility-first approach for rapid, consistent UI prototyping. |
| **AI SDK** | @google/generative-ai | Seamless integration with Gemini 1.5 models. |
| **Icons & Media** | Emoji + CSS Gradients | Lightweight, dependency-free icons that maintain "Premium" speed. |

---

## 4. Key Design Decisions

### ● The "Sustainability Score" Logic
We moved away from "Inventory Accuracy" as a primary KPI. Instead, we developed a proprietary **Sustainability Score** that penalizes expired items and rewarded maintained stock levels. This shifts the user's focus from "What do I have?" to "What am I wasting?".

### ● Rule-Based Fallback Engine
To ensure the app remains functional in offline or low-quota scenarios, we implemented a mirrored logic bridge. If the AI service fails, a built-in rule engine takes over, calculating risks using standard database queries so the manager never loses access to critical info.

### ● Modal-First Editing
To maintain context, we used a modal-based editing system for inventory updates. This prevents the user from losing their search or filter state while making small stock adjustments.

---

## 5. Future Enhancements & Roadmap

### ● Phase 1: Operational Efficiency 
*   **OCR Image Scanning**: Allow users to take a photo of a receipt or a shipping label and have the AI automatically parse and add items to the inventory.
*   **Barcode/QR Generation**: Generate and print labels directly from the management tab to uniquely identify and track items on a shelf.

### ● Phase 2: Intelligence & Integration 
*   **Predictive Demand Forecasting**: Using historical SQLite data to train lightweight local models (or prompt LLMs) to predict exactly when a "Low Stock" event will occur.
*   **Sustainability API Connectors**: Linking with global ESG data providers to verify supplier sustainability scores in real-time.

### ● Phase 3: Scaling & Mobile
*   **PWA (Progressive Web App)**: Enabling offline-first use and installation on mobile devices for warehouse-floor operations.
*   **PostgreSQL Migration**: Transitioning to a distributed PostgreSQL database for multi-user, multi-warehouse support.
