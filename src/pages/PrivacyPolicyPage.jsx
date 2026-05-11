import { LegalAccordion, LegalHero, LegalNotice, privacyItems } from '@/features/legal';

export default function PrivacyPolicyPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <LegalHero
        eyebrow="Kebijakan Privasi"
        title="Kebijakan Privasi SurplusIn"
        description="Ringkasan cara SurplusIn mengelola data pengguna, organisasi, dan aktivitas layanan."
      />
      <section className="bg-white px-5 py-14 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-[980px]">
          <LegalAccordion items={privacyItems} />
        </div>
      </section>
      <LegalNotice />
    </div>
  );
}
