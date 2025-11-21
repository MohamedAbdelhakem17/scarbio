import { cn } from '@/lib/utils/cn';
import { HTMLMotionProps, motion } from 'framer-motion';

export default function SectionContent({
  className,
  ...props
}: HTMLMotionProps<'div'>): JSX.Element {
  return (
    <motion.div
      className={cn('py-1 text-center md:text-left', className)}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      viewport={{ once: true }}
      {...props}
    />
  );
}

SectionContent.Label = function Label({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return (
    <h3
      className={cn('text-md font-medium text-gray-500', className)}
      {...props}
    />
  );
};

SectionContent.Description = function Description({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element {
  return (
    <p
      className={cn(
        'pb-6 pt-3 text-3xl font-extrabold text-brand-medium md:text-4xl',
        className
      )}
      {...props}
    />
  );
};

SectionContent.Info = function Info({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element {
  return (
    <p
      className={cn(
        'text-lg leading-relaxed text-gray-700 md:pr-20',
        className
      )}
      {...props}
    />
  );
};
