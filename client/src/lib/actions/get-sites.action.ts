'use server';

export const getSitesAction = async (tokens: any) => {
  if (!tokens) {
    return {
      status: 'error',
      message: 'Tokens are required',
    };
  }

  const baseUrl =
    process.env.API_URL?.replace(/\/$/, '') || 'https://api.scarabio.com';

  try {
    const url = `${baseUrl}/api/v1/analysis/sites`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokens }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      status: 'error',
      message: 'Failed to fetch sites. Make sure backend server is running.',
      details: errorMessage,
    };
  }
};
