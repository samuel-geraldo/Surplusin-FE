import { useEffect, useMemo, useState } from 'react';
import { Hourglass, MessageSquare, PackageCheck, Radio, Trash2, Truck } from 'lucide-react';
import { getRetailerActiveClaims, getRetailerErrorMessage } from '@/services/api/retailer';

function splitItems(value) {
  if (!value) return [];

  return value
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatClaimTime(value) {
  if (!value) return 'Baru saja';

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(date.getTime()) || diffMs < 60000) return 'Baru saja';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  return `${hours} jam lalu`;
}

function getPickupStatus(claim) {
  if (!claim) return 'waiting';

  const rawStatus = String(claim.status_penjemputan ?? claim.pickup_status ?? claim.status ?? '').toLowerCase();

  if (rawStatus.includes('tiba') || rawStatus.includes('arrived') || rawStatus.includes('diterima')) {
    return 'arrived';
  }

  if (rawStatus.includes('menuju') || rawStatus.includes('jalan') || rawStatus.includes('pickup') || rawStatus.includes('diklaim')) {
    return 'on_the_way';
  }

  return 'on_the_way';
}

const PICKUP_STATUS = {
  waiting: {
    title: 'Menunggu klaim dari penerima',
    subtitle: '',
    Icon: Hourglass,
    textClass: 'text-[#9a9a9a]',
    borderClass: 'border-transparent',
    shadowClass: '',
  },
  on_the_way: {
    title: 'Penerima sedang menuju lokasi',
    subtitlePrefix: 'dari',
    Icon: Truck,
    textClass: 'text-[#ff6600]',
    borderClass: 'border-[#ff6600]',
    shadowClass: 'shadow-[0_4px_16px_rgba(255,102,0,0.32)]',
  },
  arrived: {
    title: 'Penerima tiba di lokasi',
    subtitlePrefix: 'dari',
    Icon: Radio,
    textClass: 'text-[#059669]',
    borderClass: 'border-[#059669]',
    shadowClass: 'shadow-[0_4px_16px_rgba(5,150,105,0.28)]',
  },
};

