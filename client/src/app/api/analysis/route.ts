import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, tokens, start_date, end_date, filename, action } = body;

    const baseUrl = process.env.API_URL?.replace(/\/$/, '') || '';

    // Handle different actions: 'create' for site analysis, 'analyze' for file analysis
    if (action === 'analyze') {
      // Analyze existing file
      if (!filename) {
        return NextResponse.json(
          { success: false, message: 'Filename is required for analysis' },
          { status: 400 }
        );
      }

      const response = await fetch(`${baseUrl}/api/v1/analysis/analyze-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Create analysis data for a site
      if (!url || !tokens) {
        return NextResponse.json(
          { success: false, message: 'URL and tokens are required' },
          { status: 400 }
        );
      }

      const response = await fetch(`${baseUrl}/api/v1/analysis/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, tokens, start_date, end_date }),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to process analysis. Make sure backend server is running.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
