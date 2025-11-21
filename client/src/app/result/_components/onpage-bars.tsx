import { useEffect, useState } from 'react';

interface ElementsType {
  [key: string]: {
    yes: number;
    no: number;
    yes_percentage: number;
  };
}

export default function OnPageBars({ elements }: { elements: ElementsType }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 150);
  }, []);

  const FIXED_HEIGHT = 220;

  return (
    <div className='custom-glass-border custom-glass-shadow relative overflow-hidden rounded-[40px] bg-white/10 p-3 backdrop-blur-[9.76px]'>
      <div className='mt-10 flex h-full w-full items-start'>
        {/* FLEX WRAP + JUSTIFY-BETWEEN */}
        <div className='flex w-full flex-wrap justify-center gap-6'>
          {Object.entries(elements).map(([name, stats], index) => {
            const total = stats.yes + stats.no || 1;
            const yesHeight = (stats.yes / total) * FIXED_HEIGHT;
            const noHeight = (stats.no / total) * FIXED_HEIGHT;

            return (
              <div
                key={name}
                className='flex min-w-[80px] max-w-[120px] flex-1 flex-col items-center'
              >
                <div className='flex h-52 w-full items-end justify-center gap-2'>
                  {/* YES BAR */}
                  <div
                    className='duration-[900ms] w-3.5 rounded-full transition-all'
                    style={{
                      height: animate ? `${yesHeight}px` : '0px',
                      transitionDelay: `${index * 120}ms`,
                      backgroundColor: '#CC8BC480',
                      boxShadow:
                        '-11.15px 10.39px 48px -12px rgba(255, 255, 255, 0.1), -1.87px -1.39px 12px -8px rgba(0, 0, 0, 0.1), inset 2.15px 2px 9.24px rgba(255, 255, 255, 0.14), inset 1.22px 1.13px 4.62px rgba(255, 255, 255, 0.14)',
                      backdropFilter: 'blur(7.58px)',
                    }}
                  />

                  {/* NO BAR */}
                  <div
                    className='duration-[900ms] w-3.5 rounded-full transition-all'
                    style={{
                      height: animate ? `${noHeight}px` : '0px',
                      transitionDelay: `${index * 120 + 80}ms`,
                      backgroundColor: '#FF7D7380',
                      boxShadow:
                        '-11.15px 10.39px 48px -12px rgba(255, 255, 255, 0.1), -1.87px -1.39px 12px -8px rgba(0, 0, 0, 0.1), inset 2.15px 2px 9.24px rgba(255, 255, 255, 0.14), inset 1.22px 1.13px 4.62px rgba(255, 255, 255, 0.14)',
                      backdropFilter: 'blur(7.58px)',
                    }}
                  />
                </div>

                <p className='mt-3 text-center text-sm font-semibold text-white'>
                  {name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className='mt-6 flex justify-center gap-6'>
        <div className='flex items-center gap-2'>
          <div className='h-3 w-3 rounded-full bg-[#CC8BC4]' />
          <span className='text-sm text-white'>Yes</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-3 w-3 rounded-full bg-[#FF7D73]' />
          <span className='text-sm text-white'>No</span>
        </div>
      </div>
    </div>
  );
}
