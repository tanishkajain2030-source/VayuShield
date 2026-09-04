const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface EnvironmentData {
  temperature: number;
  apparent_temp: number;
  humidity: number;
  uv_index: number;
  aqi: number;
  pm25: number;
  pm10: number;
  city?: string;
}

export interface UserProfile {
  age: number;
  condition: string;
  occupation: string;
}

export interface AdvisoryResponse {
  risk_score: number;
  risk_level: string;
  headline: string;
  advisory: string;
  precautions: string[];
  safe_window: string;
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend is not responding");
  }

  return response.json();
}

export async function getEnvironmentalData(
  lat?: number,
  lon?: number
): Promise<EnvironmentData> {
  const params = new URLSearchParams();

  if (lat !== undefined) params.set("lat", String(lat));
  if (lon !== undefined) params.set("lon", String(lon));

  const query = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/api/environmental-data${query ? `?${query}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch environmental data");
  }

  return response.json();
}

export async function getAdvisory(
  profile: UserProfile,
  envData: EnvironmentData
): Promise<AdvisoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/advisory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile,
      envData,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to generate health advisory");
  }

  return response.json();
}