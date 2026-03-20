const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

let genAI = null;
let textModel = null;
let jsonModel = null;

async function initAI() {
  if (!genAI) {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    
    // Check if GoogleGenerativeAI is available (just in case)
    if (!GoogleGenerativeAI) throw new Error('GoogleGenerativeAI module missing');

    genAI = new GoogleGenerativeAI(apiKey);
    
    let modelName = 'gemini-1.5-flash'; // default fallback
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await res.json();
      if (data && data.models) {
        const supported = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
        const best = supported.find(m => m.name.includes('flash')) || supported[0];
        if (best) modelName = best.name.replace('models/', '');
      }
    } catch(err) {
      console.error('Auto-detect models failed', err);
    }

    textModel = genAI.getGenerativeModel({ model: modelName });
    jsonModel = genAI.getGenerativeModel({ model: modelName });
  }
}

function sanitizeJSONResponse(text) {
  return text.replace(/```json\n?|```/gi, '').trim();
}

// Fallback supplier suggestions
const supplierFallbackPath = path.join(__dirname, '../data/supplier_fallback.json');
let supplierFallback = {};
if (fs.existsSync(supplierFallbackPath)) {
  supplierFallback = JSON.parse(fs.readFileSync(supplierFallbackPath, 'utf8'));
}

const SYSTEM_PROMPT = `You are a sustainability-focused inventory assistant. Be concise. Return only valid JSON when asked for structured data. Never hallucinate supplier names — use generic descriptions instead.`;

// POST /api/ai/categorize
router.post('/categorize', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.length < 2) {
    return res.status(400).json({ success: false, data: null, error: 'Name is required, min 2 chars', source: 'fallback' });
  }
  try {
    await initAI();
    const prompt = `${SYSTEM_PROMPT}\n\nSuggest category, unit, and reorder_threshold for: ${name}. Return ONLY valid JSON with keys: category, unit, reorder_threshold.`;
    const result = await jsonModel.generateContent(prompt);
    const responseText = sanitizeJSONResponse(result.response.text());
    const aiData = JSON.parse(responseText);
    return res.json({ success: true, data: aiData, error: null, source: 'ai' });
  } catch (e) {
    console.error('[AI Error - /categorize]', e);
    // Fallback
    return res.json({
      success: true,
      data: {
        category: 'Office Supply',
        unit: 'pcs',
        reorder_threshold: 10
      },
      error: e.message,
      source: 'fallback'
    });
  }
});

// POST /api/ai/insights
router.post('/insights', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ success: false, data: null, error: 'Items array required', source: 'fallback' });
  }
  try {
    await initAI();
    const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this inventory and return a plain-English risk report covering: items expiring within 7 days, items below reorder threshold, and top 3 actionable recommendations. Return only the report as text.\n${JSON.stringify(items)}`;
    const result = await textModel.generateContent(prompt);
    const responseText = result.response.text();
    return res.json({ success: true, data: responseText, error: null, source: 'ai' });
  } catch (e) {
    console.error('[AI Error - /insights]', e);
    fs.appendFileSync(path.join(__dirname, '../ai-error.log'), new Date().toISOString() + ' ' + (e.stack || e.toString()) + '\n');
    // Fallback: rule-based report
    const now = new Date();
    const expiringSoon = items.filter(item => item.expiry_date && new Date(item.expiry_date) > now && (new Date(item.expiry_date) - now) / (1000 * 60 * 60 * 24) <= 7);
    const expired = items.filter(item => item.expiry_date && new Date(item.expiry_date) < now);
    const lowStock = items.filter(item => item.quantity <= item.reorder_threshold);
    let report = `Rule-based Inventory Risk Report:\n`;
    report += `Expiring within 7 days: ${expiringSoon.length}\n`;
    report += `Expired items: ${expired.length}\n`;
    report += `Low stock items: ${lowStock.length}\n`;
    report += `Top 3 recommendations:\n`;
    if (expiringSoon.length) report += `- Use expiring items soon to avoid waste.\n`;
    if (lowStock.length) report += `- Reorder low stock items promptly.\n`;
    report += `- Review supplier options for sustainability.\n`;
    return res.json({ success: true, data: report, error: e.message, source: 'fallback' });
  }
});

// POST /api/ai/reorder-suggestion
router.post('/reorder-suggestion', async (req, res) => {
  const { item_name, category } = req.body;
  if (!item_name || typeof item_name !== 'string' || item_name.length < 2) {
    return res.status(400).json({ success: false, data: null, error: 'item_name required, min 2 chars', source: 'fallback' });
  }
  try {
    await initAI();
    const prompt = `${SYSTEM_PROMPT}\n\nSuggest 2-3 sustainable/local supplier alternatives for ${item_name} (${category}). Give a brief reason for each. Return ONLY valid JSON array with objects having keys: supplier, reason.`;
    const result = await jsonModel.generateContent(prompt);
    const responseText = sanitizeJSONResponse(result.response.text());
    const aiData = JSON.parse(responseText);
    return res.json({ success: true, data: aiData, error: null, source: 'ai' });
  } catch (e) {
    console.error('[AI Error - /reorder-suggestion]', e);
    // Fallback: static suggestions
    let suggestions = supplierFallback[category] || [
      { supplier: 'Local Supplier', reason: 'Reduces transport emissions' },
      { supplier: 'Refurbished Supplier', reason: 'Promotes reuse and sustainability' }
    ];
    return res.json({ success: true, data: suggestions, error: e.message, source: 'fallback' });
  }
});

module.exports = router;
