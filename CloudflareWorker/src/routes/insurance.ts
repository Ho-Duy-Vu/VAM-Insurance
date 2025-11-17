/**
 * Insurance Routes (Stub)
 * Insurance packages and applications
 */

import { Env } from '../index';
import { jsonResponse } from '../middleware/cors';

export async function handleInsurance(
  request: Request,
  env: Env,
  path: string,
  method: string
): Promise<Response> {
  // Mock insurance packages
  if (path === '/insurance/packages' && method === 'GET') {
    const packages = [
      {
        id: '1',
        name: 'Bảo hiểm Thiên tai Cơ bản',
        price: 500000,
        coverage: 'Lũ lụt, bão, động đất',
        description: 'Gói bảo hiểm cơ bản cho thiên tai tự nhiên',
        features: ['Bồi thường tối đa 50 triệu', 'Hỗ trợ khẩn cấp 24/7'],
      },
      {
        id: '2',
        name: 'Bảo hiểm Thiên tai Nâng cao',
        price: 1200000,
        coverage: 'Toàn bộ thiên tai + hỏa hoạn',
        description: 'Bảo vệ toàn diện cho tài sản và gia đình',
        features: ['Bồi thường tối đa 200 triệu', 'Miễn thẩm định', 'Gia hạn tự động'],
      },
      {
        id: '3',
        name: 'Bảo hiểm Thiên tai Premium',
        price: 2500000,
        coverage: 'Mọi rủi ro + bảo hiểm sức khỏe',
        description: 'Gói cao cấp với quyền lợi tối ưu',
        features: ['Bồi thường không giới hạn', 'Hỗ trợ pháp lý', 'Ưu tiên xử lý'],
      },
    ];

    return jsonResponse(packages, 200, request, env);
  }

  // POST /insurance/applications - Create application
  if (path === '/insurance/applications' && method === 'POST') {
    try {
      const body = await request.json() as any;
      
      // TODO: Implement full application logic with DB storage
      const application = {
        id: crypto.randomUUID(),
        ...body,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      return jsonResponse(application, 201, request, env);
    } catch (error) {
      return jsonResponse(
        { error: 'Failed to create application' },
        500,
        request,
        env
      );
    }
  }

  return jsonResponse({ error: 'Insurance route not found' }, 404, request, env);
}
