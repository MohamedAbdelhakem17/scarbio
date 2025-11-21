import { useEffect, useState } from 'react';

export default function TrafficCard({ targetCount }: { targetCount: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='mx-auto h-[350px] w-[280px] p-2'>
      <div className='relative h-full w-full'>
        <div className='custom-glass-border custom-glass-shadow relative h-full overflow-hidden rounded-[40px] bg-white/10 p-3 backdrop-blur-[10px]'>
          {/* Glow Layer */}
          <div className='absolute inset-0 opacity-20'>
            <div className='bg-gradient-radial animate-spin-slow absolute inset-0 from-white/30 to-transparent'></div>
          </div>

          {/* Content */}
          <div className='relative z-10'>
            <h2 className='mb-8 mt-2 text-center text-lg font-light tracking-wide text-white'>
              Potential traffic
            </h2>

            <div className='relative mx-auto flex h-[180px] w-[180px] items-center justify-center'>
              <div className='animate-ping-slow absolute inset-0 rounded-full border-[1.5px] border-white/30'></div>

              <svg className='absolute inset-0 h-full w-full -rotate-90 transform'>
                <circle
                  cx='90'
                  cy='90'
                  r='70'
                  fill='none'
                  stroke='rgba(255, 255, 255, 0.2)'
                  strokeWidth='8'
                  strokeDasharray='6 12'
                />
                <circle
                  cx='90'
                  cy='90'
                  r='70'
                  fill='none'
                  stroke='rgba(255, 255, 255, 0.7)'
                  strokeWidth='10'
                  strokeLinecap='round'
                  strokeDasharray='440'
                  strokeDashoffset='100'
                  className='animate-draw-circle drop-shadow-lg'
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                  }}
                />
              </svg>

              <div className='animate-fade-up relative text-center'>
                <span className='text-2xl font-bold tracking-wider text-white'>
                  {count.toLocaleString()}
                </span>
                <span className='animate-bounce-subtle ml-1 inline-block text-2xl text-red-400'>
                  ↑
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
        @keyframes draw-circle {
          from {
            stroke-dashoffset: 440;
          }
          to {
            stroke-dashoffset: 100;
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-draw-circle {
          animation: draw-circle 2s ease-out forwards;
        }
        .animate-fade-up {
          animation: fade-up 2s ease-out;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
        }
      `}</style>
    </div>
  );
}
