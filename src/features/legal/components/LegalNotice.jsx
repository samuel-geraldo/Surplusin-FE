import { Mail } from 'lucide-react';
import { Button } from '@/components/ui';

export function LegalNotice() {
  return (
    <section className="bg-white px-5 pb-16 sm:px-8 lg:pb-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-[#f3f3f6] p-6 sm:p-8 md:flex-row md:items-center">
        <div className="flex min-w-0 gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-orange-light text-orange-dark">
            <Mail className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-text">Pertanyaan dokumen legal?</h2>
            <p className="mt-2 max-w-[560px] text-sm font-medium leading-relaxed text-text-muted sm:text-base">
              Hubungi info@surplusin.com untuk klarifikasi kebijakan, ketentuan, atau permintaan
              terkait data.
            </p>
          </div>
        </div>
        <a href="mailto:info@surplusin.com" className="shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-h-[48px] rounded-2xl px-6 text-sm"
          >
            Hubungi Kami
          </Button>
        </a>
      </div>
    </section>
  );
}
