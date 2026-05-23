import { useState, useMemo, useEffect } from 'react';
import { getDonationHistory } from '@/services/api/recipient';

export default function RecipientHistoryPage() {
  const [historyDonations, setHistoryDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getDonationHistory();

        setHistoryDonations(data);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  // ── Computed stats (real-time dari data riwayat) ──
  const donasiDiterima = historyDonations.length;

  // Unique toko (case-insensitive)
  const jumlahToko = useMemo(
    () => new Set(historyDonations.map((d) => d.storeName?.toLowerCase().trim())).size,
    [historyDonations]
  );

  // Estimasi orang terbantu berdasarkan jumlah donasi diterima
  const orangTerbantu = useMemo(
    () => historyDonations.reduce((sum, d) => sum + (Number(d.donationCount) || 1), 0),
    [historyDonations]
  );


  if (loading) {
    return <div className="p-10 text-center font-[Manrope] text-slate-500">Memuat riwayat donasi...</div>;
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* ════════════ SUMMARY CARDS ════════════ */}
      <div 
        className="grid gap-5 mx-4 sm:mx-auto lg:max-w-[100%] xl:max-w-[88%]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}
      >
        {/* Card 1: Orang Terbantu */}
        <div
          className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_0px_30px_rgba(37,99,235,0.35)] cursor-default"
          style={{
            padding: '2.5rem 3rem',
            borderLeft: '4px solid #2563eb',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/orang terbantu.svg" alt="Orang Terbantu" style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <p
              className="font-[Manrope] font-extrabold text-[#2563eb]"
              style={{ fontSize: '28px', lineHeight: 1.2 }}
            >
              {orangTerbantu} Orang
            </p>
            <p
              className="font-[Manrope] font-medium text-[#60a5fa]"
              style={{ fontSize: '15px' }}
            >
              Terbantu
            </p>
          </div>
        </div>

        {/* Card 2: Donasi Telah Diterima */}
        <div
          className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_0px_30px_rgba(16,185,129,0.35)] cursor-default"
          style={{
            padding: '2.5rem 3rem',
            borderLeft: '4px solid #10b981',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/donasi diterima.svg" alt="Donasi Diterima" style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <p
              className="font-[Manrope] font-extrabold text-[#10b981]"
              style={{ fontSize: '28px', lineHeight: 1.2 }}
            >
              {donasiDiterima} Donasi
            </p>
            <p
              className="font-[Manrope] font-medium text-[#4ade80]"
              style={{ fontSize: '15px' }}
            >
              Telah diterima
            </p>
          </div>
        </div>

        {/* Card 3: Jumlah Toko */}
        <div
          className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_0px_30px_rgba(249,115,22,0.35)] cursor-default"
          style={{
            padding: '2.5rem 3rem',
            borderLeft: '4px solid #f97316',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/toko mengirimkan donasi.svg" alt="Jumlah Toko" style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <p
              className="font-[Manrope] font-extrabold text-[#f97316]"
              style={{ fontSize: '28px', lineHeight: 1.2 }}
            >
              {jumlahToko} Toko
            </p>
            <p
              className="font-[Manrope] font-medium text-[#fb923c]"
              style={{ fontSize: '15px' }}
            >
              Mengirimkan Donasi
            </p>
          </div>
        </div>
      </div>

      {/* ════════════ RIWAYAT PENERIMA DONASI ════════════ */}
      <section className="rounded-lg mx-4 sm:mx-0 px-6 py-1 sm:px-2 bg-slate-50">
        <h2
          className="mb-5 font-[Manrope] font-bold text-text"
          style={{ fontSize: '20px' }}
        >
          Riwayat Penerima Donasi
        </h2>

        <div className="flex flex-col gap-3">
          {historyDonations.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl bg-white px-5 py-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Numbered badge */}
              <div
                className="flex shrink-0 items-center justify-center rounded-full font-[Manrope] text-white"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: '#50c878',
                  fontSize: '24px',
                }}
              >
                {idx + 1}
              </div>

              {/* Left info */}
              <div className="flex flex-1 flex-col" style={{ minWidth: 0 }}>
                <p
                  className="font-[Manrope] text-[#0f172a]"
                  style={{ fontSize: '18px', lineHeight: 1.3 }}
                >
                  {item.storeName}
                </p>
                <p
                  className="font-[Manrope] text-text-muted"
                  style={{ fontSize: '13px', marginTop: '2px' }}
                >
                  {item.location}  -  {item.foodName}
                </p>
              </div>

              {/* Right info */}
              <div className="flex shrink-0 flex-col items-center">
                <p
                  className="font-[Manrope] font-semibold text-text"
                  style={{ fontSize: '18px', lineHeight: 1.2 }}
                >
                  {item.portion}
                </p>
                <p
                  className="font-[Manrope] text-text-muted"
                  style={{ fontSize: '16px', marginTop: '2px' }}
                >
                  {item.date} - {item.donationCount} Donasi
                </p>
              </div>
            </div>
          ))}

          {historyDonations.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-12"
            >
              <p className="font-[Manrope] font-semibold text-[#94a3b8]" style={{ fontSize: '16px' }}>
                Belum ada riwayat donasi
              </p>
              <p className="font-[Manrope] text-[#94a3b8]" style={{ fontSize: '13px', marginTop: '4px' }}>
                Riwayat akan muncul setelah Anda menyelesaikan penjemputan donasi.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
