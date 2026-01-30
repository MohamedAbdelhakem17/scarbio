'use server';

export const getCodeAction = async (code: string) => {
  console.log(
    '[GET-CODE-ACTION] Called with code:',
    code?.substring(0, 20) + '...'
  );

  if (!code) {
    console.error('[GET-CODE-ACTION] ❌ No code provided');
    return {
      status: 'error',
      message: 'Code is required',
    };
  }

  const baseUrl =
    process.env.API_URL?.replace(/\/$/, '') || 'https://api.scarabio.com';

  console.log('[GET-CODE-ACTION] API URL:', baseUrl);

  try {
    const url = `${baseUrl}/api/v1/analysis/oauth/callback?code=${code}`;
    console.log('[GET-CODE-ACTION] Fetching:', url);

    const response = await fetch(url);
    console.log('[GET-CODE-ACTION] Response status:', response.status);

    const data = await response.json();
    console.log('[GET-CODE-ACTION] Response data:', data);

    return data;
  } catch (error) {
    console.error('[GET-CODE-ACTION] ❌ Exception:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      message:
        'Failed to process OAuth callback. Make sure backend server is running.',
      details: errorMessage,
    };
  }
};
