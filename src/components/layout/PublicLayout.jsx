import { Outlet, useMatches } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

export function PublicLayout() {
  const matches = useMatches();
  const navbarActions = matches.findLast((match) => match.handle?.publicNavbarActions)?.handle
    .publicNavbarActions;

  return (
    <>
      <PublicNavbar actions={navbarActions} />
      <main className="min-h-[calc(100svh-4rem)]">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
