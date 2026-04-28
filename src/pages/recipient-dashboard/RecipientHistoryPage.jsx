import { RecipientPageLayout, SummaryCard } from '@/features/recipient-dashboard/components';
import {
  recipientDonationHistory,
  recipientHistorySummary,
} from '@/features/recipient-dashboard/data/mockRecipientDashboardData';

export default function RecipientHistoryPage() {
  return (
    <RecipientPageLayout title="Riwayat Penerima">
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {recipientHistorySummary.map((card) => (
            <SummaryCard key={card.id} {...card} />
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-h4 font-semibold text-text">Riwayat Penerima Donasi</h2>
          <div className="space-y-2">
            {recipientDonationHistory.map((history) => (
              <article
                key={history.id}
                className="grid items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-sm sm:grid-cols-[auto_1fr_auto]"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-green-normal text-sm font-bold text-white">
                  {history.id}
                </div>
                <div>
                  <p className="text-body2 font-semibold text-text">{history.storeName}</p>
                  <p className="text-label text-text-muted">{history.locationAndMenu}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-h4 font-medium text-text">{history.portions}</p>
                  <p className="text-caption text-text-muted">{history.dateAndCount}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </RecipientPageLayout>
  );
}
