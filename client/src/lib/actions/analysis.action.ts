'use server';

interface AnalysisParams {
  url?: string;
  tokens?: any;
  start_date?: string;
  end_date?: string;
  filename?: string;
  filterOption?: 'recommended' | 'all';
  action?: 'create' | 'analyze';
}

interface JobStatusResponse {
  success: boolean;
  jobId?: string;
  status?: 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  error?: any;
  // Result fields when completed
  downloadUrl?: string;
  excelFile?: string;
  dataSource?: string;
  summary?: any;
  onpageResults?: any[];
  keywordMapping?: any[];
}

/**
 * Check job status by jobId
 */
export const checkJobStatus = async (
  jobId: string
): Promise<JobStatusResponse> => {
  const baseUrl =
    process.env.API_URL?.replace(/\/$/, '') || 'https://api.scarabio.com';

  console.log('[ACTION] checkJobStatus called with jobId:', jobId);
  console.log('[ACTION] API URL:', baseUrl);

  try {
    const url = `${baseUrl}/api/v1/analysis/job/${jobId}`;
    console.log('[ACTION] Fetching:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Disable caching for polling
    });

    console.log('[ACTION] Response status:', response.status);
    console.log('[ACTION] Response ok:', response.ok);

    const data = await response.json();
    console.log('[ACTION] Response data:', data);
    
    return data;
  } catch (error) {
    console.error('[ACTION] ❌ Error checking job status:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: 'Failed to check job status',
      error: errorMessage,
    };
  }
};

export const analysisAction = async (params: AnalysisParams) => {
  const { url, tokens, start_date, end_date, filename, filterOption, action } =
    params;

  const baseUrl =
    process.env.API_URL?.replace(/\/$/, '') || 'https://api.scarabio.com';

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
        body: JSON.stringify({ filename, filterOption: filterOption || 'all' }),
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
