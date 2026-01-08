'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface LoadProps {
  rows?: number;
}

const brand = {
  light: 'rgba(26, 49, 117, 0.1)',
  soft: 'rgba(26, 49, 117, 0.25)',
  medium: 'rgba(26, 49, 117, 0.6)',
  base: '#1A3175',
  dark: 'rgba(26, 49, 117, 0.9)',
};

export const seoInsights: string[] = [
  'Log File Analysis is More Important Than Any Report Server log analysis reveals how Googlebot actually crawls your site, not how you imagine it does.',
  'JavaScript Rendering Has a Real Cost Google crawls JS pages in two phases: first it sees empty HTML, and second it sees the content. This delay means your new content might need more time to get indexed.',
  'Internal Link Equity Distribution Every page has limited "power" that it distributes across internal links. A page with 200 links distributes less power than a page with 20 links. This is why Mega Menus weaken important pages.',
  'Entity-Based SEO is the Future Google no longer understands words, it understands entities and their relationships. When you write about "Apple," Google determines whether you mean the company or the fruit from context and related entities.',
  'Information Gain Score Google measures whether your content adds new information compared to existing results. Rephrased duplicate content won\'t rank even if it\'s "longer" or "better written."',
  'Topical Authority is Stronger Than Domain Authority A DA 30 site specialized in your topic ranks better than a general DA 70 site. Google builds "maps" of specialized sites in each field.',
  'Link Neighborhood Affects You Links from sites surrounded by spam sites transfer "bad reputation" to you even if the site itself looks clean. Always check who links to the site that will link to you.',
  "Segmentation Reveals the Truth Averages lie. If traffic increased 20%, brand queries might have increased 50% while non-brand decreased 10%. Without segmenting data, you'll make wrong decisions.",
  'Leading vs Lagging Indicators Rankings and Traffic are results (Lagging). Monitor Impressions, CTR, and Indexed Pages as early indicators (Leading). A drop in Impressions today means a drop in Traffic weeks later.',
  "Faceted Navigation is E-commerce's Biggest Problem Every filter creates new URLs. A site with 1,000 products and 10 filters can produce millions of pages. The solution isn't just noindex, but determining which combinations have actual search value and indexing only those.",
  'Hreflang Implementation Rate Most sites implement hreflang incorrectly. The golden rule: every page must point to itself (self-referencing) and to all other versions. One mistake corrupts all signals.',
  'Content Pruning Elevates the Entire Site Deleting or merging weak content raises the site\'s average quality. Google calculates "site quality as a whole," not just individual pages. Sometimes deletion is better than optimization.',
  'User-Generated Content Signals Comments and reviews add Fresh Content without effort from you. But Google distinguishes between real and fake UGC. Very short or similar comments can hurt.',
  'Author E-E-A-T Has Become Independent Google builds profiles for writers across sites. A writer with reputation in a specific field transfers that reputation to any site they write for. This is why hiring real experts impacts SEO.',
  'Link Reclamation is Easier Than Building Many sites mention your brand without a link, or your old links have broken. Recovering these links is much easier than building new ones with the same power.',
  'Soft 404 Detection Pages that return status 200 but contain "no results" or "product unavailable" content. Google detects them and treats them as 404s, but you don\'t see them in your reports. Search Console shows them under Coverage.',
];

const Load = ({ rows = 15 }: LoadProps) => {
  const [progress, setProgress] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const [insightIndex, setInsightIndex] = useState(0);

  const totalTime = useMemo(() => rows * 5000, [rows]);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;

    document.body.style.overflow = 'hidden';

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      const percentage = Math.min((elapsed / totalTime) * 100, 100);
      setProgress(percentage);

      const row = Math.min(Math.ceil((elapsed / totalTime) * rows), rows);
      setCurrentRow(row);

      if (elapsed < totalTime) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = 'auto';
    };
  }, [rows, totalTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % seoInsights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-center justify-center'
      >
        <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className='relative w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl shadow-black/20 backdrop-blur-sm'
        >
          {/* Background Lights */}
          <div
            className='absolute -right-20 -top-20 h-40 w-40 rounded-full'
            style={{ backgroundColor: brand.light, filter: 'blur(80px)' }}
          />
          <div
            className='absolute -bottom-20 -left-20 h-40 w-40 rounded-full'
            style={{ backgroundColor: brand.soft, filter: 'blur(80px)' }}
          />

          <div className='relative flex flex-col items-center space-y-8'>
            {/* Lottie */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <DotLottieReact
                src='/document-checking-loader.json'
                loop
                autoplay
                className='w-96 object-contain'
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='text-2xl font-bold'
              style={{ color: brand.base }}
            >
              Analyzing Data
            </motion.h2>

            <div className='w-full space-y-4'>
              {/* Stats */}
              <div className='grid grid-cols-3 gap-4'>
                {/* Current Row */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='rounded-2xl p-4 text-center'
                  style={{
                    background: `linear-gradient(135deg, ${brand.light}, ${brand.soft})`,
                  }}
                >
                  <p className='text-sm' style={{ color: brand.medium }}>
                    Current Row
                  </p>

                  <AnimatePresence mode='wait'>
                    <motion.p
                      key={currentRow}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='text-3xl font-bold'
                      style={{ color: brand.base }}
                    >
                      {currentRow}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>

                {/* Total Rows */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='rounded-2xl p-4 text-center'
                  style={{
                    background: `linear-gradient(135deg, ${brand.light}80, ${brand.soft}80)`,
                  }}
                >
                  <p className='text-sm' style={{ color: brand.medium }}>
                    Total Rows
                  </p>
                  <p
                    className='text-3xl font-bold'
                    style={{ color: brand.base }}
                  >
                    {rows}
                  </p>
                </motion.div>

                {/* Progress */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='rounded-2xl p-4 text-center'
                  style={{
                    background: `linear-gradient(135deg, ${brand.light}50, ${brand.soft}50)`,
                  }}
                >
                  <p className='text-sm' style={{ color: brand.medium }}>
                    Progress
                  </p>
                  <div
                    className='text-3xl font-bold'
                    style={{ color: brand.base }}
                  >
                    {Math.floor(progress)}%
                  </div>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div
                className='relative overflow-hidden rounded-full p-1 shadow-inner'
                style={{ backgroundColor: brand.light }}
              >
                <div
                  className='relative h-6 overflow-hidden rounded-full'
                  style={{
                    background: `linear-gradient(to right, ${brand.light}, ${brand.soft})`,
                  }}
                >
                  <motion.div
                    className='h-full rounded-full shadow-lg'
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(to right, ${brand.base}, ${brand.medium}, ${brand.dark})`,
                    }}
                    transition={{ ease: 'linear' }}
                  >
                    <motion.div
                      className='absolute inset-0'
                      style={{
                        background:
                          'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                      }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </motion.div>

                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span
                      className='text-xs font-bold drop-shadow-sm'
                      style={{ color: brand.soft }}
                    >
                      {Math.floor(progress)}%
                    </span>
                  </div>
                </div>
              </div>

              <p
                className='text-center text-sm'
                style={{ color: brand.medium }}
              >
                Please wait while processing completes...
              </p>
            </div>

            {/* SEO Insights */}
            <AnimatePresence mode='wait'>
              <motion.p
                key={insightIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'linear' }}
                className='text-center text-sm font-medium'
                style={{ color: brand.medium }}
              >
                {seoInsights[insightIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Load;
