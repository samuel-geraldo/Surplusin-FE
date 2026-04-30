import { MOCK_CATEGORIES } from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

export function DonationListCard({ data }) {
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

  // Konfigurasi warna & ikon berdasarkan tipe makanan
  const getConfig = (type) => {
    switch (type) {
      case 'makanan-siap-saji':
        return {
          bg: 'bg-[#fed7aa]', // orange-200
          icon: '/recipient_retailer icon/basic-icon/makanan.svg',
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
          bg: 'bg-[#fef08a]', // yellow-200
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

  return (
    <article 
      className="flex max-w-[700px] gap-5 rounded-3xl border border-[#f1f5f9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      style={{ padding: '1rem', paddingLeft: '1rem' }}
    >
      {/* ── Left Column: Icon & Category ── */}
      <div className="flex w-[200px] shrink-0 flex-col">
        {/* Main Box */}
        <div className={`flex h-[140px] w-full items-center justify-center rounded-2xl ${config.bg}`}>
          <img 
            src={config.icon} 
            alt={categoryLabel} 
            className="h-20 w-20 object-contain opacity-90" 
          />
        </div>
        
        {/* Category Pill */}
        <div className={`mt-3 flex h-[36px] w-full items-center justify-center rounded-xl ${config.pillBg}`}>
          <span className={`font-[Manrope] text-[11px] font-bold uppercase tracking-wide ${config.pillText}`}>
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* ── Right Column: Details & Button ── */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Header Texts */}
        <div>
          <h3 className="font-[Manrope] text-[18px] font-extrabold leading-tight text-[#0f172a]">
            {storeName}
          </h3>
          <p className="mt-1 font-[Manrope] text-[14px] font-medium text-[#334155]">
            {foodName}
          </p>
        </div>

        {/* 3 Gray Detail Boxes */}
        <div className="mt-3 h-20 flex gap-2">
          {/* Jumlah */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#f8fafc] py-2 px-1">
            <img 
              src="/recipient_retailer icon/basic-icon/pan.svg" 
              alt="jumlah" 
              className="mb-1 h-[14px] w-[14px] opacity-70" 
            />
            <span className="font-[Manrope] text-[8px] font-bold uppercase tracking-wider text-[#64748b]">
              Jumlah
            </span>
            <span className="mt-0.5 font-[Manrope] text-[12px] font-extrabold text-[#0f172a]">
              {portion}
            </span>
          </div>

          {/* Jarak */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#f8fafc] py-2 px-1">
            <img 
              src="/recipient_retailer icon/basic-icon/location.svg" 
              alt="jarak" 
              className="mb-1 h-[14px] w-[14px] opacity-70" 
            />
            <span className="font-[Manrope] text-[8px] font-bold uppercase tracking-wider text-[#64748b]">
              Jarak
            </span>
            <span className="mt-0.5 font-[Manrope] text-[12px] font-extrabold text-[#0f172a]">
              {distance}
            </span>
          </div>

          {/* Kedaluwarsa */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#f8fafc] py-2 px-1">
            <img 
              src="/recipient_retailer icon/basic-icon/clock.svg" 
              alt="kedaluwarsa" 
              className="mb-1 h-[14px] w-[14px] opacity-70" 
            />
            <span className="font-[Manrope] text-[8px] font-bold uppercase tracking-wider text-[#64748b]">
              Kedaluwarsa
            </span>
            <span className="mt-0.5 font-[Manrope] text-[12px] font-extrabold text-[#0f172a]">
              {expiry}
            </span>
          </div>
        </div>

        {/* Ambil Button */}
        <button className="mt-4  h-10 w-full rounded-xl bg-[#ff7a00] py-[10px] font-[Manrope] text-[15px] font-bold text-white transition-colors hover:bg-[#e66e00] focus:outline-none focus:ring-4 focus:ring-[#ff7a00]/30">
          Ambil
        </button>
      </div>
    </article>
  );
}
