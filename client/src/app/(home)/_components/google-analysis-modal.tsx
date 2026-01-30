'use client';

import Load from '@/components/feature/file-scan-loading';
import { Button } from '@/components/ui/button';
import { useJobPolling } from '@/hooks/use-job-polling';
import { analysisAction } from '@/lib/actions/analysis.action';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Site {
  siteUrl: string;
  permissionLevel?: string;
}

interface GoogleAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: Site[];
  tokens: any;
}

export default function GoogleAnalysisModal({
  isOpen,
  onClose,
  sites,
  tokens,
}: GoogleAnalysisModalProps) {
  const router = useRouter();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [loadingSite, setLoadingSite] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [analysisOption, setAnalysisOption] = useState<'recommended' | 'all'>(
    'recommended'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Job polling hook
  const jobStatus = useJobPolling({
    jobId,
    interval: 60000, // Poll every 1 minute
    onCompleted: result => {
      setIsAnalyzing(false);
      setJobId(null);

      // Store result and navigate to result page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      router.push('/result');
      onClose();
    },
    onFailed: error => {
      setIsAnalyzing(false);
      setJobId(null);
      alert('Analysis failed: ' + (error?.message || error || 'Unknown error'));
    },
  });

  // Fetch data from Google Search Console
  const handleSiteSelect = async (siteUrl: string) => {
    if (!siteUrl) return;

    setSelectedSite(siteUrl);
    setLoadingSite(siteUrl);
    setFilename(null);

    try {
      // Calculate dates: end_date = today, start_date = 3 months ago
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const data = await analysisAction({
        url: siteUrl,
        tokens,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      });

      if (data.success && data.filename) {
        setFilename(data.filename);
        setRowCount(data.rowCount || data.count || 0);
      } else {
        alert('Failed to fetch data: ' + (data.message || 'Unknown error'));
        setSelectedSite(null);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
      setSelectedSite(null);
    } finally {
      setLoadingSite(null);
    }
  };

  // Analyze the file
  const handleAnalyze = async () => {
    if (!filename) return;

    setIsAnalyzing(true);

    try {
      const response = await analysisAction({
        filename,
        filterOption: analysisOption,
        action: 'analyze',
      });

      if (response.success && response.jobId) {
        // New behavior: Set jobId to start polling
        setJobId(response.jobId);
      } else if (response.success) {
        // Legacy behavior: Direct response (for backward compatibility)
        sessionStorage.setItem('analysisResult', JSON.stringify(response));
        router.push('/result');
        onClose();
        setIsAnalyzing(false);
      } else {
        alert('Error: ' + (response.message || 'Analysis failed'));
        setIsAnalyzing(false);
      }
    } catch (err: any) {
      alert('Analysis failed: ' + err.message);
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className='relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#f5e6f0] p-6 shadow-2xl'
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                type='button'
                className='absolute right-4 top-4 rounded-full p-1 text-gray-600 transition hover:bg-white/50'
              >
                <X size={24} />
              </button>

              {/* Title */}
              <h2 className='mb-4 text-2xl font-bold text-[#6f3a83]'>
                Select Your Website
              </h2>

              {/* Sites Select Dropdown */}
              <div className='mb-4'>
                <select
                  value={selectedSite || ''}
                  onChange={e => handleSiteSelect(e.target.value)}
                  disabled={!!loadingSite || !!filename}
                  className='w-full rounded-xl border-2 border-[#d4b5d4] bg-white/80 p-4 font-medium text-[#6f3a83] transition focus:border-[#8b5a9e] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60'
                >
                  <option value=''>-- Choose a website --</option>
                  {sites.map(site => (
                    <option key={site.siteUrl} value={site.siteUrl}>
                      {site.siteUrl}
                    </option>
                  ))}
                </select>

                {/* Loading/Status Indicator */}
                {loadingSite && (
                  <p className='mt-2 text-sm text-blue-600'>
                    Fetching data from Google Search Console...
                  </p>
                )}
                {selectedSite && filename && (
                  <div className='mt-2 space-y-1'>
                    <p className='text-sm text-green-600'>
                      ✓ Data fetched successfully
                    </p>
                    <p className='text-sm font-medium text-[#6f3a83]'>
                      {rowCount.toLocaleString()} rows | File: {filename}
                    </p>
                  </div>
                )}
              </div>

              {/* Analysis Options - Show after file is created */}
              {filename && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-4 rounded-xl bg-white/80 p-4 shadow-sm'
                >
                  <p className='mb-3 text-sm font-semibold text-[#6f3a83]'>
                    Analysis Options:
                  </p>
                  <div className='space-y-2'>
                    <label className='flex cursor-pointer items-start'>
                      <input
                        type='radio'
                        name='analysisOption'
                        value='recommended'
                        checked={analysisOption === 'recommended'}
                        onChange={() => setAnalysisOption('recommended')}
                        className='mr-2 mt-0.5 cursor-pointer accent-[#8b5a9e]'
                      />
                      <div>
                        <span className='text-sm font-medium text-[#6f3a83]'>
                          Recommended: Position 5-20 only
                        </span>
                        <span className='block text-xs opacity-70'>
                          (Best ROI)
                        </span>
                      </div>
                    </label>
                    <label className='flex cursor-pointer items-start'>
                      <input
                        type='radio'
                        name='analysisOption'
                        value='all'
                        checked={analysisOption === 'all'}
                        onChange={() => setAnalysisOption('all')}
                        className='mr-2 mt-0.5 cursor-pointer accent-[#8b5a9e]'
                      />
                      <div>
                        <span className='text-sm font-medium text-[#6f3a83]'>
                          All: Analyze all keywords
                        </span>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Analyze Button */}
              {filename && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-6'
                >
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className='w-full rounded-full bg-[#9b7da8] px-8 py-6 text-base font-medium text-white hover:bg-[#8b5a9e] disabled:opacity-50'
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Component */}
      {isAnalyzing && <Load rows={rowCount} />}
    </>
  );
}
