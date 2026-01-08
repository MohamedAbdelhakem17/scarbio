import { Button } from '@/components/ui/button';

export default function GoogleLogin() {
  const login = () => {
    const params = {
      client_id:
        '816118067676-0ril5bauojsupkedd6jgok9t90628ts3.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:3000/success/',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/webmasters.readonly',
      ].join(' '),
    };

    const url =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      new URLSearchParams(params).toString();

    window.location.href = url;
  };

  return (
    <div className='mt-2 flex justify-center border-t-2 border-brand-soft py-3'>
      <Button
        onClick={login}
        type='button'
        className='flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50'
      >
        <img
          src='https://developers.google.com/identity/images/g-logo.png'
          alt='Google'
          className='h-5 w-5'
        />
        <span className='text-sm font-medium'>Analyze with Google</span>
      </Button>
    </div>
  );
}
