'use server';

export const fileUploadAction = async (data: FormData) => {
  const apiUrl = process.env.API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/v1/analysis/analyze-file`, {
      method: 'POST',
      body: data,
    });

    const payload = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: response,
      };
    }

    return payload;
  } catch (err: any) {
    return err;
  }
};
