import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
