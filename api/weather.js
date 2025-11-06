const axios = require('axios');

const DEFAULT_CITY = process.env.WEATHER_CITY || 'Hyderabad';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
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

    let effects = 'Moderate temperatures provide comfortable conditions for outdoor activities.';

    if (temperature > 30) {
      effects = 'High temperatures can cause heat exhaustion, dehydration, and discomfort. Stay hydrated, avoid prolonged sun exposure.';
    } else if (temperature < 10) {
      effects = 'Cold weather can lead to hypothermia, frostbite risk, and joint stiffness. Dress in layers, stay warm.';
    }

    return res.json({
      city: resolvedCity,
      temperature,
      condition,
      effects,
      provider: 'open-meteo'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Could not fetch weather data.',
      details: err.message
    });
  }
};