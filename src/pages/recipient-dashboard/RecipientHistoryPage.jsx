import { useState, useMemo } from 'react';
import {
  mockHistoryDonations,
  mockHistorySummary,
} from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

export default function RecipientHistoryPage() {
  // Gabungkan mock data + data dari localStorage (donasi yang selesai dijemput)
  const [historyDonations] = useState(() => {
    try {
      const stored = localStorage.getItem('surplusin_history_donations');
      const fromStorage = stored ? JSON.parse(stored) : [];
      return [...mockHistoryDonations, ...fromStorage];
    } catch {
      return [...mockHistoryDonations];
    }
  });

  // ── Computed stats (real-time dari data riwayat) ──
  const donasiDiterima = historyDonations.length;

  // Unique toko (case-insensitive)
  const jumlahToko = useMemo(
    () => new Set(historyDonations.map((d) => d.storeName?.toLowerCase().trim())).size,
    [historyDonations]
  );

  // Orang terbantu tetap menggunakan data statis untuk saat ini sesuai permintaan
  const orangTerbantu = mockHistorySummary.orangTerbantu;


  return (
    <div
      className="flex flex-col gap-8"
      style={{ padding: '2rem 2rem 4rem', marginTop: '1rem' }}
    >
      {/* ════════════ SUMMARY CARDS ════════════ */}
      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
        style={{ marginLeft: '1rem', marginRight: '1rem' }}
      >
        {/* Card 1: Orang Terbantu */}
        <div
          className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white"
          style={{
            padding: '1.75rem',
            borderLeft: '4px solid #2563eb',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/orang terbantu.svg" alt="Orang Terbantu" style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex flex-col">
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
          className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white"
          style={{
            padding: '1.75rem',
            borderLeft: '4px solid #10b981',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/donasi diterima.svg" alt="Donasi Diterima" style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex flex-col">
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
          className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white"
          style={{
            padding: '1.75rem',
            borderLeft: '4px solid #f97316',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex shrink-0 items-center justify-center">
            <img src="/recipient_retailer icon/basic-icon/toko mengirimkan donasi.svg" alt="Jumlah Toko" style={{ width: 48, height: 48 }} />
          </div>
          <div className="flex flex-col">
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
      <section
        className="rounded-2xl"
        style={{
          marginLeft: '1rem',
          marginRight: '1rem',
          padding: '1.75rem 2rem',
          backgroundColor: '#f8fafc',
        }}
      >
        <h2
          className="mb-5 font-[Manrope] font-bold text-[#0f172a]"
          style={{ fontSize: '20px' }}
        >
          Riwayat Penerima Donasi
        </h2>

        <div className="flex flex-col gap-3">
          {historyDonations.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl bg-white transition-shadow hover:shadow-md"
              style={{
                padding: '1.1rem 1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Numbered badge */}
              <div
                className="flex shrink-0 items-center justify-center rounded-full font-[Manrope] font-bold text-white"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#4ade80',
                  fontSize: '18px',
                }}
              >
                {idx + 1}
              </div>

              {/* Left info */}
              <div className="flex flex-1 flex-col" style={{ minWidth: 0 }}>
                <p
                  className="font-[Manrope] text-[#0f172a]"
                  style={{ fontSize: '15px', lineHeight: 1.3 }}
                >
                  {item.storeName}
                </p>
                <p
                  className="font-[Manrope] text-[#94a3b8]"
                  style={{ fontSize: '13px', marginTop: '2px' }}
                >
                  {item.location}  -  {item.foodName}
                </p>
              </div>

              {/* Right info */}
              <div className="flex shrink-0 flex-col items-end">
                <p
                  className="font-[Manrope] font-semibold text-[#0f172a]"
                  style={{ fontSize: '18px', lineHeight: 1.2 }}
                >
                  {item.portion}
                </p>
                <p
                  className="font-[Manrope] text-[#94a3b8]"
                  style={{ fontSize: '12px', marginTop: '2px' }}
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
