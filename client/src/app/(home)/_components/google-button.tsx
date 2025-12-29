import { Button } from '@/components/ui/button';

export default function GoogleButton() {
  const login = () => {
    const params = {
      client_id:
        '816118067676-0ril5bauojsupkedd6jgok9t90628ts3.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:8080',
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

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      'GoogleAuth',
      `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=yes`
    );
  };

  return (
    <>
      <div className='my-4 flex items-center'>
        <hr className='flex-grow border-brand-base' />
        <span className='mx-2 text-xl font-bold uppercase text-brand-medium'>
          or
        </span>
        <hr className='flex-grow border-brand-base' />
      </div>
      <div>
        <Button
          type='button'
          onClick={login}
          className='mx-auto flex items-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100'
        >
          {/* Google SVG */}
          <svg
            width='20'
            height='20'
            viewBox='0 0 533.5 544.3'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill='#4285F4'
              d='M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.3h146.9c-6.3 34.2-25.2 63.3-53.6 82.8v68.7h86.4c50.6-46.6 80-115.3 80-196.4z'
            />
            <path
              fill='#34A853'
              d='M272 544.3c72.9 0 134.2-24.1 178.9-65.2l-86.4-68.7c-24.1 16.1-55.2 25.5-92.5 25.5-71.1 0-131.2-48-152.8-112.3H31.9v70.5c44.3 87.8 135.5 150.2 240.1 150.2z'
            />
            <path
              fill='#FBBC05'
              d='M119.2 324.6c-10.9-32.7-10.9-68 0-100.7v-70.5H31.9c-45.8 91.5-45.8 200.2 0 291.7l87.3-70.5z'
            />
            <path
              fill='#EA4335'
              d='M272 107.4c38.9-.6 76.4 14.1 104.7 41.7l78.3-78.3C406.2 24.8 344.9.7 272 0 167.4 0 76.2 62.4 31.9 150.2l87.3 70.5C140.8 155.4 200.9 107.4 272 107.4z'
            />
          </svg>
          Analyze with Google
        </Button>
      </div>
    </>
  );
}
