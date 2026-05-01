import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function PublicNavbar({ actions = null }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-300',
        isScrolled
          ? 'border-[#e2e8f0]/80 bg-background/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] supports-[backdrop-filter]:bg-background/75 supports-[backdrop-filter]:backdrop-blur-md'
          : 'border-transparent bg-background',
      )}
    >
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-7">
        <Link
          to={ROUTES.HOME}
          className="whitespace-nowrap font-['Manrope',sans-serif] text-2xl font-extrabold tracking-[-0.64px] text-[#50c878] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#50c878]"
        >
          SurplusIn
        </Link>
        {actions}
      </div>
    </nav>
  );
}
