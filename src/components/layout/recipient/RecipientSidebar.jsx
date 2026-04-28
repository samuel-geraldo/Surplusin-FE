import { useState } from 'react';
import { Flame, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { recipientNavigationItems } from './recipientNavigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

export function RecipientSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={cn(
        'sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border bg-surface font-[Manrope] shadow-[8px_0_24px_rgba(15,23,42,0.04)] transition-[width] duration-300 ease-in-out',
        isExpanded ? 'w-[210px]' : 'w-[60px] sm:w-[60px]',
      )}
    >
      {/* ── Logo / Toggle ── */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={cn(
          "flex h-[73px] shrink-0 items-center border-b border-border/80 transition-all duration-300",
          isExpanded ? "justify-center px-6" : "justify-center"
        )}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <div className="flex shrink-0 items-center justify-center">
          <div className="flex size-10 shrink-0 items-center justify-center text-primary transition-transform duration-200 hover:scale-105 active:scale-95">
            <Flame className="size-6" strokeWidth={2.2} />
          </div>
          <span
            className={cn(
              'whitespace-nowrap font-[Manrope] text-[22px] font-extrabold tracking-tight text-green-dark transition-all duration-300',
              isExpanded
                ? 'ml-3 w-auto translate-x-0 opacity-100'
                : 'pointer-events-none ml-0 w-0 -translate-x-2 overflow-hidden opacity-0',
            )}
          >
            {APP_NAME}
          </span>
        </div>
      </button>

      {/* ── Navigation ── */}
      <nav
        aria-label="Recipient navigation"
        className="flex flex-1 flex-col px-4 py-5"
      >
        <div className="flex w-full flex-col gap-2">
          {recipientNavigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center rounded-xl text-text-muted transition-all duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isExpanded
                      ? 'h-12 w-full justify-start gap-4 px-4 translate-x-12'
                      : 'mx-auto h-12 w-15 justify-center',
                    isActive && 'text-primary',
                  )
                }
                aria-label={item.label}
                title={!isExpanded ? item.shortLabel : undefined}
              >
                <div className="flex w-6 shrink-0 items-center justify-center">
                  <Icon
                    className="size-5 shrink-0 sm:size-[22px]"
                    strokeWidth={2.1}
                  />
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap font-[Manrope] text-[15px] font-semibold transition-all duration-300',
                    isExpanded
                      ? 'w-auto -translate-x-1 opacity-100'
                      : 'pointer-events-none w-0 -translate-x-2 overflow-hidden opacity-0',
                  )}
                >
                  {item.shortLabel}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── Logout ── */}
      <div className="flex flex-col border-t border-border/80 px-4 py-4">
        <button
          type="button"
          className={cn(
            'flex items-center rounded-xl text-red-normal transition-all duration-200 hover:-translate-y-0.5 hover:text-red-dark active:translate-y-0',
            isExpanded ? 'h-12 w-full justify-start gap-4 px-4' : 'mx-auto h-12 w-12 justify-center',
          )}
          aria-label="Keluar"
          title={!isExpanded ? 'Keluar' : undefined}
        >
          <div className="flex w-6 shrink-0 items-center justify-center">
            <LogOut className="size-5 shrink-0 sm:size-[22px]" strokeWidth={2.1} />
          </div>
          <span
            className={cn(
              'whitespace-nowrap font-[Manrope] text-[15px] font-semibold transition-all duration-300',
              isExpanded
                ? 'w-auto translate-x-0 opacity-100'
                : 'pointer-events-none w-0 -translate-x-2 overflow-hidden opacity-0',
            )}
          >
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}
