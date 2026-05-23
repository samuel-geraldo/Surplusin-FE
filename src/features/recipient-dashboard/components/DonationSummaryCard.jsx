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
        'relative flex h-32 items-center gap-4 overflow-hidden rounded-2xl bg-white px-4 sm:px-2 py-4',
        'border-l-4',
        isBlue ? 'border-l-[#1F66F4]' : 'border-l-[#FF6600]',
      )}
      style={{ boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
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
        style={{ marginLeft: '1rem' }}
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
                'font-[Manrope] text-[26px] font-extrabold leading-tight',
                isBlue ? 'text-[#1F66F4]' : 'text-[#FF6600]',
              )}
            >
              {count} Donasi
            </p>
            <p 
              className={cn(
                "font-[Manrope] text-[14px] font-medium",
                isBlue ? "text-[#1F66F4]" : "text-[#FF6600]"
              )}
            >
              {label}
            </p>
          </>
        )}
      </div>
    </article>
  );
}
