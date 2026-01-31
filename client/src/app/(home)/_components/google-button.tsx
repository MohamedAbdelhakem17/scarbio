'use client';

import { Button } from '@/components/ui/button';
import { getCodeAction } from '@/lib/actions/get-code.action';
import { getSitesAction } from '@/lib/actions/get-sites.action';
import { getGoogleAuthUrlAction } from '@/lib/actions/google-auth.action';
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

      if (code) {
        setIsLoading(true);

        // Clean URL immediately to prevent code reuse
        window.history.replaceState({}, '', '/');

        try {
          // Get tokens
          const data = await getCodeAction(code);

          if (data.status === 'success' && data.tokens) {
            // Get sites
            const sitesData = await getSitesAction(data.tokens);

            if (sitesData.status === 'success' && sitesData.sites) {
              setTokens(data.tokens);
              setSites(sitesData.sites);
              setIsModalOpen(true);
            } else {
              const errorMsg =
                sitesData.message || sitesData.error || 'Failed to fetch sites';
              alert('Error: ' + errorMsg);
            }
          } else {
            const errorMsg = data.message || data.error || 'Unknown error';
            alert('Failed to authenticate with Google: ' + errorMsg);
          }
        } catch (err: any) {
          const errorMsg = err?.message || 'Connection failed';
          alert('Error: ' + errorMsg);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkForCode();
  }, []);

  const login = async () => {
    const { url } = await getGoogleAuthUrlAction();
    window.location.href = url;
  };

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
