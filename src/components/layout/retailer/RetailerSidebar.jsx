import { useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth/useAuthStore';
import { retailerNavigationItems } from './retailerNavigation';

export function RetailerSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/', { replace: true });
  };

  return (
    <>
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          'sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border bg-surface font-[Manrope] shadow-[8px_0_24px_rgba(15,23,42,0.04)] transition-[width] duration-700 ease-in-out',
          isExpanded ? 'w-[190px]' : 'w-[60px] sm:w-[60px]',
        )}
      >
        <div className="flex h-[57px] w-full shrink-0 items-center justify-center overflow-hidden border-b border-border/80 transition-all duration-500">
          <div className="flex shrink-0 items-center justify-center">
            <div className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-primary transition-transform duration-200 active:scale-95">
              <img src="/MainLogo.svg" alt="SurplusIn Logo" className="size-7" />
            </div>
            <span
              className={cn(
                'whitespace-nowrap font-[Manrope] text-[22px] font-extrabold tracking-tight text-green-dark transition-all duration-700',
                isExpanded
                  ? 'ml-3 w-auto -translate-x-2 opacity-100'
                  : 'pointer-events-none ml-0 w-0 overflow-hidden opacity-0',
              )}
            >
              {APP_NAME}
            </span>
          </div>
        </div>

        <nav aria-label="Retailer navigation" className="flex flex-1 flex-col overflow-hidden py-5">
          <div className="flex w-full flex-col gap-2">
            {retailerNavigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center border-l-[4px] border-transparent transition-all duration-300 hover:border-[#10b981] hover:bg-[#eaf5eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
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
            ))}
          </div>
        </nav>

        <div className="flex flex-col overflow-hidden border-t border-border/80 py-4">
          <button
            type="button"
            onClick={() => setShowLogoutPopup(true)}
            className={cn(
              'flex cursor-pointer items-center border-l-[4px] border-transparent text-red-normal transition-all duration-300 hover:border-red-500 hover:bg-red-50 hover:text-red-dark active:translate-y-0',
              isExpanded ? 'h-14 w-full justify-start gap-4 pl-[20px]' : 'h-14 w-full justify-center pr-1',
            )}
            aria-label="Keluar"
            title={!isExpanded ? 'Keluar' : undefined}
          >
            <div className="flex w-7 shrink-0 items-center justify-center">
              <img src="/recipient_retailer icon/basic-icon/logout logo.svg" alt="Logout" className="size-[24px] shrink-0 sm:size-[26px]" />
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

      {showLogoutPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[340px] rounded-3xl bg-white p-6 pb-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#2563eb]">
              <span className="font-[Manrope] text-[20px] font-bold text-white">!</span>
            </div>
            <h3 className="mb-7 font-[Manrope] text-[17px] font-semibold leading-snug text-[#0f172a]">
              Apakah Anda yakin ingin<br />keluar?
            </h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 cursor-pointer rounded-full bg-transparent py-3 font-[Manrope] text-[15px] font-medium text-[#374151] transition-colors hover:bg-slate-50"
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 cursor-pointer rounded-full bg-[#f97316] py-3 font-[Manrope] text-[15px] font-bold text-white transition-colors hover:bg-[#ea580c]"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
