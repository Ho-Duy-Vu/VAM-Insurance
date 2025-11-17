/**
 * Health Check Route
 */

import { Env } from '../index';
import { jsonResponse } from '../middleware/cors';

export async function handleHealth(request: Request, env: Env): Promise<Response> {
  const health = {
    status: 'healthy',
    service: 'VAM Insurance API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT,
    features: {
      database: !!env.DB,
      storage: !!env.DOCUMENTS && !!env.IMAGES,
      cache: !!env.CACHE,
      ai: !!env.GEMINI_API_KEY,
      weather: !!env.OPENWEATHER_API_KEY,
    },
  };

  return jsonResponse(health, 200, request, env);
}
