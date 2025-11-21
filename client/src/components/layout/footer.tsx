'use client';

import {
  SOCIAL_MEDIA_LINKS,
  USER_DATA,
} from '@/lib/constants/user-data.constant';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='bg-[rgba(60,60,60,1)] py-8 text-white'>
      <div className='container mx-auto px-4'>
        {/* Top */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='flex flex-col items-center justify-between gap-6 border-b border-gray-50/30 pb-10 pt-4 md:flex-row md:gap-0'
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src='/assets/images/footer-logo.png'
              alt='Scarbio | Powerful SEO Platform'
              height={50}
              width={250}
              className='mx-auto object-contain md:mx-0'
            />
          </motion.div>

          {/* Social media */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='flex items-center justify-center gap-x-5 md:justify-end'
          >
            {SOCIAL_MEDIA_LINKS.map(({ href, footer, label }, index) => (
              <motion.a
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                key={index}
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className='transition-transform'
              >
                {/* Image */}
                <Image
                  width={28}
                  height={28}
                  src={footer}
                  alt={label}
                  className='object-contain'
                />

                {/* Label */}
                <span className='sr-only'>{label}</span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='my-6 space-y-4 text-start text-sm'
        >
          {/* Email */}
          <a
            href={`mailto":${USER_DATA.email}`}
            className='flex items-center gap-2 transition-colors hover:text-gray-300 hover:underline'
          >
            {/* Icon */}
            <Mail size={18} />
            {/* Label */}
            {USER_DATA.email}
          </a>

          {/* Location */}
          {/* <p className='flex items-center gap-2 text-gray-200'>
            <MapPin size={18} />
            {USER_DATA.address}
          </p> */}
        </motion.div>
      </div>
    </footer>
  );
}
