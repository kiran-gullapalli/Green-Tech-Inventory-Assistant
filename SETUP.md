# Setup Guide - Green-Tech Inventory Assistant

## Quick Start

### ● Prerequisites:
*   **Node.js**: v22.3.0 (Recommended for native module compatibility)
*   **npm**: v10.0.0 or higher
*   **Gemini API Key**: Required for AI Insight features (Get one at [Google AI Studio](https://aistudio.google.com/))
*   **Operating System**: Linux/Mac (Recommended) or Windows with WSL2

### ● Run Commands:
1.  **Environment Setup**:
    ```bash
    cp .env.example .env
    # Add your GEMINI_API_KEY to the .env file
    ```
2.  **Server Setup**:
    ```bash
    cd server
    npm install
    npm run seed # Initialize the SQLite database with sample data
    npm run dev  # Starts on http://localhost:3001
    ```
3.  **Client Setup**:
    ```bash
    cd ../client
    npm install
    npm run dev  # Starts on http://localhost:3000
    ```

### ● Test Commands:
*   **Backend Tests**: `cd server && npm test`
*   **Health Check**: `curl http://localhost:3001/api/health`
*   **API Verification**: Use the "Generate AI Report" button in the Dashboard for end-to-end AI testing.
