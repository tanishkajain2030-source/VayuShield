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
};

export type RiskData = {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH";
};