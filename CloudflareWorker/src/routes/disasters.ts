/**
 * Disaster Locations Routes
 * Manage disaster-prone locations and weather monitoring
 */

import { Env } from '../index';
import { jsonResponse } from '../middleware/cors';

export async function handleDisasters(
  request: Request,
  env: Env,
  path: string,
  method: string
): Promise<Response> {
  // GET /disaster-locations - List all disaster locations
  if (path === '/disaster-locations' && method === 'GET') {
    try {
      const locations = await env.DB.prepare(
        `SELECT id, province, district, latitude, longitude, disaster_type, 
                status, severity, marker_color, weather_info, last_updated 
         FROM disaster_locations 
         ORDER BY province`
      ).all();

      return jsonResponse(locations.results || [], 200, request, env);
    } catch (error) {
      return jsonResponse(
        { error: 'Failed to fetch disaster locations' },
        500,
        request,
        env
      );
    }
  }

  // POST /disaster-locations - Create new location
  if (path === '/disaster-locations' && method === 'POST') {
    try {
      const body = await request.json() as any;
      const { province, district, latitude, longitude, disaster_type } = body;

      if (!province || !latitude || !longitude) {
        return jsonResponse(
          { error: 'Province, latitude, and longitude are required' },
          400,
          request,
          env
        );
      }

      const id = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO disaster_locations 
         (id, province, district, latitude, longitude, disaster_type, status, severity, marker_color, last_updated) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          province,
          district || null,
          latitude,
          longitude,
          disaster_type || 'unknown',
          'ổn_định',
          'Thấp',
          'green',
          new Date().toISOString()
        )
        .run();

      const location = await env.DB.prepare(
        'SELECT * FROM disaster_locations WHERE id = ?'
      )
        .bind(id)
        .first();

      return jsonResponse(location, 201, request, env);
    } catch (error) {
      return jsonResponse(
        { error: 'Failed to create location' },
        500,
        request,
        env
      );
    }
  }

  // GET /disaster-locations/:id - Get specific location
  const getMatch = path.match(/^\/disaster-locations\/([a-z0-9-]+)$/);
  if (getMatch && method === 'GET') {
    const locationId = getMatch[1];

    try {
      const location = await env.DB.prepare(
        'SELECT * FROM disaster_locations WHERE id = ?'
      )
        .bind(locationId)
        .first();

      if (!location) {
        return jsonResponse({ error: 'Location not found' }, 404, request, env);
      }

      return jsonResponse(location, 200, request, env);
    } catch (error) {
      return jsonResponse(
        { error: 'Failed to fetch location' },
        500,
        request,
        env
      );
    }
  }

  return jsonResponse({ error: 'Disaster route not found' }, 404, request, env);
}
