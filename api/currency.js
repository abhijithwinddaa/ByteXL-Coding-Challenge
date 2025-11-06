const axios = require('axios');

function getDefaultSymbol(code) {
  const symbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥',
    'CNY': '¥', 'AUD': 'A$', 'CAD': 'C$', 'AED': 'د.إ', 'SGD': 'S$'
  };
  return symbols[code] || code;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    const { amount: amountRaw, from = 'INR', to = 'USD' } = req.query;
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount. Provide a non-negative number.' });
    }

    const base = String(from).toUpperCase();
    const target = String(to).toUpperCase();

    const er = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
    const rates = er.data?.rates || {};
    
    if (!rates.USD) rates.USD = 1;
    
    const baseRate = rates[base];
    const targetRate = rates[target];
    
    if (baseRate === undefined || targetRate === undefined) {
      throw new Error(`Currency not supported.`);
    }
    
    const exchangeRate = targetRate / baseRate;
    const convertedValue = Number((amount * exchangeRate).toFixed(2));
    
    return res.json({
      base,
      amount,
      [target]: convertedValue,
      fromSymbol: getDefaultSymbol(base),
      toSymbol: getDefaultSymbol(target),
      rate: exchangeRate
    });
  } catch (err) {
    return res.status(500).json({ error: 'Could not convert currency.', details: err.message });
  }
};