import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { getActiveHandovers, updateClaimStatus, getRecipientProfile } from '@/services/api/recipient';

// Tips statis sebagai fallback ketika tidak ada klaim aktif
const TIPS_NOTIFICATIONS = [
  {
    id: 'tip-1',
    title: 'Tips!',
    message: 'Jangan lupa bawa tas belanja sendiri untuk mengurangi plastik.',
    time: '',
  },
  {
    id: 'tip-2',
    title: 'Tips!',
    message: 'Pastikan kamu datang tepat waktu agar makanan tetap segar.',
    time: '',
  },
  {
    id: 'tip-3',
    title: 'Tips!',
    message: 'Konfirmasi kehadiran saat sudah sampai di lokasi penjemputan.',
    time: '',
  },
];

/** Format waktu klaim jadi teks relatif */
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

export default function RecipientHandoverPage() {
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNotifId, setActiveNotifId] = useState(null);
  // Koordinat penerima (diambil dari profil via API)
  const [recipientLat, setRecipientLat] = useState(-6.2000);
  const [recipientLng, setRecipientLng] = useState(106.8450);

  // Generate notifikasi dinamis dari data klaim aktif, fallback ke tips
  const notifications = useMemo(() => {
    if (claimedDonations.length === 0) return TIPS_NOTIFICATIONS;

    return claimedDonations.map((claim) => ({
      id: `claim-${claim.id}`,
      title: 'Penjemputan Aktif',
      message: `Jemput ${claim.quantity || claim.jumlah || ''} ${claim.unit || claim.satuan || 'porsi'} ${claim.foodName || claim.nama || 'donasi'} dari ${claim.storeName || claim.nama_toko || 'mitra'}.`,
      time: formatClaimTime(claim.claimedAt || claim.claimed_at),
    }));
  }, [claimedDonations]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch handovers dan profil penerima secara paralel
        const [handovers, profile] = await Promise.all([
          getActiveHandovers(),
          getRecipientProfile().catch(() => null),
        ]);
        setClaimedDonations(handovers);
        if (profile) {
          if (profile.latitude) setRecipientLat(Number(profile.latitude));
          if (profile.longitude) setRecipientLng(Number(profile.longitude));
        }
      } catch (error) {
        console.error('Failed to load active handovers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const navigate = useNavigate();

  // Konfirmasi penjemputan
  const handleConfirmPickup = async (id) => {
    try {
      await updateClaimStatus(id, 'completed');
      
      // Update state (remove from list)
      const updated = claimedDonations.filter((d) => d.id !== id);
      setClaimedDonations(updated);
      
      // Untuk mock localStorage update (simulasi)
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        const donation = claimedDonations.find((d) => d.id === id);
        if (donation) {
          const stored = localStorage.getItem('surplusin_history_donations');
          const history = stored ? JSON.parse(stored) : [];
          const now = new Date();
          const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
          const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
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
        }
        localStorage.setItem('surplusin_claimed_donations', JSON.stringify(updated));
      }
      
    } catch (error) {
      console.error('Gagal mengkonfirmasi penjemputan:', error);
      alert('Terjadi kesalahan saat konfirmasi penjemputan.');
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-[Manrope] text-slate-500">Memuat data penjemputan...</div>;
  }

  // Jika belum ada donasi yang diklaim
  if (claimedDonations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] px-8">
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
    <div className="flex flex-col gap-8 pb-16">
      {claimedDonations.map((donation) => {
        const storeLat = donation.lat || recipientLat;
        const storeLng = donation.lng || recipientLng;

        // URL embed Google Maps
        const mapsEmbedUrl = `https://maps.google.com/maps?q=${storeLat},${storeLng}&z=16&output=embed`;
        const mapsOpenUrl = `https://www.google.com/maps/dir/${recipientLat},${recipientLng}/${storeLat},${storeLng}`;

        return (
          <div key={donation.id} className="flex flex-col lg:flex-row gap-6" style={{ alignItems: 'flex-start' }}>
            {/* ════════════ LEFT: Donation Card ════════════ */}
            <article
              className="flex-[1.5] rounded-3xl bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 min-w-0"
            >
              {/* ── Header: Badge + Info + Estimasi ── */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-2">
                  {/* Badge */}
                  {(() => {
                    const statusMap = {
                      'on_the_way': { label: 'DALAM PERJALANAN', bg: '#fed7aa', text: '#ea580c' },
                      'completed': { label: 'DITERIMA', bg: '#bbf7d0', text: '#16a34a' },
                      'arrived': { label: 'SIAP DIJEMPUT', bg: '#bfdbfe', text: '#2563eb' },
                      'claimed': { label: 'SIAP DIJEMPUT', bg: '#bfdbfe', text: '#2563eb' },
                    };
                    const st = donation.status || 'claimed';
                    const config = statusMap[st] || statusMap['claimed'];
                    return (
                      <span
                        className="inline-block w-fit rounded-full font-[Manrope] font-bold uppercase"
                        style={{
                          backgroundColor: config.bg,
                          color: config.text,
                          padding: '6px 16px',
                          fontSize: '11px',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {config.label}
                      </span>
                    );
                  })()}

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
                style={{ marginTop: '1.9rem' }}
              >
                {/* Daftar Item Donasi */}
                <div
                  className="rounded-2xl"
                  style={{
                    padding: '0.8rem',
                    backgroundColor: '#F3F4F6',
                  }}
                >
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <img
                      src="/recipient_retailer icon/basic-icon/box.svg"
                      alt="items"
                      style={{ width: 22, height: 22 }}
                    />
                    <h4
                      className="font-[Manrope] font-bold text-[#0f172a]"
                      style={{ fontSize: '18px' }}
                    >
                      Daftar Item Donasi
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-2 pl-4">
                    {(donation.items && donation.items.length > 0 ? donation.items : ['Nasi Box', 'Ayam Bakar', 'Kerupuk udang', 'Sayur Lodeh']).map((item, idx) => (
                      <li
                        key={idx}
                        className="font-[Manrope] text-[#0f172a]"
                        style={{ fontSize: '16px' }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Konfirmasi Penerimaan */}
                <div
                  className="flex flex-col items-center justify-center rounded-2xl text-center"
                  style={{
                    padding: '0.8rem',
                    backgroundColor: '#F3F4F6',
                  }}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <img
                      src="/recipient_retailer icon/basic-icon/Done Status.svg"
                      alt="konfirmasi"
                      style={{ width: 24, height: 24 }}
                    />
                    <h4
                      className="font-[Manrope] font-bold text-[#0f172a]"
                      style={{ fontSize: '18px' }}
                    >
                      Konfirmasi Penerimaan
                    </h4>
                  </div>
                  <p
                    className="font-[Manrope] text-[#64748b]"
                    style={{ fontSize: '15px', marginBottom: '1.5rem', lineHeight: 1.4 }}
                  >
                    Pastikan kualitas makanan sesuai sebelum<br />konfirmasi.
                  </p>
                  <button
                    onClick={() => handleConfirmPickup(donation.id)}
                    className="font-[Manrope] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
                    style={{
                      backgroundColor: '#ff7a00',
                      borderRadius: '999px',
                      padding: '12px 32px',
                      fontSize: '16px',
                    }}
                  >
                    Makanan Diterima
                  </button>
                </div>
              </div>
            </article>

            {/* ════════════ RIGHT: Pusat Notifikasi + Chat Mitra ════════════ */}
            <aside
              className="hidden flex-1 shrink-0 flex-col gap-0 lg:flex"
            >
              {/* ── Pusat Notifikasi Card ── */}
              <div
                className="flex flex-col rounded-3xl bg-transparent"
                style={{
                  padding: '1.75rem',
                  border: '1px solid #1e293b',
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
                  {notifications.map((notif, index) => {
                    const isActive = (activeNotifId || notifications[0]?.id) === notif.id;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => setActiveNotifId(notif.id)}
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
                        {notif.time ? (
                          <span
                            className="font-[Manrope] font-medium text-[#94a3b8]"
                            style={{ fontSize: '11px' }}
                          >
                            {notif.time}
                          </span>
                        ) : null}
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
                <img
                  src="/recipient_retailer icon/basic-icon/Icon chat.svg"
                  alt="Chat Icon"
                  style={{ width: 20, height: 20 }}
                />
                Chat Mitra
              </button>
            </aside>
          </div>
        );
      })}
    </div>
  );
}
