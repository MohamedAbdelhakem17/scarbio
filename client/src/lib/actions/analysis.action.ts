'use server';

interface AnalysisParams {
  url?: string;
  tokens?: any;
  start_date?: string;
  end_date?: string;
  filename?: string;
  action?: 'create' | 'analyze';
}

export const analysisAction = async (params: AnalysisParams) => {
  const { url, tokens, start_date, end_date, filename, action } = params;

  const baseUrl = process.env.API_URL?.replace(/\/$/, '') || '';

  try {
    // Handle different actions: 'create' for site analysis, 'analyze' for file analysis
    if (action === 'analyze') {
      // Analyze existing file
      if (!filename) {
        return {
          success: false,
          message: 'Filename is required for analysis',
        };
      }

      const response = await fetch(`${baseUrl}/api/v1/analysis/analyze-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();
      return data;
    } else {
      // Create analysis data for a site
      if (!url || !tokens) {
        return {
          success: false,
          message: 'URL and tokens are required',
        };
      }

      const response = await fetch(`${baseUrl}/api/v1/analysis/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, tokens, start_date, end_date }),
      });

      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error in analysis action:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message:
        'Failed to process analysis. Make sure backend server is running.',
      details: errorMessage,
    };
  }
};
