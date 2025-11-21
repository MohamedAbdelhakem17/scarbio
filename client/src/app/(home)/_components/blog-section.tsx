'use client';

import SectionContent from '@/components/common/section-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function BlogSection() {
  const blogs = [
    {
      id: 1,
      title: 'How to Improve Your SEO Ranking in 2025',
      image: '/assets/images/blog.png',
    },
    {
      id: 2,
      title: 'Top 10 Tools Every Digital Marketer Should Use',
      image: '/assets/images/blog.png',
    },
    {
      id: 3,
      title: 'The Future of AI in Search Optimization',
      image: '/assets/images/blog.png',
    },
  ];

  return (
    <section className='py-16 text-center'>
      {/* Section Header */}
      <SectionContent className='mb-10'>
        {/* Title */}
        <SectionContent.Label className='text-center text-sm font-medium tracking-widest text-brand-base'>
          BLOG
        </SectionContent.Label>

        {/* Description */}
        <SectionContent.Description className='text-center text-3xl font-semibold text-gray-900'>
          Recent Blogs
        </SectionContent.Description>

        {/* Info */}
        <SectionContent.Info className='text-center text-gray-500'>
          Explore insights, trends, and practical guides from our SEO experts to
          help your business grow online.
        </SectionContent.Info>
      </SectionContent>

      {/* Blog Cards */}
      <div className='mx-auto grid max-w-6xl items-stretch justify-center gap-8 md:grid-cols-3'>
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
          >
            <Card className='h-96 overflow-hidden rounded-2xl border-0 shadow-lg transition-transform hover:scale-105 hover:shadow-xl'>
              <div className='relative h-full w-full'>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  className='h-full w-full object-cover'
                  fill
                />

                {/* Overlay with gradient */}
                <div
                  className='absolute inset-0 flex flex-col justify-end p-6 text-left'
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0, 0, 0, 0) 68.13%, #53244E 100%)',
                  }}
                >
                  <CardContent className='p-0'>
                    <h3 className='mb-2 text-xl font-semibold text-white'>
                      {blog.title}
                    </h3>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* See More Button */}
      <Button className='mt-10'>
        <a href='#' className='group'>
          See More
          <ChevronRight className='ms-2 inline-block size-9 transition-transform duration-300 group-hover:translate-x-1' />
        </a>
      </Button>
    </section>
  );
}
