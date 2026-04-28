import {
  Bell,
  CircleCheck,
  MapPin,
  MessageSquareText,
  Navigation,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui';
import {
  RecipientPageLayout,
  StatusBadge,
} from '@/features/recipient-dashboard/components';
import {
  handoverDonationItems,
  handoverNotifications,
} from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

export default function RecipientHandoverPage() {
  return (
    <RecipientPageLayout title="Detail Penjemputan">
      <section className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1.6fr_1fr]">
        <article className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <StatusBadge status="available" className="mb-2" />
              <h2 className="text-h4 font-bold text-text">Paket Nasi Box</h2>
              <p className="text-label text-text-muted">Catering Ibu Endang</p>
              <p className="text-caption text-text-muted">
                Patokan: Samping Alfamart, masuk ke pintu warna hijau.
              </p>
            </div>
            <div className="text-right">
              <p className="text-caption font-semibold uppercase text-text-muted">
                Estimasi penjemputan
              </p>
              <p className="text-body2 font-semibold text-text">30 Menit</p>
            </div>
          </div>

          <div className="mb-4 rounded-lg border border-border bg-slate-100 p-4">
            <div className="mb-3 h-[185px] rounded-md bg-[linear-gradient(120deg,#edf1f5_0%,#f8fafc_45%,#dce7f2_100%)] p-3">
              <div className="flex h-full items-center justify-center">
                <div className="relative h-full w-full">
                  <div className="absolute left-[12%] top-[23%] rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-text shadow">
                    Catering Ibu Endang
                  </div>
                  <MapPin className="absolute left-[20%] top-[35%] size-7 text-sky-500" />
                  <MapPin className="absolute right-[22%] top-[40%] size-7 text-blue-normal" />
                </div>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Kebayoran+Lama+Jakarta"
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 rounded-md bg-green-light px-3 py-2 text-label font-semibold text-green-dark"
            >
              <Navigation className="size-4" />
              Buka di Google Maps
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-100 p-3">
              <p className="mb-2 flex items-center gap-1 text-body2 font-semibold text-text">
                <Package className="size-4 text-blue-normal" />
                Daftar Item Donasi
              </p>
              <ul className="space-y-1 text-label text-text">
                {handoverDonationItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-slate-100 p-3">
              <p className="mb-2 flex items-center gap-1 text-body2 font-semibold text-text">
                <CircleCheck className="size-4 text-blue-normal" />
                Konfirmasi Penjemputan
              </p>
              <p className="mb-3 text-label text-text-muted">
                Beritahu mitra bahwa Anda sudah sampai di lokasi penjemputan.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full rounded-xl text-body2"
              >
                Tiba di Lokasi
              </Button>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-xl border border-[#b7c4d3] bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-center text-body2 font-bold text-text">
              Pusat Notifikasi
            </h3>
            <div className="space-y-3">
              {handoverNotifications.map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-white p-3 shadow-sm">
                  <p className="mb-1 flex items-center gap-1 text-body2 font-bold text-text">
                    <Bell className="size-4 text-blue-normal" />
                    {item.title}
                  </p>
                  <p className="text-label text-text-muted">{item.body}</p>
                  <p className="mt-1 text-caption text-text-muted">Baru saja</p>
                </div>
              ))}
            </div>
          </article>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-normal py-3 text-body2 font-bold text-white transition hover:bg-green-normal-hover"
          >
            <MessageSquareText className="size-4" />
            Chat Mitra
          </button>
        </aside>
      </section>
    </RecipientPageLayout>
  );
}
