import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function AuthHeader({ showHelp = true }) {
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
    <header
      className={cn(
        'sticky top-0 z-50 flex w-full items-center justify-between gap-4 border-b px-4 py-[28px] transition-[background-color,border-color,box-shadow] duration-300 sm:px-6 lg:px-7',
        isScrolled
          ? 'border-[#e2e8f0]/80 bg-background/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] supports-[backdrop-filter]:bg-background/75 supports-[backdrop-filter]:backdrop-blur-md'
          : 'border-[#e2e8f0]/80 bg-background/80 shadow-[0_8px_24px_rgba(15,23,42,0.06)] supports-[backdrop-filter]:bg-background/75 supports-[backdrop-filter]:backdrop-blur-md',
      )}
    >
      <Link
        to={ROUTES.HOME}
        className="whitespace-nowrap text-2xl font-extrabold leading-none tracking-[-0.64px] text-green-normal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
      >
        SurplusIn
      </Link>
      {showHelp && (
        <Link
          to={ROUTES.FAQ}
          className="text-[18px] font-medium leading-none text-[#0f172a] transition-colors hover:text-green-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
        >
          Bantuan
        </Link>
      )}
    </header>
  );
}
