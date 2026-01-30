'use server';

export const getCodeAction = async (code: string) => {
  if (!code) {
    return {
      status: 'error',
      message: 'Code is required',
    };
  }

  const baseUrl = process.env.API_URL?.replace(/\/$/, '') || '';

  try {
    const response = await fetch(
      `${baseUrl}/api/v1/analysis/oauth/callback?code=${code}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error in get-code action:', error);
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
