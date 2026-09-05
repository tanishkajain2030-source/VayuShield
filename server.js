const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // Cache responses for 10 minutes

// 1. CORS Configuration (Allows Vercel, Render, and Localhost)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Google Gemini AI safely
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper: Geocode city name to lat/lon
async function getCoordinates(cityName) {
  const cachedGeo = cache.get(`geo_${cityName.toLowerCase()}`);
  if (cachedGeo) return cachedGeo;

  const geoRes = await axios.get(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );

  if (!geoRes.data.results || geoRes.data.results.length === 0) {
    throw new Error(`City '${cityName}' not found.`);
  }

  const location = geoRes.data.results[0];
  const result = {
    lat: location.latitude,
    lon: location.longitude,
    name: `${location.name}, ${location.country || ''}`.trim()
  };

  cache.set(`geo_${cityName.toLowerCase()}`, result);
  return result;
}

// Health Checks
app.get('/api/health', (req, res) => res.json({ status: 'VayuShield Backend Active' }));
app.get('/', (req, res) => res.json({ status: 'VayuShield Backend Active' }));

// Environmental Data Endpoint
app.get('/api/environmental-data', async (req, res, next) => {
  try {
    let { city, lat, lon } = req.query;
    let cityName = city || 'Delhi';

    // Force fresh lookup if city parameter is explicitly provided
    if (city || (!lat && !lon)) {
      const geo = await getCoordinates(cityName);
      lat = geo.lat;
      lon = geo.lon;
      cityName = geo.name;
    }

    // Cache using normalized city name instead of floating point lat/lon
    const cacheKey = `env_${cityName.toLowerCase().replace(/\s+/g, '')}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,uv_index`
    );

    const aqiRes = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10`
    );

    const responseData = {
      location: cityName,
      latitude: lat,
      longitude: lon,
      temperature: weatherRes.data.current.temperature_2m,
      apparent_temp: weatherRes.data.current.apparent_temperature,
      humidity: weatherRes.data.current.relative_humidity_2m,
      uv_index: weatherRes.data.current.uv_index,
      aqi: aqiRes.data.current.european_aqi,
      pm25: aqiRes.data.current.pm2_5,
      pm10: aqiRes.data.current.pm10,
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// Compare Locations Endpoint
app.get('/api/compare-locations', async (req, res, next) => {
  try {
    const cityA = req.query.origin || 'Delhi';
    const cityB = req.query.destination || 'Mumbai';

    const [geoA, geoB] = await Promise.all([getCoordinates(cityA), getCoordinates(cityB)]);

    const [aqiA, aqiB] = await Promise.all([
      axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${geoA.lat}&longitude=${geoA.lon}&current=european_aqi,pm2_5`),
      axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${geoB.lat}&longitude=${geoB.lon}&current=european_aqi,pm2_5`)
    ]);

    const dataA = { city: geoA.name, aqi: aqiA.data.current.european_aqi, pm25: aqiA.data.current.pm2_5 };
    const dataB = { city: geoB.name, aqi: aqiB.data.current.european_aqi, pm25: aqiB.data.current.pm2_5 };

    const saferCity = dataA.aqi <= dataB.aqi ? dataA.city : dataB.city;

    res.json({ origin: dataA, destination: dataB, safer_option: saferCity });
  } catch (error) {
    next(error);
  }
});

// 7-Day History Endpoint
app.get('/api/history', async (req, res, next) => {
  try {
    let { lat, lon, city } = req.query;
    let cityName = city || 'Delhi';

    if (city || (!lat && !lon)) {
      const geo = await getCoordinates(cityName);
      lat = geo.lat;
      lon = geo.lon;
      cityName = geo.name;
    }

    const historyRes = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&past_days=7&hourly=european_aqi,pm2_5,pm10`
    );

    res.json({
      city: cityName,
      timestamps: historyRes.data.hourly.time,
      aqi_trend: historyRes.data.hourly.european_aqi,
      pm25_trend: historyRes.data.hourly.pm2_5,
    });
  } catch (error) {
    next(error);
  }
});

// Gemini AI Advisory Endpoint
app.post('/api/advisory', async (req, res, next) => {
  try {
    if (!ai) {
      throw new Error("GEMINI_API_KEY is missing on server.");
    }

    const { profile, envData } = req.body || {};

    const prompt = `
    System: Medical environmental analyst for VayuShield.
    Location: ${envData?.location || 'Unknown'}
    User Profile: Age ${profile?.age || 30}, Condition: ${profile?.condition || 'None'}, Occupation: ${profile?.occupation || 'General'}.
    Live Data: Temp ${envData?.temperature || 28}°C, AQI ${envData?.aqi || 100}, PM2.5 ${envData?.pm25 || 35}, UV Index ${envData?.uv_index || 3}.

    Return strictly a JSON object:
    {
      "risk_score": <number 1-100>,
      "risk_level": "<Low | Moderate | High | Critical>",
      "headline": "<max 8 words alert>",
      "advisory": "<2 concise sentences detailing specific medical risk for their profile>",
      "precautions": ["<point 1>", "<point 2>", "<point 3>"],
      "safe_window": "<best 2-hour outdoor window today>"
    }
    `;

    // Correct SDK call structure for @google/genai
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini AI API Error:", error.message);
    // Fallback response if Gemini AI times out or key is missing
    res.json({
      risk_score: 85,
      risk_level: "High",
      headline: "Air Quality Alert for Sensitive Groups",
      advisory: "Particulate levels exceed safe thresholds for your health profile. Limit prolonged outdoor exposure.",
      precautions: ["Wear an N95 mask outdoors", "Keep emergency medication nearby", "Stay indoors during peak sunlight"],
      safe_window: "6:00 PM - 8:00 PM"
    });
  }
});

// Mock Route
app.get('/api/mock-advisory', (req, res) => {
  res.json({
    risk_score: 42,
    risk_level: "Moderate",
    headline: "Optimal Conditions with Mild UV Risk",
    advisory: "Air quality is within reasonable limits. Standard outdoors activity is safe with hydration.",
    precautions: ["Apply SPF 30+ sunscreen", "Stay hydrated", "Monitor evening air quality updates"],
    safe_window: "4:00 PM - 6:00 PM"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VayuShield Backend active on port ${PORT}`);
});

module.exports = app;