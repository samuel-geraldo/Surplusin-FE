import { Clock3, MapPin, Package2, Utensils } from 'lucide-react';
import { Button } from '@/components/ui';
import { StatusBadge } from './StatusBadge';

function DonationMeta({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-md bg-slate-50 px-3 py-2 text-center">
      <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-green-dark">
        <IconComponent className="size-3" />
        {label}
      </div>
      <p className="text-label font-semibold text-text">{value}</p>
    </div>
  );
}

export function DonationCard({ donation }) {
  const isMeal = donation.categoryKey === 'meal';

  return (
    <article className="rounded-xl border border-border bg-white p-3 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-[108px_1fr]">
        <div
          className={`flex h-[108px] items-center justify-center rounded-lg ${
            isMeal ? 'bg-orange-light' : 'bg-blue-light'
          }`}
        >
          {isMeal ? (
            <Utensils className="size-10 text-orange-normal" />
          ) : (
            <Package2 className="size-10 text-blue-normal" />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-body1 font-bold text-text">{donation.storeName}</h3>
              <p className="text-label text-text-muted">{donation.menuDescription}</p>
            </div>
            <StatusBadge status={donation.status} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <DonationMeta icon={Package2} label="Jumlah" value={donation.quantity} />
            <DonationMeta icon={MapPin} label="Jarak" value={donation.distance} />
            <DonationMeta icon={Clock3} label="Kedaluwarsa" value={donation.expiresIn} />
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_170px]">
            <span className="inline-flex items-center justify-center rounded-md bg-[#eaf5f0] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#4d7c65]">
              {donation.category}
            </span>
            <div className="flex gap-2">
              <a
                href={donation.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl border border-green-normal px-3 py-2 text-center text-label font-bold text-green-dark transition hover:bg-green-light"
              >
                Lokasi
              </a>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-auto flex-1 rounded-xl text-body2"
              >
                Ambil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
