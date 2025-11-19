import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * GET /api/admin/submissions - Get all submissions (admin only)
 * Proxies to: GET /api/v1/admin/submissions
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - No auth token provided' },
        { status: 401 }
      );
    }

    // Proxy request to backend
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/submissions`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend error:', error);

      // Pass through backend error status
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'Access denied - Admin role required' },
          { status: response.status }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
