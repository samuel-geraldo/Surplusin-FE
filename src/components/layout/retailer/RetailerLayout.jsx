import { Outlet } from 'react-router-dom';
import { RetailerSidebar } from './RetailerSidebar';
import { RetailerTopNavbar } from './RetailerTopNavbar';

export function RetailerLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <RetailerSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <RetailerTopNavbar />

        <main className="flex-1 px-5 py-5 sm:px-8 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
