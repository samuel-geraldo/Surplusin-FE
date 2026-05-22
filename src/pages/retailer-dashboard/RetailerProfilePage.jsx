import { Edit, MapPin, Search, Store, LocateFixed } from 'lucide-react';

const profileFields = [
  {
    label: 'Nama Toko/Usaha',
    value: 'Catering Ibu Endang',
    style: { width: 573, height: 60 },
  },
  {
    label: 'Kategori Usaha',
    value: 'Makanan Siap Saji',
    style: { width: 278, height: 60 },
  },
  {
    label: 'Nomor Whatsapp',
    value: '081234567890',
    style: { width: 278, height: 60 },
  },
  {
    label: 'Alamat Lengkap',
    value: 'Jl. Kebahagian No.123, Kebayoran baru, Jakarta Selatan',
    style: { width: 573, height: 119, alignItems: 'flex-start', paddingTop: 14 },
  },
  {
    label: 'Patokan (Opsional)',
    value: 'Depan Alfamart',
    style: { width: 573, height: 60 },
  },
];

function FieldBox({ label, value, style }) {
  return (
    <label className="flex flex-col gap-[13px]">
      <span className="font-[Manrope] text-[20px] font-medium leading-[27px] tracking-[-0.4px] text-black">
        {label}
      </span>
      <span
        className="flex items-center rounded-[10px] px-2.5 font-[Manrope] text-[18px] font-normal leading-[25px] tracking-[-0.36px] text-[#1e293b]"
        style={{ backgroundColor: '#dcfce9', ...style }}
      >
        {value}
      </span>
    </label>
  );
}

function MapPreview() {
  return (
    <img
      src="/retailer-profile-map.png"
      alt=""
      aria-hidden="true"
      style={{ width: 538.5, height: 327, objectFit: 'cover' }}
    />
  );
}

export default function RetailerProfilePage() {
  return (
    <div className="w-full overflow-x-auto font-[Manrope]" style={{ minHeight: 947, backgroundColor: '#f3f3f6' }}>
      <div className="flex" style={{ minWidth: 1379, gap: 30, padding: '30px 42px 70px' }}>
        <section className="shrink-0 rounded-[14px] bg-white" style={{ width: 632.5, height: 650, padding: '37px 30px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 33 }}>
            <div className="flex items-center gap-3">
              <Store className="size-9 text-black" strokeWidth={2.6} />
              <h2 className="font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-black">
                Informasi Dasar
              </h2>
            </div>
            <button
              type="button"
              aria-label="Edit profil"
              className="flex size-8 items-center justify-center text-black transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a]"
            >
              <Edit className="size-6 fill-black" strokeWidth={2.4} />
            </button>
          </div>

          <div className="flex flex-col" style={{ gap: 18 }}>
            <FieldBox {...profileFields[0]} />
            <div className="flex" style={{ gap: 18 }}>
              <FieldBox {...profileFields[1]} />
              <FieldBox {...profileFields[2]} />
            </div>
            <FieldBox {...profileFields[3]} />
            <FieldBox {...profileFields[4]} />
          </div>
        </section>

        <section className="shrink-0 rounded-[14px] bg-white" style={{ width: 632.5, height: 650, padding: '57px 47px' }}>
          <div className="flex flex-col" style={{ width: 538.5 }}>
            <div className="flex items-center gap-2">
              <MapPin className="size-[42px] fill-black text-black" strokeWidth={2.4} />
              <h2 className="font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-black">
                Pinpoint Lokasi
              </h2>
            </div>
            <p className="font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#64748b]" style={{ width: 538.5, marginTop: 12 }}>
              Geser pin pada peta untuk menentukan titik koordinat penjemputan donasi yang lebih akurat
            </p>

            <div className="flex items-center rounded-[10px] border border-[#64748b] bg-white px-3" style={{ width: 538.5, height: 60, marginTop: 33 }}>
              <Search className="size-8 text-[#64748b]" strokeWidth={2.2} />
              <span className="ml-2 font-[Manrope] text-[20px] font-normal leading-[27px] tracking-[-0.4px] text-[#64748b]">
                Cari alamat...
              </span>
              <LocateFixed className="ml-auto size-7 text-black" strokeWidth={2.5} />
            </div>

            <div style={{ marginTop: 18 }}>
              <MapPreview />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
