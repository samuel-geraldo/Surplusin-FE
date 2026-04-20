import { Link } from 'react-router-dom';
import { APP_NAME, ROUTES } from '@/lib/constants';
export function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <span className="text-h4 font-bold text-primary">{APP_NAME}</span>
        </Link>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-caption text-text-muted">
          Boilerplate
        </span>
      </div>
    </nav>
  );
}
