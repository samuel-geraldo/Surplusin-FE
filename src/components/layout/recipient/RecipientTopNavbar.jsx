import { UserRound } from 'lucide-react';
import { Link, useMatches } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

function getActivePageTitle(matches) {
  const matchedRoute = [...matches]
    .reverse()
    .find((match) => match.handle?.pageTitle);

  return matchedRoute?.handle?.pageTitle ?? 'Recipient';
}

export function RecipientTopNavbar() {
  const matches = useMatches();
  const pageTitle = getActivePageTitle(matches);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <div className="flex h-12 items-center justify-between gap-4 px-5 pr-7 sm:h-[72px] sm:px-8 sm:pr-10 md:h-14">
        <div className="min-w-0">
          <h1 className="truncate text-[18px] font-bold tracking-[-0.02em] text-text translate-x-4 sm:text-[26px] md:text-[20px]">
            {pageTitle}
          </h1>
        </div>

        <Link
          to={ROUTES.RECIPIENT.PROFILE}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-muted shadow-sm transition-colors duration-200 hover:border-primary/20 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary -translate-x-6"
          aria-label="Recipient profile"
        >
          <UserRound className="size-5" strokeWidth={2.1} />
        </Link>
      </div>
    </header>
  );
}
