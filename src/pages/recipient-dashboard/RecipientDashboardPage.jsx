import { useDonationSummary } from '@/features/recipient-dashboard/hooks/useDonationSummary';
import { useDonations } from '@/features/recipient-dashboard/hooks/useDonations';
import { DonationSummaryCard } from '@/features/recipient-dashboard/components/DonationSummaryCard';
import { DonationListCard } from '@/features/recipient-dashboard/components/DonationListCard';
import { Select } from '@/components/ui/Select';
import { Search } from 'lucide-react';

const BOX_ICON = '/recipient_retailer icon/basic-icon/box.svg';
const TRUCK_ICON = '/recipient_retailer icon/basic-icon/truck.svg';

export default function RecipientDashboardPage() {
  const { data, isLoading, error } = useDonationSummary();
  const { 
    data: donations, 
    search, 
    setSearch, 
    category, 
    setCategory, 
    categories 
  } = useDonations();

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 sm:px-8 sm:pt-8 lg:px-12 lg:pt-10" style={{ marginTop: '2rem' }}>
      {/* ── Summary Cards ── */}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-[Manrope] text-sm text-red-600">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10" style={{ marginRight: '5rem', marginLeft: '5rem' }}>
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
      <section className="mt-6 flex flex-col gap-6" style={{ marginLeft: '2rem', marginRight: '2rem' }}>
        <h2 className="font-[Manrope] text-[22px] font-bold text-text">
          Daftar Donasi yang Tersedia
        </h2>

        {/* ── Filter Controls ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
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
          <div className="flex items-center gap-3">
            <span className="shrink-0 font-[Manrope] text-[15px] font-bold text-[#0f172a]">
              Jenis Makanan:
            </span>
            <div className="w-[200px]">
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
              <DonationListCard key={item.id} data={item} />
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
