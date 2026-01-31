'use server';

export async function getGoogleAuthUrlAction() {
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3000/';

  const params = {
    client_id:
      '816118067676-0ril5bauojsupkedd6jgok9t90628ts3.apps.googleusercontent.com',
    redirect_uri: redirectUri,
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

  return { url };
}
