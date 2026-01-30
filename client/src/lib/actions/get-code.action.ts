'use server';

export const getCodeAction = async (code: string) => {
  if (!code) {
    return {
      status: 'error',
      message: 'Code is required',
    };
  }

  const baseUrl =
    process.env.API_URL?.replace(/\/$/, '') || 'https://api.scarabio.com';

  try {
    const url = `${baseUrl}/api/v1/analysis/oauth/callback?code=${code}`;

    const response = await fetch(url);

    const data = await response.json();

    return data;
  } catch (error) {
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
