import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { recipientNavigationItems } from './recipientNavigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

export function RecipientSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        'sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border bg-surface font-[Manrope] shadow-[8px_0_24px_rgba(15,23,42,0.04)] transition-[width] duration-700 ease-in-out',
        isExpanded ? 'w-[190px]' : 'w-[60px] sm:w-[60px]',
      )}
    >
      {/* ── Logo / Toggle ── */}
      <div
        className={cn(
          "flex h-[57px] w-full shrink-0 items-center justify-center border-b border-border/80 transition-all duration-500 overflow-hidden",
        )}
      >
        <div className="flex shrink-0 items-center justify-center">
          <div className="flex size-10 shrink-0 items-center justify-center text-primary transition-transform duration-200 active:scale-95 cursor-pointer">
            <img src="/MainLogo.svg" alt="SurplusIn Logo" className="size-7" />
          </div>
          <span
            className={cn(
              'whitespace-nowrap font-[Manrope] text-[22px] font-extrabold tracking-tight text-green-dark transition-all duration-700',
              isExpanded
                ? 'ml-3 w-auto opacity-100 -translate-x-2'
                : 'pointer-events-none ml-0 w-0 overflow-hidden opacity-0',
            )}
          >
            {APP_NAME}
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav
        aria-label="Recipient navigation"
        className="flex flex-1 flex-col py-5 overflow-hidden"
      >
        <div className="flex w-full flex-col gap-2">
          {recipientNavigationItems.map((item) => {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center border-l-[4px] border-transparent transition-all duration-300 hover:bg-[#eaf5eb] hover:border-[#10b981] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                    isExpanded
                      ? 'h-14 w-full justify-start gap-4 pl-[20px]'
                      : 'h-14 w-full justify-center pr-1',
                    isActive ? 'is-active' : '',
                  )
                }
                aria-label={item.label}
                title={!isExpanded ? item.shortLabel : undefined}
              >
                <div className="flex w-7 shrink-0 items-center justify-center">
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className={cn(
                      'h-[26px] w-[26px] shrink-0 transition-all duration-200',
                      // default: thicker gray, hover: green, active: green
                      '[filter:brightness(0)_invert(55%)]',
                      'group-[.is-active]:[filter:invert(48%)_sepia(62%)_saturate(450%)_hue-rotate(95deg)_brightness(90%)]',
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'whitespace-nowrap font-[Manrope] text-[15px] font-semibold transition-all duration-700',
                    'text-text-muted group-[.is-active]:text-primary',
                    isExpanded
                      ? 'w-auto opacity-100'
                      : 'pointer-events-none w-0 overflow-hidden opacity-0',
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
      <div className="flex flex-col border-t border-border/80 py-4 overflow-hidden">
        <button
          type="button"
          className={cn(
            'flex items-center border-l-[4px] border-transparent text-red-normal transition-all duration-300 hover:bg-red-50 hover:border-red-500 hover:text-red-dark active:translate-y-0 cursor-pointer',
            isExpanded ? 'h-14 w-full justify-start gap-4 pl-[20px]' : 'h-14 w-full justify-center pr-1',
          )}
          aria-label="Keluar"
          title={!isExpanded ? 'Keluar' : undefined}
        >
          <div className="flex w-7 shrink-0 items-center justify-center">
            <LogOut className="size-[24px] shrink-0 sm:size-[26px]" strokeWidth={2.1} />
          </div>
          <span
            className={cn(
              'whitespace-nowrap font-[Manrope] text-[15px] font-semibold transition-all duration-700',
              isExpanded
                ? 'w-auto opacity-100'
                : 'pointer-events-none w-0 overflow-hidden opacity-0',
            )}
          >
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}
