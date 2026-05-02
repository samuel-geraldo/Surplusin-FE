import { LegalAccordion, LegalHero, LegalNotice, termsItems } from '@/features/legal';

export default function TermsPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <LegalHero
        eyebrow="Syarat & Ketentuan"
        title="Syarat & Ketentuan SurplusIn"
        description="Panduan penggunaan layanan SurplusIn untuk akun, data, kelayakan pangan, dan proses distribusi."
      />
      <section className="bg-white px-5 py-14 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-[980px]">
          <LegalAccordion items={termsItems} />
        </div>
      </section>
      <LegalNotice />
    </div>
  );
}
