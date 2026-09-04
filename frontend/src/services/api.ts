import type {
  AdvisoryData,
  EnvironmentData,
  Persona,
  RiskData,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

type BackendEnvironmentResponse = {
  temperature: number;
  apparent_temp: number;
  humidity: number;
  uv_index: number;
  aqi: number;
  pm25: number;
  pm10?: number;
};

type BackendAdvisoryResponse = {
  risk_score: number;
  risk_level: string;
  headline: string;
  advisory: string;
  precautions: string[];
  safe_window?: string;
};

export async function getEnvironmentalData(
  lat = 26.8467,
  lon = 80.9462,
  city = "Lucknow",
): Promise<EnvironmentData> {
  const response = await fetch(
    `${API_BASE_URL}/api/environmental-data?lat=${lat}&lon=${lon}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch environmental data");
  }

  const data: BackendEnvironmentResponse = await response.json();

  return {
    city,
    temperature: data.temperature,
    humidity: data.humidity,
    uvIndex: data.uv_index,
    aqi: data.aqi,
    pm25: data.pm25,
  };
}

export async function getAdvisory(
  persona: Persona,
  environment: EnvironmentData,
): Promise<{
  risk: RiskData;
  advisory: AdvisoryData;
}> {
  const response = await fetch(`${API_BASE_URL}/api/advisory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile: {
        age: persona.age,
        condition: persona.healthCondition,
        occupation: persona.occupation,
      },
      envData: {
        temperature: environment.temperature,
        aqi: environment.aqi,
        pm25: environment.pm25,
        uv_index: environment.uvIndex,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate health advisory");
  }

  const data: BackendAdvisoryResponse = await response.json();

  const normalizedLevel = data.risk_level.toUpperCase();

  const level: RiskData["level"] =
    normalizedLevel === "CRITICAL"
      ? "CRITICAL"
      : normalizedLevel === "HIGH"
        ? "HIGH"
        : normalizedLevel === "LOW"
          ? "LOW"
          : "MODERATE";

  return {
    risk: {
      score: data.risk_score,
      level,
    },
    advisory: {
      headline: data.headline,
      advisory: data.advisory,
      precautions: data.precautions,
      safeWindow: data.safe_window,
    },
  };
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    return response.ok;
  } catch {
    return false;
  }
}