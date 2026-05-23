import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { MOCK_CATEGORIES } from '@/features/recipient-dashboard/data/mockRecipientDashboardData';
import { claimDonation } from '@/services/api/recipient';
import { ClaimDonationModal } from './ClaimDonationModal';
import { ClaimSuccessPopup } from './ClaimSuccessPopup';

export function DonationListCard({ data, onClaimed }) {
  const {
    storeName,
    foodName,
    portion,
    distance,
    expiry,
    foodType
  } = data;

  // Integrasi label kategori dengan data yang dipakai di dropdown
  const categoryLabel = data.categoryLabel || MOCK_CATEGORIES.find(c => c.value === foodType)?.label || foodType;

  const navigate = useNavigate();

  // State untuk dua popup terpisah
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Klaim donasi via API, lalu simpan ke localStorage untuk mock fallback
  const handleClaim = async () => {
    try {
      setClaiming(true);
      // Panggil API backend: POST /api/klaim/:donasi_id
      await claimDonation(data.id);

      // Simpan ke localStorage juga (untuk mock flow & halaman Handover)
      try {
        const stored = localStorage.getItem('surplusin_claimed_donations');
        const existing = stored ? JSON.parse(stored) : [];
        if (!existing.find((d) => d.id === data.id)) {
          existing.push(data);
        }
        localStorage.setItem('surplusin_claimed_donations', JSON.stringify(existing));
      } catch (e) {
        console.error('Gagal menyimpan klaim ke localStorage:', e);
      }

      setShowConfirm(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Gagal mengklaim donasi:', error);
      alert('Terjadi kesalahan saat mengklaim donasi. Silakan coba lagi.');
      setShowConfirm(false);
    } finally {
      setClaiming(false);
    }
  };

  // Konfigurasi warna & ikon berdasarkan tipe makanan
  const getConfig = (type) => {
    switch (type) {
      case 'makanan-siap-saji':
        return {
          bg: 'bg-[#ffd0b0]', // orange-200
          icon: '/recipient_retailer icon/basic-icon/piring.svg',
          pillBg: 'bg-[#f0fdf4]', // green-50
          pillText: 'text-[#166534]', // green-800
        };
      case 'jajanan-kue':
        return {
          bg: 'bg-[#bfdbfe]', // blue-200
          icon: '/recipient_retailer icon/basic-icon/kue.svg',
          pillBg: 'bg-[#f0fdf4]',
          pillText: 'text-[#166534]',
        };
      case 'roti-pastry':
        return {
          bg: 'bg-[#ffc5c4]', // red
          icon: '/recipient_retailer icon/basic-icon/pastry.svg',
          pillBg: 'bg-[#f0fdf4]',
          pillText: 'text-[#166534]',
        };
      default:
        return {
          bg: 'bg-[#e2e8f0]', // slate-200
          icon: '/recipient_retailer icon/basic-icon/box.svg',
          pillBg: 'bg-[#f0fdf4]',
          pillText: 'text-[#166534]',
        };
    }
  };

  const config = getConfig(foodType);

  return (<>
    <article
      className="flex max-w-[700px] gap-5 rounded-3xl border border-[#f1f5f9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ padding: '1rem', paddingLeft: '1rem' }}
    >
      {/* ── Left Column: Icon & Category ── */}
      <div className="flex w-[200px] shrink min-w-[120px] flex-col">
        {/* Main Box */}
        <div className={`flex h-[160px] w-full items-center justify-center rounded-2xl ${config.bg}`}>
          <img
            src={config.icon}
            alt={categoryLabel}
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain opacity-90"
          />
        </div>

        {/* Category Pill */}
        <div
          className={`flex min-h-[36px] w-full items-center justify-center rounded-xl px-2 py-1 text-center ${config.pillBg}`}
          style={{ marginTop: '1rem' }}
        >
          <span className={`font-[Manrope] text-[11px] sm:text-[13px] font-semibold uppercase tracking-wide ${config.pillText}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* ── Right Column: Details & Button ── */}
      <div className="flex flex-1 shrink-0 min-w-[280px] flex-col justify-between">
        {/* Header Texts */}
        <div>
          <h3 className="font-[Manrope] text-[22px] sm:text-[24px] font-bold tracking-tight leading-tight text-[#0f172a]">
            {storeName}
          </h3>
          <p className="mt-1 font-[Manrope] text-[15px] sm:text-[16px] text-text font-semibold">
            {foodName}
          </p>
        </div>

        {/* 3 Gray Detail Boxes */}
        <div className="mt-3 h-20 flex gap-2">
          {/* Jumlah */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#F3F3F6] py-2 px-1">
            <img
              src="/recipient_retailer icon/basic-icon/pan.svg"
              alt="jumlah"
              className="mb-1 h-[18px] w-[18px] opacity-100"
            />
            <span className="font-[Manrope] text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">
              Jumlah
            </span>
            <span className="mt-0.5 font-[Manrope] text-[14px] font-semibold text-[#0f172a]">
              {portion}
            </span>
          </div>

          {/* Jarak */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#F3F3F6] py-2 px-1">
            <img
              src="/recipient_retailer icon/basic-icon/location.svg"
              alt="jarak"
              className="mb-1 h-[18px] w-[18px] opacity-100"
            />
            <span className="font-[Manrope] text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">
              Jarak
            </span>
            <span className="mt-0.5 font-[Manrope] text-[14px] font-semibold text-[#0f172a]">
              {distance}
            </span>
          </div>

          {/* Kedaluwarsa */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#F3F3F6] py-2 px-1">
            <img
              src="/recipient_retailer icon/basic-icon/clock.svg"
              alt="kedaluwarsa"
              className="mb-1 h-[18px] w-[18px] opacity-100"
            />
            <span className="font-[Manrope] text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">
              Kedaluwarsa
            </span>
            <span className="mt-0.5 font-[Manrope] text-[14px] font-semibold text-[#0f172a]">
              {expiry}
            </span>
          </div>
        </div>

        {/* Ambil Button */}
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-4 h-11 w-full rounded-2xl bg-[#ff6600] py-[10px] font-[Manrope] text-[17px] font-semibold text-white transition-colors hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-[#ff7a00]/30 cursor-pointer"
        >
          Ambil
        </button>
      </div>
    </article>

    {/* ── Confirmation Modal ── */}
    <ClaimDonationModal
      donation={showConfirm ? data : null}
      isClaiming={claiming}
      onConfirm={handleClaim}
      onClose={() => setShowConfirm(false)}
    />

    {/* ── Success Popup ── */}
    {showSuccess && (
      <ClaimSuccessPopup
        onClose={() => {
          setShowSuccess(false);
          onClaimed?.();
          navigate(ROUTES.RECIPIENT.HANDOVER);
        }}
      />
    )}
  </>);
}
