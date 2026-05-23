import { useEffect, useMemo, useState } from 'react';
import { getRetailerHistory } from '@/services/api/retailer';

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function SummaryCard({ card }) {
  return (
    <article
      className="relative flex items-center gap-5 overflow-hidden rounded-2xl bg-white"
      style={{
        padding: '1.75rem',
        borderLeft: `4px solid ${card.accent}`,
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
      }}
    >
      <img src={card.icon} alt="" aria-hidden="true" style={{ width: 48, height: 48 }} />
      <div className="flex min-w-0 flex-col">
        <p className="font-[Manrope] font-extrabold leading-tight" style={{ color: card.accent, fontSize: '28px' }}>
          {card.value}
        </p>
        <p className="font-[Manrope] font-medium" style={{ color: card.accent, fontSize: '15px' }}>
          {card.label}
        </p>
      </div>
    </article>
  );
}

function HistoryRow({ row, rank }) {
  return (
    <article
      className="flex items-center gap-4 rounded-2xl bg-white transition-shadow hover:shadow-md"
      style={{ padding: '1.1rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <div
        className="flex shrink-0 items-center justify-center rounded-full font-[Manrope] font-bold text-white"
        style={{ width: 44, height: 44, backgroundColor: '#4ade80', fontSize: '18px' }}
      >
        {rank}
      </div>

      <div className="flex flex-1 flex-col" style={{ minWidth: 0 }}>
        <p className="truncate font-[Manrope] text-[#0f172a]" style={{ fontSize: '15px', lineHeight: 1.3 }}>
          {row.nama_instansi ?? '-'}
        </p>
        <p className="font-[Manrope] text-[#94a3b8]" style={{ fontSize: '13px', marginTop: '2px' }}>
          {row.alamat ?? '-'} - {row.jumlah_pengiriman ?? 0} Kali Pengiriman
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end">
        <p className="font-[Manrope] font-semibold text-[#0f172a]" style={{ fontSize: '18px', lineHeight: 1.2 }}>
          {row.total_porsi ?? 0} Porsi
        </p>
        <p className="font-[Manrope] text-[#94a3b8]" style={{ fontSize: '12px', marginTop: '2px' }}>
          Terakhir {formatDate(row.terakhir)}
        </p>
      </div>
    </article>
  );
}

export default function RetailerHistoryPage() {
  const [historyRows, setHistoryRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setIsLoading(true);
        setError('');
        const data = await getRetailerHistory();
        if (!cancelled) setHistoryRows(data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.response?.data?.error || 'Gagal memuat riwayat penyerahan');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPorsi = useMemo(
    () => historyRows.reduce((sum, row) => sum + Number(row.total_porsi ?? 0), 0),
    [historyRows],
  );
  const totalPengiriman = useMemo(
    () => historyRows.reduce((sum, row) => sum + Number(row.jumlah_pengiriman ?? 0), 0),
    [historyRows],
  );
  const totalKg = totalPorsi;

  const summaryCards = [
    {
      value: `${totalKg} kg`,
      label: 'Makanan tidak ke TPA',
      accent: '#1f66f4',
      icon: '/recipient_retailer icon/basic-icon/orang terbantu.svg',
    },
    {
      value: `${totalPorsi} Porsi`,
      label: 'Makanan dikirimkan',
      accent: '#ff6600',
      icon: '/recipient_retailer icon/basic-icon/toko mengirimkan donasi.svg',
    },
    {
      value: `${totalPengiriman * 2} kg`,
      label: 'Emisi terselamatkan',
      accent: '#50c878',
      icon: '/recipient_retailer icon/basic-icon/donasi diterima.svg',
    },
  ];

  return (
    <div className="flex flex-col gap-8" style={{ padding: '2rem 2rem 4rem', marginTop: '1rem' }}>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3" style={{ marginLeft: '1rem', marginRight: '1rem' }}>
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} card={card} />
        ))}
      </section>

      <section
        className="rounded-2xl"
        style={{
          marginLeft: '1rem',
          marginRight: '1rem',
          padding: '1.75rem 2rem',
          backgroundColor: '#f8fafc',
        }}
      >
        <h2 className="mb-5 font-[Manrope] font-bold text-[#0f172a]" style={{ fontSize: '20px' }}>
          Riwayat Penyerahan Donasi
        </h2>

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-[Manrope] text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {isLoading ? (
            <p className="py-10 text-center font-[Manrope] font-semibold text-[#94a3b8]">
              Memuat riwayat...
            </p>
          ) : historyRows.length > 0 ? (
            historyRows.map((row, index) => (
              <HistoryRow key={`${row.nama_instansi}-${index}`} row={row} rank={index + 1} />
            ))
          ) : (
            <p className="py-10 text-center font-[Manrope] font-semibold text-[#94a3b8]">
              Belum ada riwayat penyerahan.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
