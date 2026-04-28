import { DonationCard } from './DonationCard';

export function AvailableDonationList({ donations }) {
  if (!donations.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-body2 text-text-muted">
        Belum ada donasi yang sesuai filter saat ini.
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {donations.map((donation) => (
        <DonationCard key={donation.id} donation={donation} />
      ))}
    </div>
  );
}
