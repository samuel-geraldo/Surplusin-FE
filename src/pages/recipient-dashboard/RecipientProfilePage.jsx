import { Crosshair, House, PencilLine, Search } from 'lucide-react';
import { RecipientPageLayout } from '@/features/recipient-dashboard/components';

function ReadonlyField({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p className="mb-1 text-label text-text">{label}</p>
      <div className="rounded-md bg-[#d9f0e2] px-3 py-2 text-body2 text-[#295a42]">{value}</div>
    </div>
  );
}

export default function RecipientProfilePage() {
  return (
    <RecipientPageLayout title="Profil Instansi">
      <section className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-h4 font-bold text-text">
              <House className="size-5" />
              Informasi Dasar
            </h2>
            <button type="button" className="rounded-md p-1 text-text-muted hover:bg-slate-100">
              <PencilLine className="size-4" />
            </button>
          </div>

          <div className="space-y-3">
            <ReadonlyField label="Nama Panti/Yayasan" value="Panti Jenaka Sukarela" />
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadonlyField label="Kategori Usaha" value="Panti Asuhan" />
              <ReadonlyField label="Nomor Whatsapp" value="080987654321" />
            </div>
            <ReadonlyField
              label="Alamat Lengkap"
              value="Jl. Kesedihan No.321, Kebayoran Lama, Jakarta Selatan"
            />
            <ReadonlyField label="Patokan (Opsional)" value="Depan Indomaret" />
          </div>
        </article>

        <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <h2 className="mb-1 flex items-center gap-2 text-h4 font-bold text-text">
            <Crosshair className="size-5" />
            Pinpoint Lokasi
          </h2>
          <p className="mb-3 text-caption text-text-muted">
            Geser pin pada peta untuk menentukan titik koordinat lokasi Anda yang lebih akurat.
          </p>

          <label className="relative mb-3 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Cari alamat..."
              className="h-[42px] w-full rounded-lg border border-[#94a3b8] bg-white pl-10 pr-10 text-sm outline-none transition focus:border-blue-normal"
            />
            <Crosshair className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          </label>

          <div className="rounded-lg border border-border bg-[linear-gradient(120deg,#d6dadf_0%,#eef2f5_50%,#d9e3ef_100%)] p-4">
            <div className="relative h-[210px] rounded-md bg-[radial-gradient(circle_at_20%_30%,#b8bdc7_0,#dce3ea_40%,#e7edf3_100%)]">
              <div className="absolute left-[52%] top-[48%] size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-normal" />
              <div className="absolute left-[21%] top-[33%] size-6 rounded-full bg-purple-500/80" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-md bg-white/95 px-3 py-2 shadow-sm">
                <div>
                  <p className="text-[10px] uppercase text-text-muted">Koordinat saat ini</p>
                  <p className="text-label text-text">6°15'S, 106°48'E</p>
                </div>
                <button
                  type="button"
                  className="rounded-md bg-green-light px-3 py-1.5 text-label font-semibold text-green-dark"
                >
                  Auto-Detect
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </RecipientPageLayout>
  );
}
