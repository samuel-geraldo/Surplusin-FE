import { Link } from 'react-router-dom';
import { Copyright, Mail } from 'lucide-react';

const Linkedin = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function PublicFooter() {
  return (
    <footer className="bg-white flex items-center justify-between w-[1372px] mx-auto py-[40px]">
      <div className="flex flex-col items-start justify-center gap-[20px] font-['Manrope',sans-serif] text-[16px] font-normal text-[#0f172a]">
        <Link to="#" className="whitespace-nowrap hover:text-[#50c878] transition-colors">
          Kebijakan Privasi
        </Link>
        <Link to="#" className="whitespace-nowrap hover:text-[#50c878] transition-colors">
          Syarat & Ketentuan
        </Link>
        <Link to="#" className="whitespace-nowrap hover:text-[#50c878] transition-colors">
          Pusat bantuan
        </Link>
      </div>

      <div className="flex items-end justify-center self-stretch">
        <div className="flex h-full items-end justify-center gap-[4px] font-['Manrope',sans-serif] text-[16px] font-normal text-[#0f172a] whitespace-nowrap">
          <Copyright size={20} />
          <span>2026. Surplusin.</span>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center gap-[20px] w-[190.2px]">
        <a href="#" className="flex w-fit items-center gap-[4px] overflow-hidden rounded-[10px] bg-[#f3f3f6] px-[10px] py-[4px] font-['Manrope',sans-serif] text-[16px] font-normal text-[#0f172a] whitespace-nowrap hover:bg-[#e2e2e5] transition-colors">
          <Linkedin size={20} />
          <span>SurplusIn</span>
        </a>
        <a href="#" className="flex w-fit items-center gap-[4px] overflow-hidden rounded-[10px] bg-[#f3f3f6] px-[10px] py-[4px] font-['Manrope',sans-serif] text-[16px] font-normal text-[#0f172a] whitespace-nowrap hover:bg-[#e2e2e5] transition-colors">
          <Instagram size={20} />
          <span>SurplusIn</span>
        </a>
        <a href="mailto:info@surplusin.com" className="flex w-full items-center gap-[4px] overflow-hidden rounded-[10px] bg-[#f3f3f6] px-[10px] py-[4px] font-['Manrope',sans-serif] text-[16px] font-normal text-[#0f172a] whitespace-nowrap hover:bg-[#e2e2e5] transition-colors">
          <Mail size={19.2} />
          <span>info@surplusin.com</span>
        </a>
      </div>
    </footer>
  );
}
