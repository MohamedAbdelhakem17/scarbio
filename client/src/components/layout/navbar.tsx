'use client';

import { Button } from '@/components/ui/button';
import { navigationLink } from '@/lib/constants/navigation.constant';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const buttonLabel =
    pathname === '/contact-us' ? 'Home' : navigationLink[0].label;
  const buttonHref = pathname === '/contact-us' ? '/' : navigationLink[0].href;

  return (
    <header className='fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-md'>
      <nav
        className='relative z-10 flex items-center justify-between gap-x-6 px-8 py-3 md:px-20'
        style={{
          backgroundImage: "url('/assets/images/navbg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Logo */}
        <Link href='/'>
          <Image
            src='/assets/images/logo.png'
            alt='Scarbio | Powerful SEO Platform'
            className='h-12 w-72 object-contain'
            width={260}
            height={54}
          />
        </Link>

        {/* Button */}
        <Button asChild variant={'glass'}>
          <Link
            href={buttonHref}
            className='flex items-center gap-2 font-semibold text-white'
          >
            {buttonLabel}
            <ChevronRight className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
