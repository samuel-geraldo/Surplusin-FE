import { DashboardSidebar } from './DashboardSidebar';
import { TemporaryNavbar } from './TemporaryNavbar';

export function RecipientPageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-[#eef0f3] md:flex">
      <DashboardSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <TemporaryNavbar title={title} />
        <main className="flex-1 px-3 py-4 sm:px-5 sm:py-5">{children}</main>
      </div>
    </div>
  );
}
