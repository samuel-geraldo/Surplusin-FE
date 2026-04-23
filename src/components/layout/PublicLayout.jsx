import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';

export function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-[calc(100svh-4rem)]">
        <Outlet />
      </main>
    </>
  );
}
