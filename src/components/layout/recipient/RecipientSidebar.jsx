import { Flame } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { recipientNavigationItems } from './recipientNavigation';
import { cn } from '@/lib/utils';

export function RecipientSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[84px] shrink-0 border-r border-border bg-surface shadow-[8px_0_24px_rgba(15,23,42,0.04)] sm:w-[92px]">
      <div className="flex h-full flex-col">
        <div className="flex h-24 items-center justify-center border-b border-border/80">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Flame className="size-7" strokeWidth={2.2} />
          </div>
        </div>

        <nav
          aria-label="Recipient navigation"
          className="flex flex-1 flex-col items-center px-3 py-5"
        >
          <div className="flex w-full flex-col items-center gap-3">
          {recipientNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-background hover:text-text hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-14 sm:w-14',
                    isActive &&
                      'border-primary/15 bg-primary-light text-primary shadow-[0_8px_20px_rgba(80,200,120,0.18)]',
                  )
                }
                aria-label={item.label}
                title={item.shortLabel}
              >
                <Icon className="size-5 sm:size-[22px]" strokeWidth={2.1} />
              </NavLink>
            );
          })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
