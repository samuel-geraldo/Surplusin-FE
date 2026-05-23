import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth/useAuthStore';

export function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const user = useAuthStore((state) => state.user);

  if (!isHydrated) {
    return null;
  }

  if (!accessToken) {
   // return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
   // return <Navigate to={ROUTES.AUTH} replace />;
  }

  return <Outlet />;
}
