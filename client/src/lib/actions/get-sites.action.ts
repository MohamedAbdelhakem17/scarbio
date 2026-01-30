'use server';

export const getSitesAction = async (tokens: any) => {
  console.log('[GET-SITES-ACTION] Called with tokens:', tokens ? '✓' : '✗');

  if (!tokens) {
    console.error('[GET-SITES-ACTION] ❌ No tokens provided');
    return {
      status: 'error',
      message: 'Tokens are required',
    };
  }

  const baseUrl =
    process.env.API_URL?.replace(/\/$/, '') || 'https://api.scarabio.com';

  console.log('[GET-SITES-ACTION] API URL:', baseUrl);
  console.log('[GET-SITES-ACTION] Fetching sites...');

  try {
    const url = `${baseUrl}/api/v1/analysis/sites`;
    console.log('[GET-SITES-ACTION] POST to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens }),
    });

    console.log('[GET-SITES-ACTION] Response status:', response.status);
    console.log('[GET-SITES-ACTION] Response ok:', response.ok);

    const data = await response.json();
    console.log('[GET-SITES-ACTION] Response data:', data);

    return data;
  } catch (error) {
    console.error('[GET-SITES-ACTION] ❌ Exception:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      message: 'Failed to fetch sites. Make sure backend server is running.',
      details: errorMessage,
    };
  }
};
