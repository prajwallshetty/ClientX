// Simple test script to verify Gemini API key
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

console.log('=================================');
console.log('🧪 Testing Gemini API Key');
console.log('=================================');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : '❌ NOT FOUND');
console.log('Key Length:', apiKey ? apiKey.length : 0);
console.log('=================================\n');

if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    console.log('📡 Attempting to connect to Gemini API...\n');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello in one word');
    const response = result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! API Key is working!');
    console.log('Response from Gemini:', text);
    console.log('\n🎉 Your Gemini AI integration is ready to use!');
    
  } catch (error) {
    console.error('❌ ERROR: API Key test failed');
    console.error('Error message:', error.message);
    console.error('\n📋 Possible solutions:');
    console.error('1. Get a new API key from: https://aistudio.google.com/app/apikey');
    console.error('2. Make sure the Generative Language API is enabled');
    console.error('3. Check if your API key has any restrictions');
    console.error('4. Verify you created the key in Google AI Studio (not Cloud Console)');
  }
}

testAPI();
