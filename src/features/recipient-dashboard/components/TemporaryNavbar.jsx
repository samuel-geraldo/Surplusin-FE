import { UserCircle2 } from 'lucide-react';

export function TemporaryNavbar({ title }) {
  return (
    <header className="border-b border-border bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-h4 font-bold text-text">{title}</h1>
        <button
          type="button"
          className="rounded-full text-slate-500 transition hover:text-slate-700"
          aria-label="Profil pengguna"
        >
          <UserCircle2 className="size-7" />
        </button>
      </div>
    </header>
  );
}
