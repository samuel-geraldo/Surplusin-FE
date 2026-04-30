import { cn } from '@/lib/utils';

/**
 * Kartu ringkasan di bagian atas Recipient Dashboard.
 *
 * @param {{
 *   icon: string,          // path ke SVG dari folder public
 *   count: number | null,  // angka yang ditampilkan (null = loading)
 *   label: string,         // label deskripsi di bawah angka
 *   accentColor: 'blue' | 'orange',
 *   isLoading?: boolean,
 * }} props
 */
export function DonationSummaryCard({ icon, count, label, accentColor, isLoading }) {
  const isBlue = accentColor === 'blue';

  return (
    <article
      className={cn(
        'relative h-28 flex items-center gap-4 overflow-hidden rounded-2xl bg-white px-6 py-4 shadow-sm',
        'border-l-4',
        isBlue ? 'border-l-[#1F66F4]' : 'border-l-[#FF6600]',
      )}
    >
      {/* Decorative background glow */}
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.07] blur-xl',
          isBlue ? 'bg-[#1F66F4]' : 'bg-[#FF6600]',
        )}
      />

      {/* Icon */}
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="h-12 w-12 shrink-0"
      />

      {/* Text */}
      <div>
        {isLoading ? (
          <>
            <div className="mb-1.5 h-6 w-24 animate-pulse rounded-md bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-slate-100" />
          </>
        ) : (
          <>
            <p
              className={cn(
                'font-[Manrope] text-[22px] font-extrabold leading-tight',
                isBlue ? 'text-[#1F66F4]' : 'text-[#FF6600]',
              )}
            >
              {count} Donasi
            </p>
            <p className="font-[Manrope] text-[13px] font-medium text-text-muted">
              {label}
            </p>
          </>
        )}
      </div>
    </article>
  );
}
