import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="grid min-h-[calc(100svh-96px)] place-items-center bg-[#f7faf7] px-5 py-16 text-[#102316] sm:px-8">
      <div className="w-full max-w-[680px] text-center">
        <p className="text-[84px] font-extrabold leading-none tracking-normal text-green-dark sm:text-[124px]">
          404
        </p>
        <h1 className="mt-5 text-[32px] font-extrabold leading-tight tracking-normal sm:text-[44px]">
          Error
        </h1>
        <p className="mx-auto mt-4 max-w-[500px] text-base font-medium leading-7 text-[#64748b] sm:text-lg">
          Link mungkin sudah berubah, dihapus, atau alamatnya belum tepat.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            size="sm"
            className="min-h-[42px] w-full rounded-xl px-4 text-sm sm:w-auto"
            onClick={() => navigate(ROUTES.HOME)}
          >
            <Home className="size-4" aria-hidden="true" />
            Ke Beranda
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-[42px] w-full rounded-xl border-green-normal/30 px-4 text-sm sm:w-auto"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali
          </Button>
        </div>
      </div>
    </section>
  );
}
