export type Persona = {
  id: string;
  name: string;
  icon: string;
  age: number;
  healthCondition: string;
  occupation: string;
};

export type EnvironmentData = {
  city: string;
  temperature: number;
  humidity: number;
  uvIndex: number;
  aqi: number;
  pm25: number;
};

export type AdvisoryData = {
  headline: string;
  advisory: string;
  precautions: string[];
  safeWindow?: string;
};

export type RiskData = {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
};

export type HistoryData = {
  city: string;
  timestamps: string[];
  aqi_trend: number[];
  pm25_trend: number[];
};

export type LocationData = {
  city: string;
  aqi: number;
  pm25: number;
};

export type LocationComparisonData = {
  origin: LocationData;
  destination: LocationData;
  safer_option: string;
};