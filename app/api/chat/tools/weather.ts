import { tool } from "ai";
import { z } from "zod";

const GetWeatherSchema = z.object({
  location: z.string(),
  unit: z.enum(["C", "F"]),
  temperature: z.number(),
  condition: z.string(),
  high: z.number(),
  low: z.number(),
  humidity: z.number(),
  windKph: z.number(),
  icon: z.string().optional(),
});

interface GeocodeItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  admin1?: string;
}

interface GeocodeResponse {
  results?: GeocodeItem[];
}

interface ForecastResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

async function geocodeLocation(location: string) {
  const coordMatch = location.trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (coordMatch) {
    const latitude = parseFloat(coordMatch[1]);
    const longitude = parseFloat(coordMatch[2]);
    return { latitude, longitude, name: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}` };
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = (await res.json()) as GeocodeResponse;
  const first = data?.results?.[0];
  if (!first) throw new Error(`Location not found: ${location}`);
  
  const nameParts = [first.name, first.admin1, first.country_code].filter(Boolean);
  return { latitude: first.latitude, longitude: first.longitude, name: nameParts.join(", ") };
}

function mapWeatherCode(code: number) {
  const map: Record<number, { condition: string; icon?: string }> = {
    0: { condition: "Clear sky", icon: "weather-sun" },
    1: { condition: "Mainly clear", icon: "weather-sun" },
    2: { condition: "Partly cloudy", icon: "weather-partly" },
    3: { condition: "Overcast", icon: "weather-cloud" },
    45: { condition: "Fog", icon: "weather-fog" },
    48: { condition: "Fog", icon: "weather-fog" },
    51: { condition: "Drizzle", icon: "weather-drizzle" },
    61: { condition: "Rain", icon: "weather-rain" },
    71: { condition: "Snow", icon: "weather-snow" },
    80: { condition: "Showers", icon: "weather-showers" },
    95: { condition: "Thunderstorm", icon: "weather-thunder" },
  };
  return map[code] || { condition: "Unknown" };
}

export const weatherTool = tool({
  name: "weather",
  description: "Get current weather for a location.",
  inputSchema: z.object({
    location: z.string().describe("City name, address or coordinates"),
    unit: z.enum(["C", "F"]).default("C"),
  }),
  outputSchema: GetWeatherSchema,
  execute: async ({ location, unit }: { location: string; unit: "C" | "F" }) => {
    const { latitude, longitude, name } = await geocodeLocation(location);
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"].join(","),
      daily: ["temperature_2m_max", "temperature_2m_min"].join(","),
      timezone: "auto",
      temperature_unit: unit === "F" ? "fahrenheit" : "celsius",
      wind_speed_unit: "kmh",
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API failed: ${res.status}`);
    const data = (await res.json()) as ForecastResponse;

    const weatherCode = Number(data.current.weather_code);
    const mapped = mapWeatherCode(weatherCode);

    return {
      location: name,
      unit,
      temperature: Math.round(Number(data.current.temperature_2m)),
      condition: mapped.condition,
      high: Math.round(Number(data.daily.temperature_2m_max[0])),
      low: Math.round(Number(data.daily.temperature_2m_min[0])),
      humidity: Math.max(0, Math.min(1, Number(data.current.relative_humidity_2m) / 100)),
      windKph: Math.round(Number(data.current.wind_speed_10m)),
      icon: mapped.icon,
    };
  },
});

