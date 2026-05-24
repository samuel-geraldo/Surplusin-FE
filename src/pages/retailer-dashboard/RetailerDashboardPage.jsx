import { useEffect, useState } from 'react';
import { Check, ChevronDown, Minus, Plus, Trash2, X, XCircle } from 'lucide-react';
import {
  createRetailerDonation,
  deleteRetailerDonation,
  getRetailerErrorMessage,
  getRetailerDonations,
} from '@/services/api/retailer';
import { cn } from '@/lib/utils';
import { apiClient } from '@/services/api';

const ICONS = {
  food: '/recipient_retailer icon/basic-icon/piring.svg',
  bread: '/recipient_retailer icon/basic-icon/pastry.svg',
  cake: '/recipient_retailer icon/basic-icon/kue.svg',
  box: '/recipient_retailer icon/basic-icon/box.svg',
  // Untuk summary cards — dipilih sesuai warna icon natural-nya
  nearbyPanti: '/recipient_retailer icon/basic-icon/logo panti.svg',   // biru #1F66F4
  nearbyYayasan: '/recipient_retailer icon/basic-icon/logo yayasan.svg', // orange #FF6600
};

const CATEGORY_OPTIONS = [
  { value: 'Roti & Pastry', label: 'PASTRY', icon: ICONS.bread },
  { value: 'Makanan Siap Saji', label: 'MAKANAN', icon: ICONS.food },
  { value: 'Jajanan & Kue', label: 'JAJANAN', icon: ICONS.cake },
];

const UNIT_OPTIONS = [
  { value: 'Porsi', label: 'Porsi' },
  { value: 'Paket', label: 'Paket' },
  { value: 'Pcs', label: 'Pcs' },
  { value: 'Kg', label: 'Kg' },
];

const emptyForm = {
  nama: '',
  kategori: 'Roti & Pastry',
  jumlah: 0,
  satuan: 'Kg',
  item_detail: '',
};

function getDonationIcon(kategori) {
  if (kategori === 'Roti & Pastry') return ICONS.bread;
  if (kategori === 'Jajanan & Kue') return ICONS.cake;
  return ICONS.food;
}

function getDonationBg(kategori) {
  if (kategori === 'Roti & Pastry') return '#ffc5c4';
  if (kategori === 'Jajanan & Kue') return '#bfdbfe';
  return '#ffd0b0';
}

function formatExpiry(value) {
  if (!value) return 'Exp: otomatis';

  const expired = new Date(value);
  const diffMs = expired.getTime() - Date.now();

  if (Number.isNaN(expired.getTime())) return 'Exp: otomatis';
  if (diffMs <= 0) return 'Expired';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `Exp: ${minutes} menit`;

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return `Exp: ${hours} jam ${restMinutes} menit`;
}

function StatusBadge({ status }) {
  const tone = {
    tersedia: 'bg-[#c9eed5] text-[#3c965a]',
    diklaim: 'bg-[#ffd0b0] text-[#ff6600]',
    diterima: 'bg-[#bad0fc] text-[#1f66f4]',
  }[status] ?? 'bg-[#c9eed5] text-[#3c965a]';

  const label = {
    tersedia: 'Tersedia',
    diklaim: 'Diklaim',
    diterima: 'Diterima',
  }[status] ?? 'Tersedia';

  return (
    <span className={cn('rounded-full px-4 py-1.5 text-sm font-semibold', tone)}>
      {label}
    </span>
  );
}

