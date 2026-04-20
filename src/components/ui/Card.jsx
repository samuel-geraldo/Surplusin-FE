import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border bg-surface p-8 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
