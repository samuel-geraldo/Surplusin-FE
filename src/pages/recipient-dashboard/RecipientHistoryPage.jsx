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

  const orangTerbantu = useMemo(
    () =>
      historyDonations.reduce((sum, item) => {
        const match = String(item.portion ?? '').match(/\d+/);
        return sum + (match ? Number(match[0]) : 0);
      }, 0),
    [historyDonations],
  );


  if (loading) {
    return <div className="p-10 text-center font-[Manrope] text-slate-500">Memuat riwayat donasi...</div>;
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pb-16 sm:px-6 lg:px-8">
      {/* ════════════ SUMMARY CARDS ════════════ */}
      <div
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {/* Card 1: Orang Terbantu */}
        <div
          className="relative flex min-w-0 items-center gap-3 sm:gap-5 overflow-hidden rounded-2xl bg-white p-4 sm:p-5 lg:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_0px_30px_rgba(37,99,235,0.35)] cursor-default"
          style={{
            borderLeft: '4px solid #2563eb',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/orang terbantu.svg" alt="Orang Terbantu" className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0" />
          </div>
          <div className="flex min-w-0 flex-col">
            <p
              className="font-[Manrope] font-extrabold text-[#2563eb] text-[22px] sm:text-[28px] leading-tight"
            >
              {orangTerbantu} Orang
            </p>
            <p
              className="font-[Manrope] font-medium text-[#60a5fa] text-[13px] sm:text-[15px]"
            >
              Terbantu
            </p>
          </div>
        </div>

        {/* Card 2: Donasi Telah Diterima */}
        <div
          className="relative flex min-w-0 items-center gap-3 sm:gap-5 overflow-hidden rounded-2xl bg-white p-4 sm:p-5 lg:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_0px_30px_rgba(16,185,129,0.35)] cursor-default"
          style={{
            borderLeft: '4px solid #10b981',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/donasi diterima.svg" alt="Donasi Diterima" className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0" />
          </div>
          <div className="flex min-w-0 flex-col">
            <p
              className="font-[Manrope] font-extrabold text-[#10b981] text-[22px] sm:text-[28px] leading-tight"
            >
              {donasiDiterima} Donasi
            </p>
            <p
              className="font-[Manrope] font-medium text-[#34d399] text-[13px] sm:text-[15px]"
            >
              Telah diterima
            </p>
          </div>
        </div>

        {/* Card 3: Jumlah Toko */}
        <div
          className="relative flex min-w-0 items-center gap-3 sm:gap-5 overflow-hidden rounded-2xl bg-white p-4 sm:p-5 lg:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_0px_30px_rgba(249,115,22,0.35)] cursor-default w-full md:col-span-2 xl:col-span-1 md:w-[calc(50%-10px)] md:justify-self-center xl:w-full xl:justify-self-auto"
          style={{
            borderLeft: '4px solid #ea580c',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/toko mengirimkan donasi.svg" alt="Toko Terlibat" className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0" />
          </div>
          <div className="flex min-w-0 flex-col">
            <p
              className="font-[Manrope] font-extrabold text-[#ea580c] text-[22px] sm:text-[28px] leading-tight"
            >
              {jumlahToko} Toko
            </p>
            <p
              className="font-[Manrope] font-medium text-[#fb923c] text-[13px] sm:text-[15px]"
            >
              Mengirimkan Donasi
            </p>
          </div>
        </div>
      </div>

      {/* ════════════ RIWAYAT PENERIMA DONASI ════════════ */}
      <section className="rounded-lg bg-slate-50 p-5 sm:p-7 lg:px-8">
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
              className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:px-6"
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
                  className="break-words font-[Manrope] text-text-muted"
                  style={{ fontSize: '13px', marginTop: '2px' }}
                >
                  {item.location}  -  {item.foodName}
                </p>
              </div>

              {/* Right info */}
              <div className="flex w-full shrink-0 flex-col items-start sm:w-auto sm:items-center">
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
              <p className="text-center font-[Manrope] font-semibold text-[#94a3b8]" style={{ fontSize: '16px' }}>
                Belum ada riwayat donasi
              </p>
              <p className="text-center font-[Manrope] text-[#94a3b8] px-4" style={{ fontSize: '13px', marginTop: '4px' }}>
                Riwayat akan muncul setelah Anda menyelesaikan penjemputan donasi.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
