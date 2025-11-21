'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactSection() {
  return (
    <section
      className='container relative mx-auto my-10 flex flex-col items-center justify-center gap-y-8 rounded-2xl p-8 text-center shadow-md md:my-16 md:max-w-7xl md:p-12'
      style={{
        backgroundImage: `
          linear-gradient(0deg, #D9D9D9, #D9D9D9),
          linear-gradient(
            177.28deg,
            rgba(145, 145, 145, 0.075) 2.39%,
            rgba(51, 47, 47, 0.105) 50.08%,
            rgba(209, 209, 209, 0.075) 97.76%
          ),
          url('/assets/images/contact.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Title motion */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true }}
        className='mb-4 max-w-2xl text-xl font-semibold text-brand-dark sm:text-2xl md:max-w-4xl md:text-4xl'
      >
        Our team is here to help you improve rankings and achieve your goals.
      </motion.h2>

      {/* Button motion */}
      <Button>
        <Link href='/contact-us' className='group'>
          Contact Us
          <ChevronRight className='ms-2 inline-block size-9 transition-transform duration-300 group-hover:translate-x-1' />
        </Link>
      </Button>
    </section>
  );
}
