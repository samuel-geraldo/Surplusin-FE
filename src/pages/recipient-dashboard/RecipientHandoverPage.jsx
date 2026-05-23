import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

const MAPS_API_KEY = 'AIzaSyAxvkMdHwDpYBUi62RVVoO4O9SmG_AgPp0';

// Koordinat penerima (Panti Jenaka Sukarela – contoh)
const RECIPIENT_LAT = -6.2000;
const RECIPIENT_LNG = 106.8450;

// Mock notifikasi
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Tips!',
    message: 'Jangan lupa bawa tas belanja sendiri untuk mengurangi plastik.',
    time: 'Baru saja',
    isNew: true,
  },
  {
    id: 2,
    title: 'Tips!',
    message: 'Pastikan kamu datang tepat waktu agar makanan tetap segar.',
    time: '5 menit lalu',
    isNew: false,
  },
  {
    id: 3,
    title: 'Tips!',
    message: 'Konfirmasi kehadiran saat sudah sampai di lokasi penjemputan.',
    time: '10 menit lalu',
    isNew: false,
  },
];

export default function RecipientHandoverPage() {
  // Ambil data donasi yang diklaim dari localStorage
  const [claimedDonations, setClaimedDonations] = useState(() => {
    try {
      const stored = localStorage.getItem('surplusin_claimed_donations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeNotifs, setActiveNotifs] = useState({});

  const navigate = useNavigate();

  // Konfirmasi penjemputan — simpan ke riwayat lalu hapus dari claimed
  const handleConfirmPickup = (id) => {
    // Cari donasi yang dikonfirmasi
    const donation = claimedDonations.find((d) => d.id === id);

    // Simpan ke riwayat di localStorage
    if (donation) {
      try {
        const stored = localStorage.getItem('surplusin_history_donations');
        const history = stored ? JSON.parse(stored) : [];

        // Format tanggal hari ini
        const now = new Date();
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

        // Tambahkan ke riwayat
        history.push({
          id: donation.id,
          storeName: donation.storeName,
          location: donation.patokan || '-',
          foodName: donation.foodName,
          portion: donation.portion || '-',
          date: dateStr,
          donationCount: (donation.items || []).length || 1,
        });

        localStorage.setItem('surplusin_history_donations', JSON.stringify(history));
      } catch (e) {
        console.error('Gagal menyimpan riwayat:', e);
      }
    }

    // Hapus dari daftar claimed
    const updated = claimedDonations.filter((d) => d.id !== id);
    localStorage.setItem('surplusin_claimed_donations', JSON.stringify(updated));
    setClaimedDonations(updated);
  };

  // Jika belum ada donasi yang diklaim
  if (claimedDonations.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4"
        style={{ minHeight: '60vh', padding: '2rem' }}
      >
        <img
          src="/recipient_retailer icon/basic-icon/box.svg"
          alt="empty"
          style={{ width: 80, height: 80, opacity: 0.3 }}
        />
        <p className="font-[Manrope] text-[18px] font-semibold text-[#94a3b8]">
          Belum ada donasi yang diklaim
        </p>
        <p className="font-[Manrope] text-[14px] text-[#94a3b8]">
          Klaim donasi dari Dashboard untuk melihat detail penjemputan
        </p>
        <button
          onClick={() => navigate(ROUTES.RECIPIENT.DASHBOARD)}
          className="mt-2 font-[Manrope] font-bold text-white"
          style={{
            backgroundColor: '#ff7a00',
            borderRadius: '999px',
            padding: '12px 40px',
            fontSize: '15px',
          }}
        >
          Ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-8"
      style={{ padding: '2rem 2rem 4rem', marginTop: '1rem' }}
    >
      {claimedDonations.map((donation) => {
        const storeLat = donation.lat || RECIPIENT_LAT;
        const storeLng = donation.lng || RECIPIENT_LNG;

        // URL embed Google Maps
        const mapsEmbedUrl = `https://maps.google.com/maps?q=${storeLat},${storeLng}&z=16&output=embed`;
        const mapsOpenUrl = `https://www.google.com/maps/dir/${storeLat},${storeLng}/${RECIPIENT_LAT},${RECIPIENT_LNG}`;

        return (
          <div key={donation.id} className="flex gap-6" style={{ alignItems: 'flex-start' }}>
            {/* ════════════ LEFT: Donation Card ════════════ */}
            <article
              className="flex-1 rounded-3xl bg-white"
              style={{
                padding: '2rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                border: '1px solid #f1f5f9',
                minWidth: 0,
              }}
            >
              {/* ── Header: Badge + Info + Estimasi ── */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-2">
                  {/* Badge */}
                  <span
                    className="inline-block w-fit rounded-full font-[Manrope] font-bold uppercase"
                    style={{
                      backgroundColor: '#fed7aa',
                      color: '#c2410c',
                      padding: '6px 16px',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Siap Dijemput
                  </span>

                  {/* Food name */}
                  <h3
                    className="font-[Manrope] font-extrabold text-[#0f172a]"
                    style={{ fontSize: '22px', lineHeight: 1.3 }}
                  >
                    {donation.foodName}
                  </h3>

                  {/* Store name */}
                  <p
                    className="font-[Manrope] font-medium text-text"
                    style={{ fontSize: '18px' }}
                  >
                    {donation.storeName}
                  </p>

                  {/* Patokan */}
                  <p
                    className="font-[Manrope] text-[#64748b]"
                    style={{ fontSize: '13px' }}
                  >
                    Patokan: {donation.patokan || '-'}
                  </p>
                </div>

                {/* Estimasi box */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="font-[Manrope] font-bold uppercase tracking-widest text-text-muted"
                    style={{ fontSize: '10px' }}
                  >
                    Estimasi Penjemputan
                  </span>
                  <span
                    className="font-[Manrope] text-[#0f172a]"
                    style={{ fontSize: '16px' }}
                  >
                    {donation.estimasi || donation.expiry}
                  </span>
                </div>
              </div>

              {/* ── Google Maps Embed ── */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ marginTop: '1.5rem', height: 280, border: '1px solid #e2e8f0' }}
              >
                <iframe
                  title={`Peta ke ${donation.storeName}`}
                  src={mapsEmbedUrl}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Buka di Google Maps */}
                <a
                  href={mapsOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center gap-2 bg-white font-[Manrope] font-semibold text-[#15803d] transition-shadow hover:shadow-lg"
                  style={{
                    bottom: 16,
                    right: 16,
                    padding: '8px 16px',
                    borderRadius: 12,
                    fontSize: '13px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  }}
                >
                  <img
                    src="/recipient_retailer icon/basic-icon/location.svg"
                    alt="maps"
                    style={{ width: 16, height: 16 }}
                  />
                  Buka di Google Maps
                </a>
              </div>

              {/* ── Bottom Row: Daftar Item + Konfirmasi ── */}
              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                style={{ marginTop: '1.5rem' }}
              >
                {/* Daftar Item Donasi */}
                <div
                  className="rounded-2xl"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <img
                      src="/recipient_retailer icon/basic-icon/piring.svg"
                      alt="items"
                      style={{ width: 18, height: 18 }}
                    />
                    <h4
                      className="font-[Manrope] font-bold text-[#0f172a]"
                      style={{ fontSize: '15px' }}
                    >
                      Daftar Item Donasi
                    </h4>
                  </div>
                  <ul style={{ paddingLeft: '0.5rem' }}>
                    {(donation.items || []).map((item, idx) => (
                      <li
                        key={idx}
                        className="font-[Manrope] text-[#334155]"
                        style={{ fontSize: '14px', padding: '3px 0' }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Konfirmasi Penjemputan */}
                <div
                  className="flex flex-col items-center justify-center rounded-2xl text-center"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <img
                      src="/recipient_retailer icon/basic-icon/location.svg"
                      alt="konfirmasi"
                      style={{ width: 18, height: 18 }}
                    />
                    <h4
                      className="font-[Manrope] font-bold text-[#0f172a]"
                      style={{ fontSize: '15px' }}
                    >
                      Konfirmasi Penjemputan
                    </h4>
                  </div>
                  <p
                    className="font-[Manrope] text-[#64748b]"
                    style={{ fontSize: '13px', marginBottom: '1rem' }}
                  >
                    Beritahu Mitra bahwa Anda sudah sampai di lokasi penjemputan.
                  </p>
                  <button
                    onClick={() => handleConfirmPickup(donation.id)}
                    className="font-[Manrope] font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: '#ff6600',
                      borderRadius: '999px',
                      padding: '10px 32px',
                      fontSize: '14px',
                    }}
                  >
                    Tiba di Lokasi
                  </button>
                </div>
              </div>
            </article>

            {/* ════════════ RIGHT: Pusat Notifikasi + Chat Mitra ════════════ */}
            <aside
              className="hidden shrink-0 flex-col gap-0 xl:flex"
              style={{ width: 360 }}
            >
              {/* ── Pusat Notifikasi Card ── */}
              <div
                className="flex flex-col rounded-3xl bg-white"
                style={{
                  padding: '1.75rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                }}
              >
                <h3
                  className="mb-5 text-center font-[Manrope] font-extrabold text-[#0f172a]"
                  style={{ fontSize: '18px' }}
                >
                  Pusat Notifikasi
                </h3>

                {/* Notification items */}
                <div className="flex flex-col gap-3">
                  {MOCK_NOTIFICATIONS.map((notif) => {
                    const isActive = (activeNotifs[donation.id] || MOCK_NOTIFICATIONS[0].id) === notif.id;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => setActiveNotifs(prev => ({ ...prev, [donation.id]: notif.id }))}
                        className="rounded-2xl bg-white cursor-pointer transition-colors hover:bg-slate-50"
                        style={{
                          padding: '1rem',
                          border: '1px solid #e2e8f0',
                          borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        <p
                          className="font-[Manrope] font-bold text-[#0f172a]"
                          style={{ fontSize: '15px', marginBottom: '4px' }}
                        >
                          {notif.title}
                        </p>
                        <p
                          className="font-[Manrope] text-[#475569]"
                          style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '6px' }}
                        >
                          {notif.message}
                        </p>
                        <span
                          className="font-[Manrope] font-medium text-[#94a3b8]"
                          style={{ fontSize: '11px' }}
                        >
                          {notif.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Chat Mitra Button ── */}
              <button
                className="flex w-full items-center justify-center gap-3 font-[Manrope] font-bold text-white transition-opacity hover:opacity-90"
                style={{
                  marginTop: '1.25rem',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '999px',
                  padding: '13px 0',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.30)',
                }}
                onClick={() => {
                  alert(`Membuka chat dengan mitra: ${donation.storeName}`);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ width: 20, height: 20 }}
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
                Chat Mitra — {donation.storeName}
              </button>
            </aside>
          </div>
        );
      })}
    </div>
  );
}
