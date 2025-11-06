const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_NINJAS_KEY = process.env.API_NINJAS_KEY || 'aXJF8DUXeo1vjs0NG1T0qg==VvdhTgHRKpseEVLu';

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'infohub-api' });
});

// --- Quote API (/api/quote) ---
app.get('/api/quote', async (_req, res) => {
  // Try API Ninjas Quotes API first (with API key) - try without category if 400 error
  try {
    let response;
    // Try with category first
    try {
      response = await axios.get('https://api.api-ninjas.com/v1/quotes', {
        params: { category: 'inspirational' },
        headers: { 'X-Api-Key': API_NINJAS_KEY },
        timeout: 5000
      });
    } catch (categoryErr) {
      // If category fails, try without category parameter
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
    // Silently fail and try next API
  }

  // Try zenquotes.io (free, no key required) - more reliable
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
    // Silently fail and try next API
  }

  // Try quotable.io as fallback (free, no key required) - skip if certificate issues
  try {
    const response = await axios.get('https://api.quotable.io/random', { 
      timeout: 5000,
      headers: { 'Accept': 'application/json' },
      // Skip SSL verification for certificate issues (not recommended for production)
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
    const data = response.data;
    
    // Handle quotable.io response format: { content, author, tags, ... }
    if (data && data.content && data.author) {
      return res.json({
        text: data.content.trim(),
        author: data.author.trim()
      });
    }
  } catch (err) {
    // Silently fail
  }

  // If all APIs fail, return error (no fallback quotes)
  return res.status(500).json({ error: 'Could not fetch quote from any API.' });
});

// --- Weather API (/api/weather) ---
const DEFAULT_CITY = process.env.WEATHER_CITY || 'Hyderabad';

app.get('/api/weather', async (req, res) => {
  let resolvedCity = DEFAULT_CITY;
  let temperature = null;
  let weatherCode = null;
  let condition = null;

  try {
    const { city, lat, lon } = req.query;
    const targetCity = city || DEFAULT_CITY;

    let latitude = Number(lat);
    let longitude = Number(lon);
    resolvedCity = targetCity;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      if (city) {
        try {
          const gres = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: { name: city, count: 1 },
          });
          const g = gres.data?.results?.[0];
          if (g) {
            latitude = g.latitude;
            longitude = g.longitude;
            resolvedCity = g.name;
          }
        } catch {
          // fallback to default coordinates
        }
      }
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      latitude = 17.3850; // Hyderabad
      longitude = 78.4867;
    }

    const mres = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: { latitude, longitude, current_weather: true },
    });
    const cw = mres.data?.current_weather;
    temperature = cw?.temperature;
    weatherCode = cw?.weathercode;
    condition = `Temperature: ${temperature}°C, Weather code: ${weatherCode}`;

    // Basic manual explanation based on temperature
    let effects = 'Moderate temperatures provide comfortable conditions for outdoor activities. This weather is generally pleasant for most daily activities and transportation.';

    if (temperature > 30) {
      effects = 'High temperatures can cause heat exhaustion, dehydration, and discomfort. Stay hydrated, avoid prolonged sun exposure, and seek shade. Outdoor activities should be limited during peak hours.';
    } else if (temperature < 10) {
      effects = 'Cold weather can lead to hypothermia, frostbite risk, and joint stiffness. Dress in layers, stay warm, and be cautious of icy conditions. Heating systems will be in high demand.';
    }

    return res.json({
      city: resolvedCity,
      temperature,
      condition,
      effects,
      provider: 'open-meteo'
    });
  } catch (err) {
    console.error('Weather API error:', err.message);
    // Even if error, return basic default response
    return res.status(500).json({
      error: 'Could not fetch weather data.',
      details: err.message
    });
  }
});

// --- Currency API (/api/currency) ---
app.get('/api/currency', async (req, res) => {
  try {
    const { amount: amountRaw, from = 'INR', to = 'USD' } = req.query;
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount. Provide a non-negative number.' });
    }

    const base = String(from).toUpperCase();
    const target = String(to).toUpperCase();

    // Use exchangerate-api.com (free, no key required)
    let exchangeRate = 1;
    
    try {
      // Fetch rates with USD as base (free tier)
      const er = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
      const rates = er.data?.rates || {};
      
      if (!rates.USD) rates.USD = 1; // Ensure USD is 1
      
      const baseRate = rates[base];
      const targetRate = rates[target];
      
      if (baseRate === undefined || baseRate === null) {
        throw new Error(`Currency ${base} is not supported.`);
      }
      if (targetRate === undefined || targetRate === null) {
        throw new Error(`Currency ${target} is not supported.`);
      }
      
      // Calculate exchange rate: (amount in base) * (targetRate / baseRate) = amount in target
      exchangeRate = targetRate / baseRate;
      const convertedValue = Number((amount * exchangeRate).toFixed(2));
      
      return res.json({
        base,
        amount,
        [target]: convertedValue,
        fromSymbol: getDefaultSymbol(base),
        toSymbol: getDefaultSymbol(target),
        rate: exchangeRate
      });
    } catch (apiErr) {
      console.error('Exchange rate API error:', apiErr.message);
      throw new Error(`Could not fetch exchange rate: ${apiErr.message}`);
    }
  } catch (err) {
    console.error('Currency API error:', err.message);
    return res.status(500).json({ error: 'Could not convert currency.', details: err.message });
  }
});

// Helper function to get default currency symbols
function getDefaultSymbol(code) {
  const symbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥',
    'CNY': '¥', 'AUD': 'A$', 'CAD': 'C$', 'AED': 'د.إ', 'SGD': 'S$',
    'CHF': 'CHF', 'NZD': 'NZ$', 'HKD': 'HK$', 'KRW': '₩', 'MXN': '$',
    'BRL': 'R$', 'ZAR': 'R', 'TRY': '₺', 'RUB': '₽', 'SEK': 'kr'
  };
  return symbols[code] || code;
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`InfoHub API running on port ${PORT}`);
});


