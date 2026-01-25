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
        success: false,
        status: 'error',
        message: payload?.message || response.statusText || 'Upload failed',
      };
    }

    return payload;
  } catch (err: any) {
    return {
      success: false,
      status: 'error',
      message: err.message || 'An unexpected error occurred',
    };
  }
};
