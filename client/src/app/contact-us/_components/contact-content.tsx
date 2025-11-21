import {
  SOCIAL_MEDIA_LINKS,
  USER_DATA,
} from '@/lib/constants/user-data.constant';
import { Mail } from 'lucide-react';
import Image from 'next/image';

export default function ContactContent() {
  return (
    <header className='space-y-4 p-4 sm:p-6 md:space-y-6 lg:space-y-8'>
      {/* Sub title */}
      <p className='text-sm font-semibold text-brand-base sm:text-base'>
        Quality
      </p>

      {/* Title */}
      <h1 className='py-2 text-4xl font-bold sm:text-5xl md:text-6xl'>
        Get in <span className='text-brand-base'>Touch</span>
      </h1>

      {/* Description */}
      <p className='text-inter text-base font-medium sm:text-lg'>
        We’d love to hear from You
      </p>

      {/* Contact Information */}
      <address className='space-y-3 py-4 not-italic sm:space-y-4'>
        {/* Email */}
        <a
          href={`mailto:${USER_DATA.email}`}
          className='flex items-center gap-2 text-black/80 transition-colors hover:text-gray-800 hover:underline'
        >
          <Mail size={18} />
          {USER_DATA.email}
        </a>
      </address>
      {/* Social Links */}
      <nav
        aria-label='Social media'
        className='flex flex-wrap items-center gap-3 sm:gap-4'
      >
        {SOCIAL_MEDIA_LINKS.map(({ label, href, contact }, index) => (
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            key={index}
            className='flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 sm:h-12 sm:w-12'
          >
            <Image
              width={28}
              height={28}
              src={contact}
              alt={label}
              className='object-contain'
            />
            <span className='sr-only'>{label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}

{
  /* Phone
        <p className='flex items-center gap-2 text-black/80'>
          <Phone size={18} />
          {USER_DATA.phone}
        </p>

        <p className='flex items-center gap-2 text-black/80'>
          <MapPin size={18} />
          {USER_DATA.address}
        </p>
      
      */
}
