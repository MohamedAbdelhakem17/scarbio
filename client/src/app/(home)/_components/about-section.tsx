'use client';

import SectionContent from '@/components/common/section-content';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className='relative my-10 bg-brand-light'>
      <div className='container mx-auto grid grid-cols-1 items-center gap-12 p-3 md:max-w-7xl md:grid-cols-2 md:p-0'>
        <motion.div
          className='order-1 flex justify-center md:order-2 md:-mt-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Image
            src='/assets/images/about.png'
            alt='About Scarbio'
            width={450}
            height={300}
            className='max-w-full object-contain'
          />
        </motion.div>

        {/* About content */}
        <SectionContent className='order-2 md:order-1'>
          {/* Heading */}
          <SectionContent.Label>About Scarbio</SectionContent.Label>

          {/* Info */}
          <SectionContent.Description>
            Turning SEO Data Into Real Growth
          </SectionContent.Description>

          {/* Description */}
          <SectionContent.Info>
            Scarbio is a powerful SEO platform built to help businesses of all
            sizes understand, optimize, and grow their online presence. With
            advanced analytics, keyword tracking, and competitor insights,
            Scarbio gives you everything you need to make data-driven decisions
            and achieve higher rankings with less effort.
          </SectionContent.Info>
        </SectionContent>
      </div>
    </section>
  );
}
