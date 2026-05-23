import { useDonationSummary } from '@/features/recipient-dashboard/hooks/useDonationSummary';
import { useDonations } from '@/features/recipient-dashboard/hooks/useDonations';
import { DonationSummaryCard } from '@/features/recipient-dashboard/components/DonationSummaryCard';
import { DonationListCard } from '@/features/recipient-dashboard/components/DonationListCard';
import { Select } from '@/components/ui/Select';
import { Search } from 'lucide-react';

const BOX_ICON = '/recipient_retailer icon/basic-icon/box.svg';
const TRUCK_ICON = '/recipient_retailer icon/basic-icon/truck.svg';

export default function RecipientDashboardPage() {
  const { data, isLoading, error, claimDonation } = useDonationSummary();
  const {
    data: donations,
    search,
    setSearch,
    category,
    setCategory,
    categories,
    removeDonation,
  } = useDonations();

  // Dipanggil setelah user tekan Oke di popup sukses
  const handleClaimed = (donationId) => {
    removeDonation(donationId);  // hapus card dari list
    claimDonation();             // update angka summary
  };

  return (
    <div
      className="mt-6 flex flex-col gap-6 px-6 pt-4 sm:mt-8 sm:px-8 sm:pt-6 lg:mt-10 lg:px-12 lg:pt-8"
      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', paddingTop: '2.5rem' }}
    >
      {/* ── Summary Cards ── */}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-[Manrope] text-sm text-red-600">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-10">
          <DonationSummaryCard
            icon={BOX_ICON}
            count={data?.available ?? null}
            label="Tersedia di sekitarmu"
            accentColor="blue"
            isLoading={isLoading}
          />
          <DonationSummaryCard
            icon={TRUCK_ICON}
            count={data?.claimed ?? null}
            label="Telah diklaim"
            accentColor="orange"
            isLoading={isLoading}
          />
        </div>
      )}

      {/* ── Daftar Donasi Section ── */}
      <section
        className="mt-6 flex flex-col gap-5 sm:gap-6"
      >
        <h2 className="font-[Manrope] text-[22px] font-semibold text-text sm:text-[26px]">
          Daftar Donasi yang Tersedia
        </h2>

        {/* ── Filter Controls ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start md:gap-10">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <div
              className="pointer-events-none absolute inset-y-0 flex items-center"
              style={{ left: '1rem' }}
            >
              <Search className="size-5 text-[#64748b]" strokeWidth={2} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari toko, jenis makanan, dll..."
              style={{ paddingLeft: '2.75rem' }}
              className="h-[46px] w-full rounded-xl border border-[#94a3b8] bg-transparent pr-4 font-[Manrope] text-[15px] font-medium text-text placeholder:text-[#64748b] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:w-auto">
            <span className="shrink-0 font-[Manrope] text-[15px] font-bold text-[#0f172a]">
              Jenis Makanan:
            </span>
            <div className="w-full sm:w-[220px]">
              <Select
                options={categories}
                value={category}
                onChange={setCategory}
                placeholder="Pilih kategori"
              />
            </div>
          </div>
        </div>

        {/* ── List Donasi ── */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {donations.length > 0 ? (
            donations.map((item) => (
              <DonationListCard
                key={item.id}
                data={item}
                onClaimed={() => handleClaimed(item.id)}
              />
            ))
          ) : (
            <p className="col-span-full py-10 text-center font-[Manrope] text-text-muted">
              Tidak ada donasi yang cocok dengan pencarian.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
