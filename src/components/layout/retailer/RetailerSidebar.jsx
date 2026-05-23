import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { retailerNavigationItems } from './retailerNavigation';

export function RetailerSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-[61px] shrink-0 flex-col overflow-hidden border-r border-[#dddddd] bg-white font-[Manrope]">
      <div className="flex h-[77px] w-full shrink-0 items-center justify-center border-b border-[#dddddd]">
        <img src="/MainLogo.svg" alt="SurplusIn" className="h-[29px] w-[22px] shrink-0" />
      </div>

      <nav aria-label="Retailer navigation" className="flex flex-1 flex-col items-center pt-[29px]">
        <div className="flex w-full flex-col items-center gap-[26px]">
          {retailerNavigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'group flex size-6 items-center justify-center',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a]',
                  isActive ? 'is-active' : '',
                )
              }
              aria-label={item.label}
              title={item.shortLabel}
            >
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                className={cn(
                  'h-5 w-5 opacity-55',
                  'group-[.is-active]:opacity-100 group-[.is-active]:[filter:invert(47%)_sepia(27%)_saturate(989%)_hue-rotate(89deg)_brightness(93%)_contrast(89%)]',
                )}
              />
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="flex h-[86px] w-full shrink-0 items-center justify-center">
        <button
          type="button"
          className="flex size-7 items-center justify-center text-[#ff4542] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4542]"
          aria-label="Keluar"
          title="Keluar"
        >
          <LogOut className="size-7" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
