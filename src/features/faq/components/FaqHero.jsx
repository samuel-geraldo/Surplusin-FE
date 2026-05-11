import { HelpCircle } from 'lucide-react';

export function FaqHero() {
  return (
    <section className="bg-[#f3f3f6] px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[980px] text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-green-light-active text-green-dark">
          <HelpCircle className="size-8" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-extrabold uppercase text-green-dark">Pusat Bantuan</p>
        <h1 className="mt-4 text-[36px] font-extrabold leading-[1.1] text-text sm:text-[48px] lg:text-[56px]">
          Pertanyaan Umum SurplusIn
        </h1>
        <p className="mx-auto mt-5 max-w-[720px] text-base font-medium leading-relaxed text-text-muted sm:text-lg">
          Temukan jawaban tentang layanan, pendaftaran, kelayakan pangan, dan alur distribusi
          SurplusIn.
        </p>
      </div>
    </section>
  );
}
