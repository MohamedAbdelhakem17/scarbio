import ContactContent from './_components/contact-content';
import ContactForm from './_components/contact-form';

export default function ContactPage() {
  return (
    <section className='container mx-auto grid flex-1 grid-cols-1 items-center gap-3 py-6 md:grid-cols-2'>
      {/* Contact Content */}
      <ContactContent />

      {/* Contact Form */}
      <section aria-label='Contact form'>
        <ContactForm />
      </section>
    </section>
  );
}
