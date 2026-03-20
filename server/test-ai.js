const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log('API KEY:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function run() {
  try {
    const result = await textModel.generateContent('Say exactly: OK');
    console.log('AI Response:', result.response.text());
  } catch (e) {
    console.error('AI Error:', e);
  }
}
run();
