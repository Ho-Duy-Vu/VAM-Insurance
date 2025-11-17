/**
 * Weather Routes
 * Integration with OpenWeatherMap API
 */

import { Env } from '../index';
import { jsonResponse } from '../middleware/cors';

interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  condition: string;
  description: string;
  wind_speed: number;
  clouds: number;
  rain_1h: number;
  rain_3h: number;
  visibility: number;
  fetched_at: string;
}

async function fetchWeatherData(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherData | null> {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`;
    const response = await fetch(url, { timeout: 10000 } as any);

    if (!response.ok) {
      console.error('OpenWeather API error:', response.status);
      return null;
    }

    const data = await response.json() as any;

    return {
      temperature: data.main?.temp || 0,
      feels_like: data.main?.feels_like || 0,
      humidity: data.main?.humidity || 0,
      pressure: data.main?.pressure || 0,
      condition: data.weather?.[0]?.main || '',
      description: data.weather?.[0]?.description || '',
      wind_speed: data.wind?.speed || 0,
      clouds: data.clouds?.all || 0,
      rain_1h: data.rain?.['1h'] || 0,
      rain_3h: data.rain?.['3h'] || 0,
      visibility: data.visibility || 0,
      fetched_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

function determineStatus(weather: WeatherData): string {
  const { rain_1h, rain_3h, wind_speed, condition } = weather;

  // Ngập lụt: Heavy rain (>50mm in 3h)
  if (rain_3h > 50) return 'ngập_lụt';

  // Cảnh báo bão: High wind speed (>20 m/s) or thunderstorm
  if (wind_speed > 20 || condition.toLowerCase() === 'thunderstorm') {
    return 'cảnh_báo_bão';
  }

  // Mưa lớn: Moderate rain (>10mm in 1h or >30mm in 3h)
  if (rain_1h > 10 || rain_3h > 30) return 'mưa_lớn';

  // Ổn định: Normal conditions
  return 'ổn_định';
}

export async function handleWeather(
  request: Request,
  env: Env,
  path: string,
  method: string
): Promise<Response> {
  // GET /weather/:lat/:lon
  const match = path.match(/^\/weather\/([0-9.-]+)\/([0-9.-]+)$/);
  
  if (match && method === 'GET') {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);

    if (isNaN(lat) || isNaN(lon)) {
      return jsonResponse(
        { error: 'Invalid coordinates' },
        400,
        request,
        env
      );
    }

    if (!env.OPENWEATHER_API_KEY) {
      return jsonResponse(
        { error: 'Weather service not configured' },
        503,
        request,
        env
      );
    }

    const weatherData = await fetchWeatherData(lat, lon, env.OPENWEATHER_API_KEY);

    if (!weatherData) {
      return jsonResponse(
        { error: 'Failed to fetch weather data' },
        500,
        request,
        env
      );
    }

    const status = determineStatus(weatherData);

    return jsonResponse(
      {
        location: { lat, lon },
        weather: weatherData,
        status,
        severity: status === 'ổn_định' ? 'Thấp' : status === 'mưa_lớn' ? 'Trung bình' : 'Cao',
      },
      200,
      request,
      env
    );
  }

  return jsonResponse({ error: 'Weather route not found' }, 404, request, env);
}
