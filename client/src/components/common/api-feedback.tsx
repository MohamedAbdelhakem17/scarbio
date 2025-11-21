import { CircleX } from 'lucide-react';

export default function ApiFeedback({
  massage,
}: {
  massage: string | undefined;
}) {
  if (!massage) return null;

  return (
    <div className='relative my-9 border border-red-600 bg-red-50 py-2 text-center text-red-600'>
      <CircleX
        strokeWidth={1}
        className='h-15 absolute left-1/2 top-0 z-30 w-5 -translate-x-2/4 -translate-y-2/4 fill-white'
      />
      <p>{massage}</p>
    </div>
  );
}
