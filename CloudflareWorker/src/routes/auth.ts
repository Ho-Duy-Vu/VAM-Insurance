/**
 * Authentication Routes
 * JWT-based user authentication
 */

import { Env } from '../index';
import { jsonResponse } from '../middleware/cors';

// JWT Helper (using Web Crypto API)
async function createJWT(payload: any, secret: string, expiresIn: number): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn * 60, // Convert minutes to seconds
  };

  const encoder = new TextEncoder();
  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(jwtPayload));
  const data = `${headerBase64}.${payloadBase64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${data}.${signatureBase64}`;
}

// Hash password using Web Crypto
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handleAuth(
  request: Request,
  env: Env,
  path: string,
  method: string
): Promise<Response> {
  // POST /auth/register
  if (path === '/auth/register' && method === 'POST') {
    try {
      const body = await request.json() as any;
      const { email, password, full_name } = body;

      if (!email || !password) {
        return jsonResponse(
          { error: 'Email and password are required' },
          400,
          request,
          env
        );
      }

      // Check if user exists
      const existingUser = await env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
      )
        .bind(email)
        .first();

      if (existingUser) {
        return jsonResponse(
          { error: 'User already exists' },
          409,
          request,
          env
        );
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const userId = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO users (id, email, password_hash, full_name, created_at) 
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(userId, email, passwordHash, full_name || null, new Date().toISOString())
        .run();

      // Create token
      const token = await createJWT(
        { user_id: userId, email },
        env.SECRET_KEY,
        parseInt(env.JWT_EXPIRE_MINUTES)
      );

      return jsonResponse(
        {
          access_token: token,
          token_type: 'bearer',
          user: { id: userId, email, full_name },
        },
        201,
        request,
        env
      );
    } catch (error) {
      return jsonResponse(
        { error: 'Registration failed', message: (error as Error).message },
        500,
        request,
        env
      );
    }
  }

  // POST /auth/login
  if (path === '/auth/login' && method === 'POST') {
    try {
      const body = await request.json() as any;
      const { email, password } = body;

      if (!email || !password) {
        return jsonResponse(
          { error: 'Email and password are required' },
          400,
          request,
          env
        );
      }

      // Find user
      const user = await env.DB.prepare(
        'SELECT id, email, password_hash, full_name FROM users WHERE email = ?'
      )
        .bind(email)
        .first() as any;

      if (!user) {
        return jsonResponse(
          { error: 'Invalid credentials' },
          401,
          request,
          env
        );
      }

      // Verify password
      const passwordHash = await hashPassword(password);
      if (passwordHash !== user.password_hash) {
        return jsonResponse(
          { error: 'Invalid credentials' },
          401,
          request,
          env
        );
      }

      // Create token
      const token = await createJWT(
        { user_id: user.id, email: user.email },
        env.SECRET_KEY,
        parseInt(env.JWT_EXPIRE_MINUTES)
      );

      return jsonResponse(
        {
          access_token: token,
          token_type: 'bearer',
          user: { id: user.id, email: user.email, full_name: user.full_name },
        },
        200,
        request,
        env
      );
    } catch (error) {
      return jsonResponse(
        { error: 'Login failed', message: (error as Error).message },
        500,
        request,
        env
      );
    }
  }

  // GET /auth/me
  if (path === '/auth/me' && method === 'GET') {
    // TODO: Implement JWT verification and user info retrieval
    return jsonResponse(
      { error: 'Not implemented yet' },
      501,
      request,
      env
    );
  }

  return jsonResponse({ error: 'Auth route not found' }, 404, request, env);
}
