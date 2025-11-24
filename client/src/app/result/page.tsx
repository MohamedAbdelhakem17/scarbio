'use client';
import GlassLoader from '@/components/feature/glass-loader';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import OnPageBars from './_components/onpage-bars';
import ResultTable from './_components/result-table';
import TrafficCard from './_components/traffic-card';

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('analysisResult');
    if (saved) setResult(JSON.parse(saved));
  }, []);

  if (!result)
    return (
      <section className='flex h-screen w-full items-center justify-center bg-gradient-to-b from-[#833D7B] to-[#351932]'>
        <GlassLoader />
      </section>
    );

  return (
    <section className='flex w-full items-center justify-center bg-gradient-to-b from-[#833D7B] to-[#351932]'>
      <div className='container mx-auto p-5'>
        {/* ===== Bars Section ===== */}
        <div className='grid grid-cols-1 items-start gap-10 gap-x-20 lg:grid-cols-[auto,1fr]'>
          <TrafficCard targetCount={result.summary.total_traffic_opportunity} />
          <OnPageBars elements={result.summary.elements} />
        </div>

        {/* ===== Table ===== */}
        <ResultTable
          result={{
            onpageResults: result.onpageResults,
            keywordMapping: result.keywordMapping,
          }}
        />

        <div className='mt-6 flex justify-center'>
          <button className='custom-glass-shadow rounded-2xl bg-white/10 px-10 py-3 font-semibold text-white backdrop-blur-[10px] transition-all hover:bg-white/20'>
            <a
              href={`https://api.scarabio.com${result.downloadUrl}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex h-full w-full items-center gap-x-3'
            >
              Download
              <Download />
            </a>
          </button>
        </div>
      </div>
    </section>
  );
}
