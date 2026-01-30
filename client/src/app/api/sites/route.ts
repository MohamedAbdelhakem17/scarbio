import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tokens } = await request.json();

    if (!tokens) {
      return NextResponse.json(
        { status: 'error', message: 'Tokens are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.API_URL?.replace(/\/$/, '') || '';
    const response = await fetch(`${baseUrl}/api/v1/analysis/sites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens }),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch sites. Make sure backend server is running.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
