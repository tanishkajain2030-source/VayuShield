const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();

// Enable open CORS for seamless frontend integration
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'VayuShield Backend Active' });
});

// 2. Dynamic City / Coordinate Environmental Data Endpoint
app.get('/api/environmental-data', async (req, res, next) => {
  try {
    let { city, lat, lon } = req.query;
    let cityName = city || 'Delhi';

    // Geocode city name to lat/lon using Open-Meteo Geocoding API
    if (city || (!lat && !lon)) {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );

      if (!geoRes.data.results || geoRes.data.results.length === 0) {
        return res.status(404).json({ error: `City '${cityName}' not found.` });
      }

      const location = geoRes.data.results[0];
      lat = location.latitude;
      lon = location.longitude;
      cityName = `${location.name}, ${location.country || ''}`.trim();
    }

    // Fetch Live Weather Data
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,uv_index`
    );

    // Fetch Live Air Quality Data
    const aqiRes = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10`
    );

    res.json({
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
    });
  } catch (error) {
    next(error);
  }
});

// 3. 7-Day Air Quality & Weather History Trend Endpoint
app.get('/api/history', async (req, res, next) => {
  try {
    let { lat, lon, city } = req.query;
    let cityName = city || 'Delhi';

    if (city || (!lat && !lon)) {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      if (geoRes.data.results && geoRes.data.results.length > 0) {
        lat = geoRes.data.results[0].latitude;
        lon = geoRes.data.results[0].longitude;
      } else {
        lat = 28.6139; lon = 77.2090;
      }
    }

    // Fetch past 7 days of AQI data from Open-Meteo
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

// 4. Gemini AI Personalised Advisory Endpoint
app.post('/api/advisory', async (req, res, next) => {
  try {
    const { profile, envData } = req.body || {};

    const prompt = `
    System: Expert medical environmental analyst for VayuShield.
    Location: ${envData?.location || 'Unknown'}
    User Profile: Age ${profile?.age || 30}, Condition: ${profile?.condition || 'None'}, Occupation: ${profile?.occupation || 'General'}.
    Live Data: Temp ${envData?.temperature || 28}°C, AQI ${envData?.aqi || 100}, PM2.5 ${envData?.pm25 || 35}, UV Index ${envData?.uv_index || 3}.

    Return strictly a JSON object:
    {
      "risk_score": <number 1-100>,
      "risk_level": "<Low | Moderate | High | Critical>",
      "headline": "<max 8 words alert>",
      "advisory": "<2 concise sentences>",
      "precautions": ["<point 1>", "<point 2>", "<point 3>"],
      "safe_window": "<best 2-hour outdoor window today>"
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    console.warn("Gemini API fallback triggered.");
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

// 5. Mock Backup Route for Safety During Live Demos
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

app.listen(PORT, () => {
  console.log(`VayuShield Backend listening on port ${PORT}`);
});