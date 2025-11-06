const axios = require('axios');
const https = require('https');

const API_NINJAS_KEY = process.env.API_NINJAS_KEY || 'aXJF8DUXeo1vjs0NG1T0qg==VvdhTgHRKpseEVLu';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Try API Ninjas first
  try {
    let response;
    try {
      response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
        params: { category: 'inspirational' },
        headers: { 'X-Api-Key': API_NINJAS_KEY },
        timeout: 5000
      });
    } catch (categoryErr) {
      response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
        headers: { 'X-Api-Key': API_NINJAS_KEY },
        timeout: 5000
      });
    }
    
    const quotes = response.data;
    if (Array.isArray(quotes) && quotes.length > 0) {
      const quote = quotes[0];
      if (quote.quote && quote.author) {
        return res.json({
          text: quote.quote.trim(),
          author: quote.author.trim()
        });
      }
    }
  } catch (err) {
    // Try zenquotes.io
  }

  try {
    const response = await axios.get('https://zenquotes.io/api/random', { 
      timeout: 5000,
      headers: { 'Accept': 'application/json' }
    });
    const data = response.data && Array.isArray(response.data) ? response.data[0] : null;
    
    if (data && data.q && data.a) {
      return res.json({
        text: data.q,
        author: data.a
      });
    }
  } catch (err) {
    // Try quotable.io
  }

  try {
    const response = await axios.get('https://api.quotable.io/random', { 
      timeout: 5000,
      headers: { 'Accept': 'application/json' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const data = response.data;
    
    if (data && data.content && data.author) {
      return res.json({
        text: data.content.trim(),
        author: data.author.trim()
      });
    }
  } catch (err) {
    // Final fallback
  }

  return res.status(500).json({ error: 'Could not fetch quote from any API.' });
};