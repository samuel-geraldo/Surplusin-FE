const summaryCards = [
  {
    value: '250 kg',
    label: 'Makanan tidak ke TPA',
    accent: '#1f66f4',
    icon: 'bowl',
  },
  {
    value: '120 Porsi',
    label: 'Makanan dikirimkan',
    accent: '#ff6600',
    icon: 'box',
  },
  {
    value: '2000 kg',
    label: 'Emisi terselamatkan',
    accent: '#50c878',
    icon: 'leaf',
  },
];

const historyRows = [
  {
    rank: 1,
    name: 'Panti Jenaka Sukarela',
    detail: 'Tebet - 3 Kali Pengiriman',
    total: '60 Porsi',
    last: 'Terakhir 23 April 2026',
  },
  {
    rank: 2,
    name: 'Panti Al-Ikhlas',
    detail: 'Pasar Minggu - 2 Kali Pengiriman',
    total: '30 Porsi',
    last: 'Terakhir 21 April 2026',
  },
  {
    rank: 3,
    name: 'Panti Orphanage',
    detail: 'Tebet - 4 Kali Pengiriman',
    total: '65 Porsi',
    last: 'Terakhir 15 April 2026',
  },
  {
    rank: 4,
    name: 'Panti Al-Rasyid',
    detail: 'Setiabudi - 1 Kali Pengiriman',
    total: '10 Porsi',
    last: 'Terakhir 30 Maret 2026',
  },
];

function SummaryIcon({ type, color }) {
  if (type === 'box') {
    return (
      <svg aria-hidden="true" viewBox="0 0 58 58" className="size-16" fill={color}>
        <path d="M13 8h32l7 7v32a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V15l7-7Zm1.8 6-2.9 3h34.2l-2.9-3H14.8ZM21 22v19l8-5.2 8 5.2V22H21Z" />
      </svg>
    );
  }

  if (type === 'leaf') {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64" className="size-16" fill={color}>
        <path d="M58 10c-21.3 1.7-39.2 9-47 22.7-5.7 10 1 18 10.5 17.9 5.5-.1 10.8-2.8 15.4-7.4-5.7 1.6-11.6 1.5-17.4-.5 16.8-2.8 28.5-12.2 38.5-32.7Z" />
        <path d="M13.3 51.4c9-14.2 23.4-21.7 39-26.5-11.8 6.1-23.7 15.3-31.2 30.4l-7.8-3.9Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="size-16" fill={color}>
      <path d="M12 26h40v8c0 11-8.8 20-20 20S12 45 12 34v-8Z" />
      <path d="M16 22c0-3 2.5-5.5 5.5-5.5 1.1-3.7 4.6-6.5 8.7-6.5 3.4 0 6.4 1.9 7.9 4.7 1-.4 2-.7 3.2-.7 4.5 0 8.2 3.6 8.2 8H16Z" />
      <rect x="10" y="34" width="44" height="7" rx="3.5" />
    </svg>
  );
}

function SummaryCard({ card }) {
  return (
    <article
      className="flex items-center rounded-[14px] border-l-4 bg-white pl-[26px] shadow-[0_8px_4px_rgba(0,0,0,0.16)]"
      style={{ width: 351.667, height: 150, borderLeftColor: card.accent }}
    >
      <SummaryIcon type={card.icon} color={card.accent} />
      <div className="ml-[13px] flex flex-col" style={{ color: card.accent }}>
        <p className="font-[Manrope] text-[32px] font-extrabold leading-[38px] tracking-[-0.64px]">
          {card.value}
        </p>
        <p className="font-[Manrope] text-[18px] font-normal leading-[25px] tracking-[-0.36px]">
          {card.label}
        </p>
      </div>
    </article>
  );
}

function HistoryRow({ row }) {
  return (
    <article className="flex items-center justify-between rounded-[10px] bg-white px-9" style={{ width: 1295, height: 96 }}>
      <div className="flex items-center">
        <div
          className="flex items-center justify-center rounded-full font-[Manrope] text-[32px] font-normal leading-[41px] tracking-[-0.64px] text-white"
          style={{ width: 60, height: 60, backgroundColor: '#5fcf86' }}
        >
          {row.rank}
        </div>
        <div className="flex flex-col" style={{ marginLeft: 30 }}>
          <h3 className="font-[Manrope] text-[18px] font-medium leading-[25px] tracking-[-0.36px] text-[#0f172a]">
            {row.name}
          </h3>
          <p className="mt-0.5 font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#64748b]">
            {row.detail}
          </p>
        </div>
      </div>
      <div className="flex w-[171px] flex-col items-end text-right">
        <p className="font-[Manrope] text-[24px] font-normal leading-[33px] tracking-[-0.48px] text-[#0f172a]">
          {row.total}
        </p>
        <p className="font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#64748b]">
          {row.last}
        </p>
      </div>
    </article>
  );
}

export default function RetailerHistoryPage() {
  return (
    <div className="w-full overflow-x-auto font-[Manrope]" style={{ minHeight: 947, backgroundColor: '#f3f3f6' }}>
      <div style={{ minWidth: 1379, padding: '41px 42px 70px' }}>
        <section className="flex items-start" style={{ width: 1295, height: 150, gap: 40, paddingLeft: 80 }}>
          {summaryCards.map((card) => (
            <SummaryCard key={card.value} card={card} />
          ))}
        </section>

        <section style={{ width: 1295, marginTop: 43 }}>
          <div className="flex items-center" style={{ height: 52, paddingInline: 10 }}>
            <h2 className="font-[Manrope] text-[24px] font-semibold leading-[33px] tracking-[-0.48px] text-[#0f172a]">
              Riwayat Penyerahan Donasi
            </h2>
          </div>
          <div className="flex flex-col" style={{ marginTop: 14, gap: 25 }}>
            {historyRows.map((row) => (
              <HistoryRow key={row.rank} row={row} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
