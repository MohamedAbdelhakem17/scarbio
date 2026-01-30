import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { status: 'error', message: 'Code is required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.API_URL?.replace(/\/$/, '') || '';
    const response = await fetch(
      `${baseUrl}/api/v1/analysis/oauth/callback?code=${code}`
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in get-code route:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        message:
          'Failed to process OAuth callback. Make sure backend server is running.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
