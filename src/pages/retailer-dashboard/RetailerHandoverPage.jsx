import { MessageSquare } from 'lucide-react';

const preparationItems = ['Nasi', 'Ayam Goreng', 'Sayur Lodeh', 'Kerupuk', 'Item 5', 'Item 6', 'Item 7'];

const notifications = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  title: 'Klaim Donasi!',
  message: 'Panti Asuhan Kasih Bunda baru saja mengklaim 20 Porsi Nasi Box Anda. Mohon siapkan paket untuk penjemputan.',
  time: 'Baru saja',
}));

function TruckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 48" className="h-12 w-16 fill-[#ff6600]">
      <path d="M2 6a4 4 0 0 1 4-4h36v34H2V6Zm40 10h8.6c1.3 0 2.5.6 3.3 1.6L62 28v8H42V16Zm7 6v8h8.2l-6-8H49Z" />
      <circle cx="16" cy="38" r="7" />
      <circle cx="49" cy="38" r="7" />
      <circle cx="16" cy="38" r="3" className="fill-white" />
      <circle cx="49" cy="38" r="3" className="fill-white" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 fill-black">
      <path d="M3 7h10v10H3V7Zm12 0h9.5L29 12.2V25H15V7Zm9 2.6V14h3.8L24 9.6ZM3 19h10v6H3v-6Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 50" className="h-[50px] w-16 fill-[#2563eb]">
      <path d="M31.9 1 2 25.5l5.2 6.4 5.6-4.6V50h14.5V35.4h9.4V50h14.5V27.3l5.6 4.6 5.2-6.4L49.5 15.2V4.5h-9.1V7.7L31.9 1Z" />
    </svg>
  );
}

function CheckItem({ children }) {
  return (
    <li className="flex h-[25px] items-center gap-2">
      <span className="w-[26px] shrink-0 text-[20px] font-bold leading-none text-[#50c878]">✓</span>
      <span className="font-[Manrope] text-[18px] font-normal leading-[25px] tracking-[-0.36px] text-[#1e293b]">
        {children}
      </span>
    </li>
  );
}

function NotificationCard({ item, active }) {
  return (
    <article className="h-[162px] w-[370px] rounded-[14px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <div className="relative h-full w-full rounded-[14px]">
        {active ? <div className="absolute left-0 top-0 h-full w-1 rounded-l-[14px] bg-[#1f66f4]" /> : null}
        <div className="flex h-full w-full flex-col px-6 py-5">
          <h3 className="font-[Manrope] text-[18px] font-bold leading-[25px] tracking-[-0.36px] text-[#0f172a]">
            {item.title}
          </h3>
          <p className="mt-1.5 w-[322px] font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#64748b]">
            {item.message}
          </p>
          <p className="mt-1.5 font-[Manrope] text-[14px] font-normal leading-[19px] tracking-[-0.28px] text-[#64748b]">
            {item.time}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function RetailerHandoverPage() {
  const firstColumn = preparationItems.slice(0, 4);
  const secondColumn = preparationItems.slice(4);

  return (
    <div className="min-h-[947px] w-full overflow-x-auto bg-[#f3f3f6] font-[Manrope]">
      <div className="min-w-[1379px] px-[42px] pb-[55px] pt-12">
        <section className="flex h-[117px] w-[1295px] items-center rounded-[14px] border border-[#ff6600] bg-white px-[39px] shadow-[0_4px_10px_rgba(255,102,0,0.6)]">
          <TruckIcon />
          <div className="ml-5 flex flex-col">
            <h2 className="font-[Manrope] text-[32px] font-bold leading-[38px] tracking-[-0.64px] text-[#ff6600]">
              Penerima sedang menuju lokasi
            </h2>
            <p className="font-[Manrope] text-[18px] font-normal leading-[25px] tracking-[-0.36px] text-[#ff6600]">
              dari Panti Jenaka Sukarela
            </p>
          </div>
        </section>

        <div className="mt-11 flex w-[1295px] gap-[38px]">
          <div className="flex w-[823px] shrink-0 flex-col gap-[30px]">
            <section className="h-[371px] w-[823px] rounded-[10px] bg-white px-9 py-[39px]">
              <div className="flex h-[38px] items-center gap-1.5">
                <PackageIcon />
                <h2 className="font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-[#0f172a]">
                  Daftar Persiapan Item
                </h2>
              </div>

              <div className="mt-[18px] flex h-[27px] w-[751px] items-center justify-between">
                <h3 className="font-[Manrope] text-[20px] font-semibold leading-[27px] tracking-[-0.4px] text-[#0f172a]">
                  Paket Nasi Box
                </h3>
                <div className="flex items-center gap-[10px] pr-0">
                  <span className="font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#1e293b]">
                    Jumlah:
                  </span>
                  <span className="font-[Manrope] text-[16px] font-medium leading-[22px] tracking-[-0.32px] text-[#1e293b]">
                    20 Porsi
                  </span>
                </div>
              </div>

              <div className="mt-[21px] h-[148px] w-[751px] rounded-[10px] bg-[#f0f0f3] px-2 py-3">
                <div className="flex gap-2">
                  <ul className="flex w-[293px] flex-col gap-2">
                    {firstColumn.map((item) => (
                      <CheckItem key={item}>{item}</CheckItem>
                    ))}
                  </ul>
                  <ul className="flex w-[293px] flex-col gap-2 pl-2">
                    {secondColumn.map((item) => (
                      <CheckItem key={item}>{item}</CheckItem>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex h-7 w-[751px] items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1f66f4] font-[Manrope] text-[18px] font-extrabold leading-none text-white">
                  !
                </span>
                <p className="font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#0f172a]">
                  Pastikan semua item sudah dikemas sesuai standar kebersihan sebelum kurir/penerima tiba.
                </p>
              </div>
            </section>

            <section className="h-[282px] w-[823px] rounded-[14px] bg-white px-[45px] py-7 text-center">
              <h2 className="font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-black">
                Penerima Hari Ini
              </h2>
              <div className="mt-[26px] flex h-[87px] flex-col items-center">
                <HomeIcon />
                <p className="mt-2.5 font-[Manrope] text-[20px] font-medium leading-[27px] tracking-[-0.4px] text-black">
                  Panti Jenaka Sukarela
                </p>
              </div>
              <button
                type="button"
                className="mt-6 flex h-[53px] w-[733px] items-center justify-center gap-2 rounded-[14px] bg-[#50c878] font-[Manrope] text-[20px] font-bold leading-[27px] tracking-[-0.4px] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50c878]"
              >
                <MessageSquare className="size-7 fill-white stroke-white" strokeWidth={1.8} />
                Chat Penerima
              </button>
            </section>
          </div>

          <aside className="h-[683px] w-[434px] shrink-0 rounded-[14px] border border-[#64748b] px-8 py-[37px]">
            <h2 className="text-center font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-black">
              Pusat Notifikasi
            </h2>
            <div className="mt-8 flex flex-col gap-8">
              {notifications.map((notification, index) => (
                <NotificationCard key={notification.id} item={notification} active={index === 0} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
