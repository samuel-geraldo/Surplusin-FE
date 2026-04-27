import { Building2, History, LayoutGrid, LogOut, Truck } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { recipientSidebarItems } from '../data/mockRecipientDashboardData';

const iconMap = {
  dashboard: LayoutGrid,
  handover: Truck,
  history: History,
  profile: Building2,
};

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[66px] flex-col items-center justify-between border-r border-border bg-white py-4 md:flex">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-green-light p-2 text-green-dark">
          <Building2 className="size-4" />
        </div>
        {recipientSidebarItems.map((item) => {
          const Icon = iconMap[item.id] || LayoutGrid;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg p-2 transition ${
                  isActive
                    ? 'bg-green-light text-green-dark'
                    : 'text-slate-500 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="size-4" />
            </NavLink>
          );
        })}
      </div>

      <button
        type="button"
        className="rounded-lg p-2 text-red-normal transition hover:bg-red-light"
      >
        <LogOut className="size-4" />
      </button>
    </aside>
  );
}
