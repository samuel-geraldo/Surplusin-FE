import { Outlet, useMatches } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { cn } from '@/lib/utils';

export function PublicLayout() {
  const matches = useMatches();
  const navbarActions = matches.findLast((match) => match.handle?.publicNavbarActions)?.handle
    .publicNavbarActions;
  const isTallNavbar = matches.some((match) => match.handle?.publicNavbarTall);

  return (
    <>
      <PublicNavbar actions={navbarActions} tall={isTallNavbar} />
      <main className={cn(isTallNavbar ? 'min-h-[calc(100svh-80px)]' : 'min-h-[calc(100svh-4rem)]')}>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}
