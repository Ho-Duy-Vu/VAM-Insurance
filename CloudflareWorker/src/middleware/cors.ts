/**
 * CORS Middleware
 * Handle cross-origin requests with dynamic origin validation
 */

import { Env } from '../index';

// Get allowed origins
export function getAllowedOrigins(env: Env): (string | RegExp)[] {
  const origins: (string | RegExp)[] = [
    // Production frontend
    env.FRONTEND_URL,
    
    // Vercel preview deployments
    /^https:\/\/vam-insurance-.*\.vercel\.app$/,
    
    // Vercel production
    /^https:\/\/.*\.vercel\.app$/,
  ];

  // Development origins
  if (env.ENVIRONMENT !== 'production') {
    origins.push(
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:5173',
    );
  }

  return origins;
}

// Check if origin is allowed
export function isOriginAllowed(origin: string, env: Env): boolean {
  const allowed = getAllowedOrigins(env);

  for (const allowedOrigin of allowed) {
    if (typeof allowedOrigin === 'string' && origin === allowedOrigin) {
      return true;
    }
    if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
      return true;
    }
  }

  return false;
}

// Get CORS headers
export function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = isOriginAllowed(origin, env) ? origin : env.FRONTEND_URL;

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Handle CORS preflight
export function handleCORS(request: Request, env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}

// JSON response helper with CORS
export function jsonResponse(
  data: any,
  status: number = 200,
  request: Request,
  env: Env
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(request, env),
    },
  });
}
