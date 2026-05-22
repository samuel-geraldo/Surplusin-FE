import { Link, useMatches } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

function getActivePageTitle(matches) {
  const matchedRoute = [...matches]
    .reverse()
    .find((match) => match.handle?.pageTitle);

  return matchedRoute?.handle?.pageTitle ?? 'Retailer Dashboard';
}

export function RetailerTopNavbar() {
  const matches = useMatches();
  const pageTitle = getActivePageTitle(matches);

  return (
    <header className="fixed left-[61px] right-0 top-0 z-30 h-[77px] border-b border-[#dddddd] bg-white">
      <div className="flex h-full items-center justify-between px-[30px]">
        <h1 className="font-[Manrope] text-[28px] font-bold leading-none tracking-[-0.56px] text-[#0f172a]">
          {pageTitle}
        </h1>
        <Link
          to={ROUTES.RETAILER.PROFILE}
          aria-label="Retailer profile"
          className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#050505] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a]"
        >
          <span className="absolute size-[22px] rounded-full bg-[#d6b08b]" />
          <span className="absolute top-[9px] size-[10px] rounded-full bg-[#111827]" />
          <span className="absolute bottom-[6px] h-[12px] w-[24px] rounded-t-full bg-[#111827]" />
        </Link>
      </div>
    </header>
  );
}
