import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

export function PublicNavbar() {
  return (
    <nav className="bg-white flex items-center justify-between px-[26px] py-[18px] w-full">
      <Link
        to={ROUTES.HOME}
        className="font-['Manrope',sans-serif] font-extrabold text-[#50c878] text-[32px] tracking-[-0.64px] whitespace-nowrap"
      >
        SurplusIn
      </Link>

    </nav>
  );
}
