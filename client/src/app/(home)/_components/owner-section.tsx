'use client';
import SectionContent from '@/components/common/section-content';
import { motion } from 'framer-motion';
import Image from 'next/image';
export default function OwnerSection() {
  return (
    <section className='relative my-10 bg-brand-light'>
      {/* Content */}
      <div className='container mx-auto grid grid-cols-1 items-center p-3 md:max-w-7xl md:grid-cols-3 md:gap-12 md:p-0'>
        {/* Image container */}
        <motion.div
          className='flex justify-center md:-mt-16'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Image
            src='/assets/images/owner.png'
            alt='About  Scarbio Owner'
            width={350}
            height={300}
            className='max-w-full rounded-br-lg rounded-tl-lg object-contain shadow-2xl'
          />
        </motion.div>
        {/* About content */}
        <SectionContent className='col-span-2 py-3 text-start'>
          {/* Heading */}
          <SectionContent.Label>About Owner</SectionContent.Label> {/* Info */}
          <SectionContent.Description>
            SEO Specialist
          </SectionContent.Description>
          {/* Description */}
          <SectionContent.Info>
            I am Mohamed Wahba. I work in digital marketing and specialize in
            search engine optimization. I have been working as an SEO specialist
            for more than 4 years. I have worked in many industries such as
            medicine, addiction treatment, online education, professional
            consulting, e-commerce, employment, and real estate.
          </SectionContent.Info>
        </SectionContent>
      </div>
    </section>
  );
}
