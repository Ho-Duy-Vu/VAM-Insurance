/**
 * VAM Insurance API - Cloudflare Worker
 * Serverless REST API with edge computing
 */

// Environment interface
export interface Env {
  // R2 Buckets
  DOCUMENTS: R2Bucket;
  IMAGES: R2Bucket;
  
  // D1 Database
  DB: D1Database;
  
  // KV Namespace
  CACHE: KVNamespace;
  
  // Secrets
  GEMINI_API_KEY: string;
  OPENWEATHER_API_KEY: string;
  SECRET_KEY: string;
  FRONTEND_URL: string;
  
  // Variables
  ENVIRONMENT: string;
  MAX_FILE_SIZE_MB: string;
  JWT_EXPIRE_MINUTES: string;
}

// Import route handlers
import { handleCORS, corsHeaders } from './middleware/cors';
import { handleHealth } from './routes/health';
import { handleAuth } from './routes/auth';
import { handleDocuments } from './routes/documents';
import { handleDisasters } from './routes/disasters';
import { handleInsurance } from './routes/insurance';
import { handleWeather } from './routes/weather';
import { handleGeoAnalyst } from './routes/geo-analyst';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleCORS(request, env);
    }

    try {
      // Route: Health Check
      if (path === '/' || path === '/health') {
        return handleHealth(request, env);
      }

      // Route: Authentication
      if (path.startsWith('/auth/')) {
        return handleAuth(request, env, path, method);
      }

      // Route: Documents
      if (path.startsWith('/documents')) {
        return handleDocuments(request, env, path, method);
      }

      // Route: Disaster Locations
      if (path.startsWith('/disaster-locations')) {
        return handleDisasters(request, env, path, method);
      }

      // Route: Insurance
      if (path.startsWith('/insurance')) {
        return handleInsurance(request, env, path, method);
      }

      // Route: Weather
      if (path.startsWith('/weather')) {
        return handleWeather(request, env, path, method);
      }

      // Route: Geo Analyst
      if (path.startsWith('/geo-analyst')) {
        return handleGeoAnalyst(request, env, path, method);
      }

      // 404 Not Found
      return new Response(
        JSON.stringify({ error: 'Route not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request, env),
          },
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(request, env),
          },
        }
      );
    }
  },
};
