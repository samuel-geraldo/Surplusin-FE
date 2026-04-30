import { useDonationSummary } from '@/features/recipient-dashboard/hooks/useDonationSummary';
import { DonationSummaryCard } from '@/features/recipient-dashboard/components/DonationSummaryCard';

const BOX_ICON = '/recipient_retailer icon/basic-icon/box.svg';
const TRUCK_ICON = '/recipient_retailer icon/basic-icon/truck.svg';

export default function RecipientDashboardPage() {
  const { data, isLoading, error } = useDonationSummary();

  return (
    <div className="flex  flex-col gap-6 px-2 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10" style={{ marginTop: '2rem', marginRight: '5rem', marginLeft: '5rem' }}>
      {/* ── Summary Cards ── */}
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-[Manrope] text-sm text-red-600">
          {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
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

      {/* ── Placeholder untuk section berikutnya ── */}
      {/* TODO: Tambahkan daftar donasi, peta, dll. di sini */}
    </div>
  );
}
