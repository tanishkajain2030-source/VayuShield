import type {
  Persona,
  EnvironmentData,
  AdvisoryData,
  RiskData,
} from "../types";

export const personas: Persona[] = [
  {
    id: "runner",
    name: "Healthy Runner",
    icon: "🏃",
    age: 21,
    healthCondition: "None",
    occupation: "Student",
  },
  {
    id: "worker",
    name: "Outdoor Worker",
    icon: "🚚",
    age: 32,
    healthCondition: "None",
    occupation: "Outdoor Worker",
  },
  {
    id: "asthma",
    name: "Asthma Patient",
    icon: "🫁",
    age: 24,
    healthCondition: "Asthma",
    occupation: "Student",
  },
  {
    id: "senior",
    name: "Senior Citizen",
    icon: "👵",
    age: 68,
    healthCondition: "None",
    occupation: "Retired",
  },
];

export const environment: EnvironmentData = {
  city: "Lucknow",
  temperature: 29,
  humidity: 72,
  uvIndex: 6.2,
  aqi: 84,
  pm25: 42,
};

export const riskByPersona: Record<string, RiskData> = {
  runner: {
    score: 38,
    level: "MODERATE",
  },

  worker: {
    score: 61,
    level: "HIGH",
  },

  asthma: {
    score: 78,
    level: "HIGH",
  },

  senior: {
    score: 68,
    level: "HIGH",
  },
};

export const advisoryByPersona: Record<string, AdvisoryData> = {
  runner: {
    headline: "Outdoor activity is possible with caution.",
    advisory:
      "Air quality is moderate. A short outdoor workout is reasonable, but avoid prolonged high-intensity activity near busy roads.",
    precautions: [
      "Prefer lower-traffic routes",
      "Stay hydrated",
      "Reduce intense exercise if breathing feels uncomfortable",
    ],
  },

  worker: {
    headline: "Limit prolonged outdoor exposure.",
    advisory:
      "Your occupation increases your exposure time. Consider taking regular breaks indoors during periods of poorer air quality.",
    precautions: [
      "Take regular indoor breaks",
      "Avoid unnecessary exposure near traffic",
      "Stay hydrated throughout the day",
    ],
  },

  asthma: {
    headline: "Higher sensitivity detected.",
    advisory:
      "Current environmental conditions may pose greater respiratory stress for someone with asthma. Minimize prolonged outdoor exposure and follow your existing medical plan.",
    precautions: [
      "Reduce prolonged outdoor exposure",
      "Avoid heavy exertion outdoors",
      "Keep prescribed medication available",
    ],
  },

  senior: {
    headline: "Take extra precautions outdoors.",
    advisory:
      "Current conditions may be more stressful for older adults. Prefer shorter outdoor activities and monitor how you feel.",
    precautions: [
      "Prefer shorter outdoor activities",
      "Avoid peak exposure periods",
      "Stay hydrated",
    ],
  },
};
