import { Outlet } from 'react-router-dom';
import { RetailerSidebar } from './RetailerSidebar';
import { RetailerTopNavbar } from './RetailerTopNavbar';

export function RetailerLayout() {
  return (
    <div className="min-h-screen bg-[#f3f3f6]">
      <RetailerSidebar />
      <div className="ml-[61px] flex min-w-0 flex-1 flex-col">
        <RetailerTopNavbar />
        <main className="flex-1 bg-[#f3f3f6] pt-[77px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
