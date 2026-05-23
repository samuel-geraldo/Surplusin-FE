import { FaqAccordion, FaqHero, FaqSupportCard, faqItems } from '@/features/faq';

export default function FaqPage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <FaqHero />
      <section className="bg-white px-5 py-14 sm:px-8 lg:py-16">
        <div className="mx-auto max-w-[980px]">
          <FaqAccordion items={faqItems} />
        </div>
      </section>
      <FaqSupportCard />
    </div>
  );
}
