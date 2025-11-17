/**
 * Documents Routes (Stub - requires R2 integration)
 * File upload and document processing
 */

import { Env } from '../index';
import { jsonResponse } from '../middleware/cors';

export async function handleDocuments(
  request: Request,
  env: Env,
  path: string,
  method: string
): Promise<Response> {
  // GET /documents - List all documents
  if (path === '/documents' && method === 'GET') {
    try {
      const documents = await env.DB.prepare(
        `SELECT id, filename, file_type, file_size, status, created_at, updated_at 
         FROM documents 
         ORDER BY created_at DESC 
         LIMIT 50`
      ).all();

      return jsonResponse(documents.results || [], 200, request, env);
    } catch (error) {
      return jsonResponse(
        { error: 'Failed to fetch documents' },
        500,
        request,
        env
      );
    }
  }

  // POST /documents/upload - Upload document (requires multipart/form-data handling)
  if (path === '/documents/upload' && method === 'POST') {
    return jsonResponse(
      {
        error: 'Document upload requires R2 storage configuration',
        message: 'This endpoint will be fully implemented after R2 bucket setup',
      },
      501,
      request,
      env
    );
  }

  // GET /documents/:id - Get document details
  const getMatch = path.match(/^\/documents\/([a-z0-9-]+)$/);
  if (getMatch && method === 'GET') {
    const docId = getMatch[1];
    
    try {
      const document = await env.DB.prepare(
        'SELECT * FROM documents WHERE id = ?'
      )
        .bind(docId)
        .first();

      if (!document) {
        return jsonResponse({ error: 'Document not found' }, 404, request, env);
      }

      return jsonResponse(document, 200, request, env);
    } catch (error) {
      return jsonResponse(
        { error: 'Failed to fetch document' },
        500,
        request,
        env
      );
    }
  }

  return jsonResponse({ error: 'Documents route not found' }, 404, request, env);
}
