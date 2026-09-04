const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'VayuShield Backend Active' });
});

// Open-Meteo Environmental Route
app.get('/api/environmental-data', async (req, res) => {
  try {
    const lat = req.query.lat || 28.6139;
    const lon = req.query.lon || 77.2090;

    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,uv_index`
    );

    const aqiRes = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10`
    );

    res.json({
      temperature: weatherRes.data.current.temperature_2m,
      apparent_temp: weatherRes.data.current.apparent_temperature,
      humidity: weatherRes.data.current.relative_humidity_2m,
      uv_index: weatherRes.data.current.uv_index,
      aqi: aqiRes.data.current.european_aqi,
      pm25: aqiRes.data.current.pm2_5,
      pm10: aqiRes.data.current.pm10,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch environmental metrics' });
  }
});

// Gemini Health Advisory Route
app.post('/api/advisory', async (req, res) => {
  const { profile, envData } = req.body;

  try {
    const prompt = `
    System: Expert medical environmental analyst for VayuShield.
    User Profile: Age ${profile?.age || 30}, Condition: ${profile?.condition || 'None'}, Occupation: ${profile?.occupation || 'General'}.
    Live Data: Temp ${envData?.temperature}°C, AQI ${envData?.aqi}, PM2.5 ${envData?.pm25}, UV Index ${envData?.uv_index}.

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
    res.json({
      risk_score: 88,
      risk_level: "Critical",
      headline: "Elevated PM2.5 & Thermal Stress Warning",
      advisory: "Personalized threshold exceeded due to high particulate levels.",
      precautions: ["Wear an N95 mask outdoors", "Keep emergency inhaler accessible", "Limit exposure 12 PM - 3 PM"],
      safe_window: "5:00 PM - 7:00 PM"
    });
  }
});

app.listen(PORT, () => {
  console.log(`VayuShield Backend running on port ${PORT}`);
});