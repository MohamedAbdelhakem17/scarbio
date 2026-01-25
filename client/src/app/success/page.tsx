'use client';

import Load from '@/components/feature/file-scan-loading';
import GlassLoader from '@/components/feature/glass-loader';
import { analysisAction } from '@/lib/actions/analysis.action';
import { getCodeAction } from '@/lib/actions/get-code.action';
import { getSitesAction } from '@/lib/actions/get-sites.action';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ---------------- Success Modal ---------------- */
function SuccessModal({
  open,
  site,
  onClose,
  onAnalyze,
}: {
  open: boolean;
  site: string | null;
  onClose: () => void;
  onAnalyze: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className='w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl'
          >
            <h2 className='mb-2 text-2xl font-bold text-green-600'>
              ✅ Analysis Completed
            </h2>

            <p className='mb-6 text-gray-600'>
              Analysis file created successfully for
              <br />
              <span className='font-semibold'>{site}</span>
            </p>

            <div className='flex justify-center gap-4'>
              <button
                onClick={onClose}
                className='rounded-lg bg-gray-200 px-6 py-2 font-medium'
              >
                Close
              </button>

              <button
                onClick={onAnalyze}
                className='rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700'
              >
                Analyze ✓
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Page ---------------- */
export default function SuccessPage() {
  const router = useRouter();

  const [code, setCode] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any>(null);
  const [filename, setFileName] = useState<string | null>(null);

  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [analyzedSites, setAnalyzedSites] = useState<Record<string, boolean>>(
    {}
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  /* -------- Get code -------- */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const c = searchParams.get('code');
    setCode(c);
    setLoadingSites(false);
  }, []);

  /* -------- Get tokens + sites -------- */
  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      try {
        // Token
        const data = await getCodeAction(code);

        if (data.status !== 'success') return;

        setTokens(data.tokens);

        // Sites
        const sitesData = await getSitesAction(data.tokens);

        if (sitesData.status === 'success') {
          setSites(sitesData.sites);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [code]);

  /* -------- Analyze Site (API) -------- */
  const analyzeSite = async (url: string) => {
    if (!tokens || loadingUrl) return;

    setLoadingUrl(url);

    try {
      const data = await analysisAction({
        url,
        tokens,
        start_date: '2025-11-01',
        end_date: '2025-11-30',
      });

      if (data.success) {
        setAnalyzedSites(prev => ({ ...prev, [url]: true }));
        setSelectedSite(url);
        setFileName(data.filename);
        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUrl(null);
    }
  };

  /* -------- Final Analyze (Action) -------- */
  const handleSubmit = async () => {
    if (!filename) {
      alert('No analysis file found');
      return;
    }

    setIsUploading(true);

    try {
      const data = await analysisAction({ filename, action: 'analyze' });

      if (data.success) {
        sessionStorage.setItem('analysisResult', JSON.stringify(data));
        router.push('/result');
      } else {
        alert(data.message || 'Unknown error');
      }
    } catch (err: any) {
      alert(err.message || 'Server error');
    } finally {
      setIsUploading(false);
    }
  };

  /* -------- States -------- */
  if (loadingSites) return <GlassLoader />;

  if (!code) {
    return <p className='text-center'>Not logged in yet</p>;
  }

  /* -------- UI -------- */
  return (
    <div className='mx-auto max-w-3xl p-6'>
      {sites.length > 0 && (
        <div className='space-y-4'>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center text-4xl font-bold text-brand-medium'
          >
            Your Sites
          </motion.p>

          {sites.map((site, index) => {
            const url = site.siteUrl;
            const isLoading = loadingUrl === url;
            const isDone = analyzedSites[url];

            return (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => !isDone && !isLoading && analyzeSite(url)}
                className={`flex items-center justify-between rounded-xl border p-4 shadow-sm transition ${isDone ? 'bg-green-50' : 'bg-white hover:shadow-lg'} ${isLoading ? 'cursor-wait' : 'cursor-pointer'} `}
              >
                <span className='font-medium'>{url}</span>

                {isLoading && (
                  <span className='font-medium text-blue-600'>
                    Analyzing...
                  </span>
                )}

                {isDone && (
                  <span className='font-semibold text-green-600'>✔ Done</span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <SuccessModal
        open={modalOpen}
        site={selectedSite}
        onClose={() => setModalOpen(false)}
        onAnalyze={handleSubmit}
      />

      {isUploading && <Load />}
    </div>
  );
}
