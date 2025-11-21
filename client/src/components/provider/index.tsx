import { Toaster } from '@/components/ui/sonner';
import QueryProviders from './react-query.provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <main className='mt-12 md:mt-20'>
      <Toaster />
      <QueryProviders>{children}</QueryProviders>
    </main>
  );
}
