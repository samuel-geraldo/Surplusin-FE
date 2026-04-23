import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-white p-7 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
