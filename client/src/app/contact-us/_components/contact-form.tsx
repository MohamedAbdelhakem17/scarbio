'use client';

import { PhoneInput } from '@/app/contact-us/_components/phone-input';
import ApiFeedback from '@/components/common/api-feedback';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactUsSchema, ContactUsType } from '@/lib/schemas/contact.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, SendHorizontal } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useContactUs from './../_hooks/use-contact-us';

export default function ContactForm() {
  // Mutation
  const { sendEmail, isPending, error } = useContactUs();

  // Form and validation
  const form = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      message: '',
    },
    resolver: zodResolver(contactUsSchema),
  });

  // Functions
  const onSubmit: SubmitHandler<ContactUsType> = data => {
    sendEmail(data, {
      onSuccess: res => {
        toast.success(res.message, { duration: 1000 });
        setTimeout(() => {
          location.href = '/';
        }, 1200);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Something went wrong', {
          duration: 1000,
        });
      },
    });
  };

  // Variables
  const { errors, isValid, isSubmitted } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='0 col-span-full grid grid-cols-1 gap-6 rounded-md border p-5 shadow-sm backdrop:blur-2xl md:col-span-1 md:grid-cols-2'
      >
        {/* First name */}
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem className='col-span-full md:col-span-1'>
              {/* Label */}
              <FormLabel>First Name</FormLabel>

              {/* Input */}
              <FormControl>
                <Input
                  placeholder='Enter first name'
                  autoComplete='given-name'
                  {...field}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last name */}
        <FormField
          control={form.control}
          name='last_name'
          render={({ field }) => (
            <FormItem className='col-span-full md:col-span-1'>
              {/* Label */}
              <FormLabel>Last Name</FormLabel>

              {/* Input */}
              <FormControl>
                <Input
                  placeholder='Enter last name'
                  autoComplete='family-name'
                  {...field}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='col-span-full md:col-span-1'>
              {/* Label */}
              <FormLabel>Email</FormLabel>

              {/* Input */}
              <FormControl>
                <Input
                  type='email'
                  placeholder='Enter Email'
                  autoComplete='email'
                  {...field}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='col-span-full md:col-span-1'>
              {/* Label */}
              <FormLabel>Phone</FormLabel>

              {/* Input */}
              <FormControl>
                <PhoneInput
                  type='text'
                  placeholder='01012345678'
                  autoComplete='tel'
                  error={!!errors.phone}
                  {...field}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem className='col-span-full'>
              {/* Label */}
              <FormLabel>Message</FormLabel>

              {/* Input */}
              <FormControl>
                <Textarea
                  placeholder='Write your message...'
                  autoComplete='off'
                  className='resize-none'
                  rows={5}
                  {...field}
                />
              </FormControl>

              {/* Feedback */}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit action */}
        <Button
          type='submit'
          className='mt-4 w-60'
          disabled={(!isValid && isSubmitted) || isPending}
        >
          Send
          {isPending ? (
            <Loader className='ms-2 animate-spin' />
          ) : (
            <SendHorizontal className='ms-2' />
          )}
        </Button>

        <ApiFeedback massage={error?.message} />
      </form>
    </Form>
  );
}
