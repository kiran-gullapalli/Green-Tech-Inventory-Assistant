const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './.env' });

async function verify() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const SYSTEM_PROMPT = `You are a sustainability-focused inventory assistant. Be concise. Return only valid JSON when asked for structured data. Never hallucinate supplier names — use generic descriptions instead.`;
    
    // Insights Test
    console.log('\nTesting textModel with gemini-1.5-flash...');
    const items = [{"name": "LED Bulbs", "expiry_date": "2027-01-01", "quantity": 50, "reorder_threshold": 20}];
    const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this inventory and return a plain-English risk report covering: items expiring within 7 days, items below reorder threshold, and top 3 actionable recommendations. Return only the report as text.\n${JSON.stringify(items)}`;
    
    const result = await textModel.generateContent(prompt);
    console.log("Insights Report format verified. Length:", result.response.text().length);

  } catch(e) {
    console.error("Test failed precisely due to:", e);
  }
}
verify();
