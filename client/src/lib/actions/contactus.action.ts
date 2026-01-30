'use server';

import { REQUEST_HEADERS } from '@/lib/constants/request-headers.constant';
import { ContactUsType } from '@/lib/schemas/contact.schema';

export const contactUsAction = async (
  data: ContactUsType
): Promise<contactUsResponse> => {
  // API link
  const apiUrl = process.env.API_URL || 'https://api.scarabio.com';

  try {
    // Call Api
    const response = await fetch(`${apiUrl}/api/v1/contactus`, {
      method: 'POST',
      headers: {
        ...REQUEST_HEADERS,
      },
      body: JSON.stringify(data),
    });

    //  parse json response
    const payload = await response.json();

    // if error in response
    if (!response.ok) {
      return {
        status: 'error',
        message: payload.error || 'Unknown error',
      };
    }

    // Return data if succeed
    return {
      status: 'success',
      data: payload.data,
      message: payload.message || 'Contact submitted successfully',
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: err.message || 'Network error',
    };
  }
};
