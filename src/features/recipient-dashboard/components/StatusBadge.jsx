import { cn } from '@/lib/utils';

const labelMap = {
  available: 'Available',
  in_transit: 'In Transit',
  received: 'Received',
};

const badgeStyles = {
  available: 'bg-blue-light text-blue-normal',
  in_transit: 'bg-orange-light text-orange-normal',
  received: 'bg-green-light text-green-dark',
};

export function StatusBadge({ status = 'available', className }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide',
        badgeStyles[status] || badgeStyles.available,
        className,
      )}
    >
      {labelMap[status] || labelMap.available}
    </span>
  );
}
