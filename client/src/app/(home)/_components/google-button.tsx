'use client';

import { Button } from '@/components/ui/button';
import { getCodeAction } from '@/lib/actions/get-code.action';
import { getSitesAction } from '@/lib/actions/get-sites.action';
import { useEffect, useState } from 'react';
import GoogleAnalysisModal from './google-analysis-modal';

export default function GoogleLogin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sites, setSites] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for code in URL on component mount
  useEffect(() => {
    const checkForCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');

      console.log('[GOOGLE-BUTTON] Checking for OAuth code...');
      console.log('[GOOGLE-BUTTON] Code found:', code);

      if (code) {
        console.log('[GOOGLE-BUTTON] Starting OAuth flow...');
        setIsLoading(true);
        try {
          // Get tokens
          console.log('[GOOGLE-BUTTON] Getting tokens from code...');
          const data = await getCodeAction(code);
          console.log('[GOOGLE-BUTTON] Token response:', data);

          if (data.status === 'success' && data.tokens) {
            console.log('[GOOGLE-BUTTON] ✅ Tokens received');
            setTokens(data.tokens);

            // Get sites
            console.log('[GOOGLE-BUTTON] Fetching sites...');
            const sitesData = await getSitesAction(data.tokens);
            console.log('[GOOGLE-BUTTON] Sites response:', sitesData);

            if (sitesData.status === 'success' && sitesData.sites) {
              console.log(
                '[GOOGLE-BUTTON] ✅ Sites received:',
                sitesData.sites.length,
                'sites'
              );
              setSites(sitesData.sites);
              setIsModalOpen(true);

              // Clean URL
              window.history.replaceState({}, '', '/');
            } else {
              console.error(
                '[GOOGLE-BUTTON] ❌ Failed to get sites:',
                sitesData
              );
              alert('Failed to fetch sites from Google Search Console');
            }
          } else {
            console.error('[GOOGLE-BUTTON] ❌ Failed to get tokens:', data);
            alert('Failed to authenticate with Google');
          }
        } catch (err) {
          console.error('[GOOGLE-BUTTON] ❌ Exception:', err);
          alert('Failed to connect to Google Search Console');
        } finally {
          console.log('[GOOGLE-BUTTON] Finished OAuth flow');
          setIsLoading(false);
        }
      }
    };

    checkForCode();
  }, []);

  const login = () => {
    console.log('[GOOGLE-BUTTON] Login button clicked');
    console.log(
      '[GOOGLE-BUTTON] Redirect URI:',
      process.env.NEXT_PUBLIC_REDIRECT_URI
    );

    const params = {
      client_id:
        '816118067676-0ril5bauojsupkedd6jgok9t90628ts3.apps.googleusercontent.com',
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI as string,
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

    console.log('[GOOGLE-BUTTON] Redirecting to:', url);
    window.location.href = url;
  };

  console.log(
    '[GOOGLE-BUTTON] Current state - sites:',
    sites.length,
    'isModalOpen:',
    isModalOpen,
    'isLoading:',
    isLoading
  );

  return (
    <>
      <div className='flex justify-center'>
        <Button
          onClick={login}
          type='button'
          disabled={isLoading}
          className='flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50 disabled:opacity-50'
        >
          <img
            src='https://developers.google.com/identity/images/g-logo.png'
            alt='Google'
            className='h-5 w-5'
          />
          <span className='text-sm font-medium'>
            {isLoading ? 'Connecting...' : 'Connect with Google'}
          </span>
        </Button>
      </div>

      <GoogleAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sites={sites}
        tokens={tokens}
      />
    </>
  );
}
