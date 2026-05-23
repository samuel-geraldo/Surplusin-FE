import { Outlet } from 'react-router-dom';
import { RecipientSidebar } from './RecipientSidebar';
import { RecipientTopNavbar } from './RecipientTopNavbar';

export function RecipientLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <RecipientSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <RecipientTopNavbar />

        <main className="flex-1 px-5 py-5 sm:px-8 sm:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
