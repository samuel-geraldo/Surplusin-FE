import { Box, HandHeart, Store, Truck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  package: Box,
  truck: Truck,
  users: Users,
  heart: HandHeart,
  store: Store,
};

const accentStyles = {
  blue: {
    border: 'border-l-blue-normal',
    iconBg: 'bg-blue-light',
    iconColor: 'text-blue-normal',
    title: 'text-blue-normal',
    subtitle: 'text-blue-normal/80',
  },
  orange: {
    border: 'border-l-orange-normal',
    iconBg: 'bg-orange-light',
    iconColor: 'text-orange-normal',
    title: 'text-orange-normal',
    subtitle: 'text-orange-normal/80',
  },
  green: {
    border: 'border-l-green-normal',
    iconBg: 'bg-green-light',
    iconColor: 'text-green-normal',
    title: 'text-green-normal',
    subtitle: 'text-green-normal/80',
  },
};

export function SummaryCard({ title, subtitle, icon = 'package', accent = 'blue' }) {
  const Icon = iconMap[icon] || Box;
  const theme = accentStyles[accent] || accentStyles.blue;

  return (
    <article
      className={cn(
        'rounded-xl border border-border border-l-4 bg-white px-5 py-4 shadow-sm',
        theme.border,
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn('rounded-lg p-2', theme.iconBg)}>
          <Icon className={cn('size-5', theme.iconColor)} />
        </div>
        <div>
          <p className={cn('text-h4 leading-tight', theme.title)}>{title}</p>
          <p className={cn('text-label', theme.subtitle)}>{subtitle}</p>
        </div>
      </div>
    </article>
  );
}
