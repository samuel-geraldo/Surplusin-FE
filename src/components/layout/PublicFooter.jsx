import { Link } from 'react-router-dom';
import { Copyright, createLucideIcon, Mail } from 'lucide-react';

const Linkedin = createLucideIcon('linkedin', [
  ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z', key: 'c2jq9f' }],
  ['rect', { width: '4', height: '12', x: '2', y: '9', key: 'mk3on5' }],
  ['circle', { cx: '4', cy: '4', r: '2', key: 'bt5ra8' }],
]);

const Instagram = createLucideIcon('instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: '2e1cvw' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: '9exkf1' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'r4j83e' }],
]);

const footerLinkClass =
  "w-fit max-w-full whitespace-nowrap transition-colors hover:text-[#50c878] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#50c878]";
const socialLinkClass =
  "flex min-h-[24px] w-fit max-w-full min-w-0 items-center gap-[6px] overflow-hidden font-['Manrope',sans-serif] text-sm font-normal text-[#0f172a] transition-colors hover:text-[#50c878] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#50c878] sm:text-base";

export function PublicFooter() {
  return (
    <footer className="w-full bg-background">
      <div className="grid w-full grid-cols-1 gap-7 px-4 py-4 sm:px-6 sm:py-6 md:min-h-[155px] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-10 lg:px-7 lg:py-7">
        <nav
          aria-label="Footer navigation"
          className="flex min-w-0 flex-col items-start justify-center gap-4 font-['Manrope',sans-serif] text-sm font-normal text-[#0f172a] sm:text-base md:gap-5"
        >
          <Link to="#" className={footerLinkClass}>
            Kebijakan Privasi
          </Link>
          <Link to="#" className={footerLinkClass}>
            Syarat & Ketentuan
          </Link>
          <Link to="#" className={footerLinkClass}>
            Pusat bantuan
          </Link>
        </nav>

        <div className="order-3 flex min-w-0 items-center gap-[4px] font-['Manrope',sans-serif] text-sm font-normal text-[#0f172a] sm:text-base md:order-none md:self-end md:justify-self-center">
          <Copyright className="size-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">2026. Surplusin.</span>
        </div>

        <address className="flex min-w-0 flex-col items-start justify-center gap-4 not-italic md:items-start md:justify-self-end">
          <a
            href="https://www.linkedin.com/in/surplusin"
            className={socialLinkClass}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn SurplusIn"
          >
            <Linkedin className="size-4 shrink-0 sm:size-5" aria-hidden="true" />
            <span className="min-w-0 truncate">SurplusIn</span>
          </a>
          <a
            href="https://www.instagram.com/surplusin"
            className={socialLinkClass}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram SurplusIn"
          >
            <Instagram className="size-4 shrink-0 sm:size-5" aria-hidden="true" />
            <span className="min-w-0 truncate">SurplusIn</span>
          </a>
          <a href="mailto:info@surplusin.com" className={socialLinkClass} aria-label="Email info@surplusin.com">
            <Mail className="size-4 shrink-0 sm:size-5" aria-hidden="true" />
            <span className="min-w-0 break-words">info@surplusin.com</span>
          </a>
        </address>
      </div>
    </footer>
  );
}
