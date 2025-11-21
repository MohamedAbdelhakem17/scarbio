import { contactUsAction } from '@/lib/actions/contactus.action';
import { ContactUsType } from '@/lib/schemas/contact.schema';
import { useMutation } from '@tanstack/react-query';

export default function useContactUs() {
  const {
    mutate: sendEmail,
    error,
    isPending,
  } = useMutation({
    mutationKey: ['contact-us'],

    mutationFn: async (data: ContactUsType) => {
      // save data in database and send email
      const payload: contactUsResponse = await contactUsAction(data);

      // If failed send Email
      if (!('data' in payload)) {
        throw new Error('Failed to send email');
      }

      // success case
      return payload;
    },
  });

  return { sendEmail, error, isPending };
}
