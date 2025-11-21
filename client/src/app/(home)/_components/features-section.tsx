'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  {
    title: 'Performance Analytics',
    description:
      'Track your website’s performance with detailed analytics — from keyword rankings and organic traffic to CTR and bounce rates — all in one dashboard.',
    icon: '/assets/icons/features1.svg',
  },
  {
    title: 'Global Insights',
    description:
      'Discover how your site performs in different regions. Get competitor benchmarks, audience demographics, and international SEO insights instantly.',
    icon: '/assets/icons/features2.svg',
  },
  {
    title: 'Real-time Tracking',
    description:
      'Monitor your keyword positions, backlinks, and site health in real time. Receive instant alerts for ranking drops, site errors, or traffic spikes.',
    icon: '/assets/icons/features3.svg',
  },
];

export default function FeaturesSection() {
  return (
    <section className='py-16 md:mb-10'>
      <div className='container mx-auto space-y-12 px-4 sm:px-6 md:max-w-7xl lg:px-8'>
        {/* Heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className='mx-auto max-w-3xl text-center text-3xl font-bold leading-snug text-brand-medium sm:text-4xl md:text-5xl'
        >
          Powerful SEO tools built to help you grow smarter, faster.
        </motion.p>

        {/* Features Grid */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3'>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
              viewport={{ once: true }}
            >
              {/* Item */}
              <Card className='flex flex-col items-center space-y-6 border border-brand-base/20 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
                {/* Image */}
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  className='mx-auto size-20 object-contain md:size-24'
                  width={80}
                  height={80}
                />
                {/* Title */}
                <h3 className='text-xl font-bold text-brand-base md:text-2xl'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='md:text-md text-base leading-relaxed text-gray-600'>
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
