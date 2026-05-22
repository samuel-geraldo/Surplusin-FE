import { cn } from '@/lib/utils';

const ICONS = {
  home: '/recipient_retailer icon/basic-icon/icon rumah.svg',
  foundation: '/recipient_retailer icon/basic-icon/toko mengirimkan donasi.svg',
  food: '/recipient_retailer icon/basic-icon/piring.svg',
  bread: '/recipient_retailer icon/basic-icon/pastry.svg',
  cake: '/recipient_retailer icon/basic-icon/kue.svg',
};

const activeDonations = [
  {
    title: 'Paket Nasi Box',
    meta: '15 Porsi - Exp: 52 menit',
    icon: ICONS.food,
    iconBg: '#ffd0b0',
    status: 'Tersedia',
    statusTone: 'available',
  },
  {
    title: 'Aneka Roti Manis',
    meta: '12 Box - Exp: 5 jam 12 menit',
    icon: ICONS.bread,
    iconBg: '#ffc5c4',
    status: 'Diklaim',
    statusTone: 'claimed',
  },
  {
    title: 'Kue Apa aja lah yang penting enak',
    meta: '12 Box - Exp: 6 jam 12 menit',
    icon: ICONS.cake,
    iconBg: '#bad0fc',
    status: 'Diterima',
    statusTone: 'received',
  },
  {
    title: 'Nasi Kotak + Ayam Goreng',
    meta: '15 Porsi - Exp: 52 menit',
    icon: ICONS.food,
    iconBg: '#ffd0b0',
    status: 'Tersedia',
    statusTone: 'available',
  },
  {
    title: 'Kue Apa aja lah yang penting enak',
    meta: '12 Box - Exp: 6 jam 12 menit',
    icon: ICONS.cake,
    iconBg: '#bad0fc',
    status: 'Diterima',
    statusTone: 'received',
  },
  {
    title: 'Nasi Kotak + Ayam Goreng',
    meta: '15 Porsi - Exp: 52 menit',
    icon: ICONS.food,
    iconBg: '#ffd0b0',
    status: 'Tersedia',
    statusTone: 'available',
  },
  {
    title: 'Aneka Roti Manis',
    meta: '12 Box - Exp: 5 jam 12 menit',
    icon: ICONS.bread,
    iconBg: '#ffc5c4',
    status: 'Diklaim',
    statusTone: 'claimed',
  },
  {
    title: 'Kue Apa aja lah yang penting enak',
    meta: '12 Box - Exp: 6 jam 12 menit',
    icon: ICONS.cake,
    iconBg: '#bad0fc',
    status: 'Diterima',
    statusTone: 'received',
  },
  {
    title: 'Nasi Kotak + Ayam Goreng',
    meta: '15 Porsi - Exp: 52 menit',
    icon: ICONS.food,
    iconBg: '#ffd0b0',
    status: 'Tersedia',
    statusTone: 'available',
  },
  {
    title: 'Aneka Roti Manis',
    meta: '12 Box - Exp: 5 jam 12 menit',
    icon: ICONS.bread,
    iconBg: '#ffc5c4',
    status: 'Diklaim',
    statusTone: 'claimed',
  },
];

function MaskedIcon({ src, color, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn('block bg-current', className)}
      style={{
        color,
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}

function SummaryCard({ accent, icon, value, label }) {
  return (
    <article
      className="flex h-[150px] min-w-0 flex-1 items-center rounded-2xl border-l-4 bg-white px-[30px] py-6 shadow-[0_8px_2px_rgba(0,0,0,0.1)]"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex items-center gap-[11px]">
        <MaskedIcon src={icon} color={accent} className="size-16 shrink-0" />
        <div className="flex w-[181px] flex-col items-start text-left leading-none" style={{ color: accent }}>
          <p className="w-full font-[Manrope] text-[32px] font-extrabold leading-none tracking-[-0.64px]">
            {value}
          </p>
          <p className="mt-1 w-full font-[Manrope] text-[18px] font-normal leading-none">
            {label}
          </p>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ tone, children }) {
  const toneClass = {
    available: 'bg-[#c9eed5] text-[#3c965a]',
    claimed: 'bg-[#ffd0b0] text-[#ff6600]',
    received: 'bg-[#bad0fc] text-[#1f66f4]',
  }[tone];

  return (
    <span
      className={cn(
        'flex h-[35px] w-28 shrink-0 items-center justify-center rounded-2xl px-2.5 py-[5px]',
        'font-[Manrope] text-[18px] font-medium leading-none',
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

function DonationRow({ item }) {
  return (
    <article className="flex h-[86px] w-full shrink-0 items-center justify-between rounded-2xl bg-white px-4">
      <div className="flex items-center gap-3">
        <div
          className="flex size-[60px] shrink-0 items-center justify-center rounded-2xl p-2.5"
          style={{ backgroundColor: item.iconBg }}
        >
          <MaskedIcon
            src={item.icon}
            color={item.statusTone === 'received' ? '#1f66f4' : '#ff6600'}
            className="size-9"
          />
        </div>
        <div className="flex w-[284px] flex-col justify-center gap-0.5 leading-none">
          <p className="whitespace-nowrap font-[Manrope] text-[18px] font-medium leading-none text-[#0f172a]">
            {item.title}
          </p>
          <p className="font-[Manrope] text-[16px] font-normal leading-none text-[#64748b]">
            {item.meta}
          </p>
        </div>
      </div>
      <StatusBadge tone={item.statusTone}>{item.status}</StatusBadge>
    </article>
  );
}

export default function RetailerDashboardPage() {
  return (
    <div className="w-full bg-[#f3f3f6]">
      <section className="mt-12 flex h-[899px] w-full flex-col items-center gap-[30px] px-[30px]">
        <div className="flex h-[178px] w-full shrink-0 items-start justify-center gap-10 px-20">
          <SummaryCard
            accent="#1f66f4"
            icon={ICONS.home}
            value="5 Panti"
            label="Tersedia di sekitarmu"
          />
          <SummaryCard
            accent="#ff6600"
            icon={ICONS.foundation}
            value="3 Yayasan"
            label="Tersedia di sekitarmu"
          />
        </div>

        <button
          type="button"
          className="flex h-[90px] w-full shrink-0 items-center justify-center rounded-[24px] bg-[#ff6600] px-10 py-3.5 font-[Manrope] text-[32px] font-bold leading-none text-white transition-colors hover:bg-[#e65c00] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6600]"
        >
          Input Surplus baru
        </button>

        <section className="flex h-[571px] w-full shrink-0 flex-col items-start gap-1.5">
          <div className="flex w-full shrink-0 items-center bg-[#f3f3f6] p-2.5">
            <h2 className="whitespace-pre font-[Manrope] text-[24px] font-semibold leading-none text-[#0f172a]">
              Monitor Donasi  Aktif
            </h2>
          </div>
          <div className="flex h-[648px] w-full shrink-0 flex-col items-start gap-5 overflow-x-hidden overflow-y-auto">
            {activeDonations.map((item, index) => (
              <DonationRow key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
