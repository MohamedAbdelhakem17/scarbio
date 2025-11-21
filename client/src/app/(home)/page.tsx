import AboutSection from './_components/about-section';
import ContactSection from './_components/contact-section';
import FeaturesSection from './_components/features-section';
import FileUploadForm from './_components/file-upload-form';
import OwnerSection from './_components/owner-section';

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className='relative mb-4 flex min-h-[80vh] items-center overflow-hidden md:mb-28'>
        {/* Gradient Background */}
        <div className='absolute inset-0 bg-gradient-to-r from-[#e7c0c7] via-[#b58db5] to-[#6f3a83]' />

        {/* Background Image — hidden on mobile */}
        <div
          className='absolute inset-0 hidden bg-cover bg-right-bottom bg-no-repeat md:block'
          style={{
            backgroundImage: "url('/assets/images/scarabio.png')",
            backgroundSize: '30%',
          }}
        />

        {/* Content Container */}
        <div className='container relative z-10 mx-auto flex flex-col-reverse items-center gap-y-4 px-4 py-4 md:flex-row md:py-16'>
          {/* Upload Card */}
          <FileUploadForm />

          {/* Text Section */}
          <div className='mt-5 text-center text-white md:mt-0 md:ps-28 md:text-left'>
            <h1 className='font-roboto text-3xl font-extrabold leading-tight md:text-7xl'>
              Optimize Your Website.
            </h1>
            <h2 className='font-roboto text-3xl font-extrabold leading-tight md:text-7xl'>
              Maximize Your Visibility.
            </h2>

            <p
              className='mt-4 text-lg md:text-2xl'
              style={{ letterSpacing: '.3px' }}
            >
              Unlock powerful insights to improve rankings and grow your online
              reach.
            </p>
          </div>
        </div>
      </section>

      <AboutSection />
      <FeaturesSection />
      <OwnerSection />
      {/* <BlogSection /> */}
      <ContactSection />
    </>
  );
}