// Compact horizontal list row (sesuai gambar)
function DonationRow({ item, onDelete }) {
  const bg = getDonationBg(item.kategori);

  return (
    <article
      className="flex items-center gap-4 rounded-2xl border border-[#f1f5f9] bg-white px-4 py-3 transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)]"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
    >
      {/* Icon box */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: bg }}
      >
        <img
          src={getDonationIcon(item.kategori)}
          alt={item.kategori}
          className="h-7 w-7 object-contain"
        />
      </div>

      {/* Name + info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-[Manrope] text-[15px] font-bold text-[#0f172a]">
          {item.nama}
        </p>
        <p className="font-[Manrope] text-[13px] text-[#64748b]">
          {item.jumlah} {item.satuan} &mdash; {formatExpiry(item.expired_at)}
        </p>
      </div>

      {/* Status badge */}
      <StatusBadge status={item.status ?? 'tersedia'} />

      {item.status === 'tersedia' ? (
        <button
          type="button"
          aria-label="Hapus donasi"
          onClick={() => onDelete(item.id)}
          className="ml-2 grid size-8 shrink-0 place-items-center rounded-full text-[#94a3b8] transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      ) : null}
    </article>
  );
}

// Summary card sesuai gambar 3 (icon + jumlah + label + border colored)
function NearbySummaryCard({ icon, count, label, accentColor, isLoading }) {
  const colorMap = {
    blue: '#1F66F4',
    orange: '#FF6600',
    green: '#50C878',
  };
  const color = colorMap[accentColor] ?? colorMap.blue;

  return (
    <article
      className="relative flex min-h-[110px] sm:h-36 items-center gap-3 sm:gap-4 overflow-hidden rounded-2xl bg-white p-4 sm:px-6 sm:py-4"
      style={{
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
      }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.07] blur-xl"
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 ml-1 sm:ml-4"
      />

      {/* Text */}
      <div>
        {isLoading ? (
          <>
            <div className="mb-1.5 h-6 w-24 animate-pulse rounded-md bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-slate-100" />
          </>
        ) : (
          <>
            <p
              className="font-[Manrope] text-[22px] sm:text-[30px] font-extrabold leading-tight"
              style={{ color }}
            >
              {count}
            </p>
            <p className="font-[Manrope] text-[12px] sm:text-[16px] font-medium" style={{ color }}>
              {label}
            </p>
          </>
        )}
      </div>
    </article>
  );
}

function SurplusModal({ onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [resultState, setResultState] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  }

  function updateAmount(nextValue) {
    const nextAmount = Math.max(0, Number(nextValue) || 0);
    updateField('jumlah', nextAmount);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.nama.trim() || !Number(form.jumlah)) {
      setError('Nama donasi dan jumlah wajib diisi');
      return;
    }

    const ok = await onSubmit({
      nama: form.nama.trim(),
      kategori: form.kategori,
      jumlah: Number(form.jumlah),
      satuan: form.satuan,
      item_detail: form.item_detail.trim() || undefined,
    });

    setResultState(ok ? 'success' : 'failed');
    if (ok) {
      window.setTimeout(() => onClose(), 900);
    }
  }

  if (resultState) {
    const success = resultState === 'success';
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <section
          className={cn(
            'flex min-h-[190px] w-full max-w-[460px] flex-col items-center justify-center rounded-2xl px-8 py-8 text-center shadow-xl',
            success ? 'bg-[#c9f2d7]' : 'bg-[#ffc3c3]',
          )}
        >
          <div
            className={cn(
              'grid size-20 place-items-center rounded-full text-white',
              success ? 'bg-[#50c878]' : 'bg-[#ff4542]',
            )}
          >
            {success ? <Check className="size-12" strokeWidth={4} /> : <XCircle className="size-14" strokeWidth={3} />}
          </div>
          <h2 className="mt-6 text-[24px] font-bold leading-tight text-[#0f172a]">
            {success ? (
              <>
                Donasi berhasil
                <br />
                ditambahkan
              </>
            ) : (
              'Maaf, terjadi kesalahan'
            )}
          </h2>
        </section>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[520px] rounded-2xl bg-white px-8 py-8 shadow-xl sm:px-14 sm:py-9"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="w-full text-center text-[24px] font-bold text-[#0f172a]">
            Input Donasi Baru
          </h2>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-[#64748b] hover:bg-[#f1f5f9]"
          >
            <X className="size-5" />
          </button>
        </div>

        {error ? (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-normal">
            {error}
          </p>
        ) : null}

        <div className="mt-7 space-y-5">
          <div>
            <p className="mb-3 text-[16px] font-medium text-[#0f172a]">Pilih Kategori</p>
            <div className="flex flex-wrap gap-6">
              {CATEGORY_OPTIONS.map((option) => {
                const selected = form.kategori === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField('kategori', option.value)}
                    className={cn(
                      'flex size-[74px] flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 text-[11px] font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.14)] transition',
                      selected
                        ? 'border-[#50c878] bg-[#d9f8e4] text-[#50c878]'
                        : 'border-transparent bg-[#e9f6ee] text-[#7f7f7f]',
                    )}
                  >
                    <img src={option.icon} alt="" aria-hidden="true" className="size-6 opacity-70" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[16px] font-medium text-[#0f172a]">Jumlah Donasi</p>
            <div className="flex items-center gap-7">
              <div className="flex h-11 overflow-hidden rounded-[12px] border border-[#50c878] bg-[#d9f8e4]">
                <button
                  type="button"
                  onClick={() => updateAmount(form.jumlah - 1)}
                  className="grid w-11 place-items-center bg-white text-[#50c878]"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="size-5" />
                </button>
                <input
                  value={form.jumlah}
                  onChange={(event) => updateAmount(event.target.value)}
                  inputMode="numeric"
                  className="h-full w-14 bg-transparent text-center text-[16px] text-[#1e293b] outline-none"
                  aria-label="Jumlah donasi"
                />
                <button
                  type="button"
                  onClick={() => updateAmount(form.jumlah + 1)}
                  className="grid w-11 place-items-center bg-white text-[#50c878]"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="size-6" />
                </button>
              </div>
              <label className="relative">
                <select
                  value={form.satuan}
                  onChange={(event) => updateField('satuan', event.target.value)}
                  className="h-11 w-[92px] appearance-none rounded-[12px] border border-[#94a3b8] bg-white px-4 pr-9 text-[15px] text-[#1e293b] outline-none"
                  aria-label="Satuan donasi"
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#64748b]" />
              </label>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-[16px] font-medium text-[#0f172a]">Nama Donasi</span>
            <input
              value={form.nama}
              onChange={(event) => updateField('nama', event.target.value)}
              placeholder="Contoh: Paket Nasi Box"
              className="h-11 w-full rounded-[8px] border border-[#94a3b8] px-4 text-[14px] text-[#1e293b] outline-none placeholder:text-[#7f8aa3] focus:border-[#50c878]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[16px] font-medium text-[#0f172a]">Item Donasi</span>
            <input
              value={form.item_detail}
              onChange={(event) => updateField('item_detail', event.target.value)}
              placeholder="Contoh: Nasi + Ayam Goreng + Sayur Lodeh"
              className="h-11 w-full rounded-[8px] border border-[#94a3b8] px-4 text-[14px] text-[#1e293b] outline-none placeholder:text-[#7f8aa3] focus:border-[#50c878]"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-[14px] bg-[#ff6600] text-[16px] font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? 'Menyimpan...' : 'Donasikan Sekarang'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[16px] font-medium text-[#1e293b] transition-colors hover:text-[#ff6600]"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function RetailerDashboardPage() {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data untuk nearby penerima (summary cards)
  const [nearbyData, setNearbyData] = useState(null);
  const [isNearbyLoading, setIsNearbyLoading] = useState(true);

  async function loadDonations() {
    setIsLoading(true);
    setError('');

    try {
      const result = await getRetailerDonations();
      setDonations(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getRetailerErrorMessage(err, 'Gagal memuat donasi penyalur'));
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadNearby() {
    setIsNearbyLoading(true);
    try {
      const response = await apiClient.get('/penyalur/nearby');
      setNearbyData(response.data ?? {});
    } catch {
      setNearbyData({});
    } finally {
      setIsNearbyLoading(false);
    }
  }

  useEffect(() => {
    const t1 = window.setTimeout(loadDonations, 0);
    const t2 = window.setTimeout(loadNearby, 0);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  // Hitung totals dari nearby data {PantiAsuhan: 5, YayasanSosial: 3, ...}
  const nearbyPanti = nearbyData ? (nearbyData['Panti Asuhan'] ?? 0) + (nearbyData['Panti Jompo'] ?? 0) : 0;
  const nearbyYayasan = nearbyData ? (nearbyData['Yayasan Sosial'] ?? 0) + (nearbyData['Lainnya'] ?? 0) : 0;

  async function handleCreate(payload) {
    setIsSubmitting(true);

    try {
      await createRetailerDonation(payload);
      await loadDonations();
      return true;
    } catch (err) {
      setError(getRetailerErrorMessage(err, 'Gagal menyimpan surplus'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Hapus donasi ini?');
    if (!confirmed) return;

    try {
      await deleteRetailerDonation(id);
      await loadDonations();
    } catch (err) {
      setError(getRetailerErrorMessage(err, 'Gagal menghapus donasi'));
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 px-6 pb-10 sm:px-8 lg:px-12">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      {/* Summary Cards – Tersedia di sekitarmu (panti & yayasan) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-10">
        <NearbySummaryCard
          icon={ICONS.nearbyPanti}
          count={`${nearbyPanti} Panti`}
          label="Tersedia di sekitarmu"
          accentColor="blue"
          isLoading={isNearbyLoading}
        />
        <NearbySummaryCard
          icon={ICONS.nearbyYayasan}
          count={`${nearbyYayasan} Yayasan`}
          label="Tersedia di sekitarmu"
          accentColor="orange"
          isLoading={isNearbyLoading}
        />
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ff6600] px-5 text-[16px] font-bold text-white transition-colors hover:bg-[#e65c00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6600] sm:w-fit sm:px-7"
      >
        <Plus className="size-5" />
        Input Surplus Baru
      </button>

      <section className="flex flex-col gap-4 sm:gap-5">
        <h2 className="font-[Manrope] text-[22px] font-semibold text-text sm:text-[26px]">
          Monitor Donasi Aktif
        </h2>

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <p className="rounded-2xl bg-white px-5 py-8 text-center font-[Manrope] font-medium text-[#64748b] text-[13px] sm:text-[15px]">
              Memuat donasi...
            </p>
          ) : donations.length > 0 ? (
            donations.map((item) => (
              <DonationRow key={item.id} item={item} onDelete={handleDelete} />
            ))
          ) : (
            <p className="rounded-2xl bg-white px-5 py-8 text-center font-[Manrope] font-medium text-[#64748b] text-[13px] sm:text-[15px]">
              Belum ada surplus aktif.
            </p>
          )}
        </div>
      </section>

      {isModalOpen ? (
        <SurplusModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </div>
  );
}