function NotificationCard({ item, active, onDelete }) {
  return (
    <article
      className="relative rounded-2xl bg-white p-4 pr-12 transition-colors hover:bg-slate-50"
      style={{
        border: '1px solid #e2e8f0',
        borderLeft: active ? '4px solid #3b82f6' : '4px solid transparent',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <button
        type="button"
        aria-label="Hapus notifikasi"
        onClick={() => onDelete(item.id)}
        className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-[#64748b] transition-colors hover:bg-red-50 hover:text-red-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-normal"
      >
        <Trash2 className="size-4" />
      </button>
      <h3 className="text-[15px] font-bold text-[#0f172a]">{item.title}</h3>
      <p className="mt-2 text-[13px] leading-5 text-[#64748b]">{item.message}</p>
      <p className="mt-2 text-[12px] text-[#64748b]">{item.time}</p>
    </article>
  );
}

export default function RetailerHandoverPage() {
  const [claims, setClaims] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('surplusin_retailer_dismissed_notifications') ?? '[]');
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadClaims() {
      setIsLoading(true);
      setError('');

      try {
        const result = await getRetailerActiveClaims();
        if (!cancelled) setClaims(Array.isArray(result) ? result : []);
      } catch (err) {
        if (!cancelled) {
          setClaims([]);
          setError(getRetailerErrorMessage(err, 'Gagal memuat klaim aktif'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadClaims();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeClaim = claims[0] ?? null;
  const pickupStatus = PICKUP_STATUS[getPickupStatus(activeClaim)];
  const PickupIcon = pickupStatus.Icon;
  const preparationItems = splitItems(activeClaim?.item_detail);

  const notifications = useMemo(
    () =>
      claims
        .filter((claim) => !dismissedIds.includes(claim.id))
        .map((claim) => ({
          id: claim.id,
          title: 'Klaim Donasi!',
          message: `${claim.nama_instansi} baru saja mengklaim ${claim.jumlah} ${claim.satuan} ${claim.nama_donasi}.`,
          time: formatClaimTime(claim.claimed_at),
        })),
    [claims, dismissedIds],
  );

  function deleteNotification(id) {
    setDismissedIds((current) => {
      const next = [...new Set([...current, id])];
      localStorage.setItem('surplusin_retailer_dismissed_notifications', JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="mt-6 flex w-full flex-col gap-6 px-6 pt-4 sm:mt-8 sm:px-8 sm:pt-6 lg:mt-10 lg:px-12 lg:pt-8">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      <section className={`flex min-h-20 items-center gap-4 rounded-3xl border bg-white px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:px-7 ${pickupStatus.borderClass} ${pickupStatus.shadowClass}`}>
        <PickupIcon className={`size-10 shrink-0 sm:size-12 ${pickupStatus.textClass}`} strokeWidth={2.2} />
        <div className="min-w-0">
          <h2 className={`text-[20px] font-extrabold leading-tight sm:text-[26px] ${pickupStatus.textClass}`}>
            {pickupStatus.title}
          </h2>
          {activeClaim ? (
            <p className={`mt-1 text-[14px] font-medium sm:text-[16px] ${pickupStatus.textClass}`}>
              {pickupStatus.subtitlePrefix} {activeClaim.nama_instansi}
            </p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex w-full flex-col gap-6">
          <section
            className="rounded-3xl bg-white"
            style={{ padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
          >
            <div className="flex items-center gap-3">
              <PackageCheck className="size-[18px] text-[#0f172a]" />
              <h2 className="font-[Manrope] text-[15px] font-bold text-[#0f172a]">
                Daftar Persiapan Item
              </h2>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-[Manrope] text-[14px] font-semibold text-[#0f172a]">
                {activeClaim?.nama_donasi ?? 'Belum ada klaim aktif'}
              </h3>
              {activeClaim ? (
                <p className="text-[13px] text-[#1e293b]">
                  Jumlah: <span className="font-semibold">{activeClaim.jumlah} {activeClaim.satuan}</span>
                </p>
              ) : null}
            </div>

            {isLoading ? (
              <p className="mt-5 rounded-[10px] bg-[#f0f0f3] p-4 text-[#64748b]">
                Memuat data penyerahan...
              </p>
            ) : preparationItems.length > 0 ? (
              <ul className="mt-5 grid gap-2 rounded-[10px] bg-[#f0f0f3] p-4 sm:grid-cols-2">
                {preparationItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-[#1e293b]">
                    <span className="font-bold text-[#50c878]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-[10px] bg-[#f0f0f3] p-4 text-[#64748b]">
                Belum ada detail item untuk klaim ini.
              </p>
            )}

            <p className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 font-[Manrope] text-[13px] text-[#0f172a]">
              Pastikan semua item sudah dikemas sesuai standar kebersihan sebelum kurir/penerima tiba.
            </p>
          </section>

          <section
            className="rounded-3xl bg-white text-center"
            style={{ padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
          >
            <h2 className="font-[Manrope] text-[18px] font-extrabold text-[#0f172a]">Penerima Hari Ini</h2>
            <p className="mt-3 text-[14px] font-semibold text-black">
              {activeClaim?.nama_instansi ?? '-'}
            </p>
            {activeClaim?.alamat ? (
              <p className="mx-auto mt-2 max-w-[520px] text-[15px] text-[#64748b]">{activeClaim.alamat}</p>
            ) : null}
            <a
              href={activeClaim?.nomor_whatsapp ? `https://wa.me/${activeClaim.nomor_whatsapp.replace(/\D/g, '')}` : undefined}
              className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#50c878] px-5 text-[14px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50c878] aria-disabled:pointer-events-none aria-disabled:opacity-50"
              aria-disabled={!activeClaim?.nomor_whatsapp}
            >
              <MessageSquare className="size-5" strokeWidth={2} />
              Chat Penerima
            </a>
          </section>
        </div>

        <aside
          className="rounded-3xl bg-white"
          style={{ padding: '1.75rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
        >
          <h2 className="mb-5 text-center font-[Manrope] text-[18px] font-extrabold text-[#0f172a]">Pusat Notifikasi</h2>
          <div className="flex flex-col gap-3">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  item={notification}
                  active={index === 0}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <p className="rounded-2xl border border-[#e2e8f0] bg-white p-4 text-center font-[Manrope] text-[13px] text-[#64748b] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                Tidak ada notifikasi aktif.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
