import { Navigate, Outlet } from 'react-router-dom';
import { STORAGE_KEYS, ROUTES } from '@/lib/constants';

/**
 * ProtectedRoute — Mengecek apakah user sudah login dan punya role yang sesuai.
 *
 * Jika belum login → redirect ke halaman Auth.
 * Jika role tidak sesuai → redirect ke halaman utama.
 *
 * @param {{ allowedRoles: string[] }} props
 */
export function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  // Belum login → redirect ke auth
  if (!token) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  // Cek role user dari localStorage
  let user = null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) user = JSON.parse(stored);
  } catch {
    // JSON parse error — anggap belum login
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  // Jika allowedRoles ditentukan, cek apakah role user termasuk
  if (allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  // User terautentikasi dan role sesuai → render child routes
  return <Outlet />;
}
