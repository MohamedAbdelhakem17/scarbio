export default function GlassLoader() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div
        className='relative flex size-72 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow backdrop-blur-md'
        style={{
          boxShadow: '0 0 25px rgba(131,61,123,0.4)',
        }}
      >
        {/* rotating ring */}
        <div className='absolute inset-0 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-brand-medium border-t-brand-base'></div>

        {/* inner glowing dot */}
        <div
          className='size-24 rounded-full bg-brand-base shadow'
          style={{
            boxShadow: '0 0 10px rgba(131,61,123,1)',
          }}
        ></div>
      </div>
    </div>
  );
}
