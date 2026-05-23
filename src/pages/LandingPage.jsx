import { createElement, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { createLandingVariants, viewportOnce } from '@/lib/animations/landingMotion';
import aboutImage from '@/assets/about.png';
import heroImage from '@/assets/hero.png';
import { Folder, Leaf, Truck, Users, Zap } from 'lucide-react';

const Motion = motion;

const pillars = [
  {
    title: 'Rapid Logging',
    body: 'Pencatatan inventaris dalam hitungan detik. Meminimalisir waktu administrasi saat operasional sibuk.',
    action: 'Pelajari Rapid Logging',
    icon: Zap,
  },
  {
    title: 'Smart Directory',
    body: 'Hubungkan surplus Anda dengan jaringan mitra penyalur terdekat secara otomatis berdasarkan jenis dan durasi kadaluarsa makanan',
    action: 'Temukan Mitra',
    icon: Folder,
  },
  {
    title: 'Handover Tracking',
    body: 'Pantau pergerakan makanan dari pintu nada hingga ke tangan penerima dengan sistem pelacakan digital yang transparan dan aman.',
    action: 'Pantau Distribusi',
    icon: Truck,
  },
];

const values = [
  { label: 'Reduksi karbon aktif', icon: Leaf },
  { label: 'Pemberdayaan komunitas', icon: Users },
  { label: 'Distribusi kecepatan tinggi', icon: Zap },
];

const metrics = [
  { value: '15.000+', label: 'Porsi Diselamatkan' },
  { value: '450+', label: 'Mitra' },
  { value: '15 Menit', label: 'Rata-rata Respon Mitra' },
];

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function LandingIcon({ icon, size = 'h-7 w-7', className = '' }) {
  return createElement(icon, {
    'aria-hidden': 'true',
    className: `${size} text-[#059669] ${className}`,
    strokeWidth: 2.5,
  });
}

function SlotMetricValue({ value, reducedMotion }) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportOnce);

  if (reducedMotion) {
    return (
      <strong className="block text-[40px] font-extrabold leading-none sm:text-5xl">
        {value}
      </strong>
    );
  }

  return (
    <strong
      ref={ref}
      className="flex justify-center text-[40px] font-extrabold leading-none tabular-nums sm:text-5xl"
      aria-label={value}
    >
      {value.split('').map((character, index) => {
        if (!/\d/.test(character)) {
          return (
            <span key={`${character}-${index}`} className="inline-block">
              {character === ' ' ? '\u00A0' : character}
            </span>
          );
        }

        return (
          <span
            key={`${character}-${index}`}
            className="slot-digit inline-block h-[1em] overflow-hidden"
            aria-hidden="true"
          >
            <span
              className={`flex flex-col will-change-transform ${isInView ? 'slot-digit-track' : ''}`}
              style={{
                animationDelay: `${0.04 * index}s`,
                animationDuration: `${0.62 + index * 0.035}s`,
              }}
            >
              {DIGITS.map((digit) => (
                <span key={digit} className="h-[1em] leading-none">
                  {digit}
                </span>
              ))}
              <span className="h-[1em] leading-none">{character}</span>
            </span>
          </span>
        );
      })}
    </strong>
  );
}

export function LandingNavbarActions() {
  return (
    <div className="flex items-center gap-4 sm:gap-10">
      <a
        href="#tentang-kami"
        className="hidden whitespace-nowrap font-['Manrope',sans-serif] text-base font-medium text-black transition-colors hover:text-[#50c878] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#50c878] sm:inline-flex sm:text-lg"
      >
        Tentang Kami
      </a>
      <Link
        to={ROUTES.AUTH}
        className="inline-flex min-h-[40px] items-center justify-center whitespace-nowrap rounded-[16px] bg-[#ff6600] px-4 font-['Manrope',sans-serif] text-base font-extrabold text-white transition-[background-color,box-shadow,transform] hover:bg-[#ff7a1f] hover:shadow-[0_10px_24px_rgba(255,102,0,0.22)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6600] sm:min-h-[46px] sm:px-6 sm:text-lg"
      >
        Daftar Sekarang
      </Link>
    </div>
  );
}

function IconTile({
  icon,
  tileSize = 'h-12 w-12',
  iconSize = 'h-7 w-7',
  className = '',
  iconMotion,
}) {
  return (
    <Motion.span
      className={`inline-flex ${tileSize} shrink-0 items-center justify-center rounded-xl bg-green-light-active ${className}`}
      animate={iconMotion}
      variants={{
        hover: {
          scale: 1.06,
          rotate: -2,
          boxShadow: '0 12px 28px rgba(5, 150, 105, 0.18)',
          transition: { duration: 0.22, ease: 'easeOut' },
        },
      }}
    >
      <LandingIcon icon={icon} size={iconSize} />
    </Motion.span>
  );
}

function StaticReportChart() {
  return (
    <div className="relative mx-auto mt-7 grid h-44 w-44 place-items-center sm:h-56 sm:w-56">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
        />
        <path
          d="M 60 10 A 50 50 0 0 1 86.3 102.6"
          fill="none"
          stroke="#b45309"
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute grid h-32 w-32 place-items-center rounded-full bg-white sm:h-40 sm:w-40">
        <div>
          <strong className="block text-3xl font-extrabold leading-none text-text sm:text-4xl">
            41.2%
          </strong>
          <span className="mt-2 block text-xs font-bold text-text-muted sm:text-sm">
            Food Waste Ratio
          </span>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ variants }) {
  const reducedMotion = useReducedMotion();

  return (
    <Motion.div
      className="absolute left-1/2 top-1/2 w-[78%] max-w-[520px] rounded-xl bg-white px-5 py-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.18)] [transform-style:preserve-3d] sm:px-10 sm:py-12"
      variants={variants.reportCardEntrance}
      initial="hidden"
      animate="visible"
    >
      <Motion.div
        animate={reducedMotion ? undefined : variants.reportCardFloat}
        className="relative overflow-hidden rounded-[inherit]"
      >
        <Motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-green-normal/45 to-transparent"
          animate={reducedMotion ? undefined : { x: ['0%', '320%'] }}
          transition={{ delay: 1.4, duration: 1.1, ease: 'easeOut' }}
        />
        <p className="text-base font-extrabold text-text sm:text-lg">Laporan Nasional</p>
        <StaticReportChart />
        <p className="mx-auto mt-8 max-w-[360px] text-xs font-semibold leading-relaxed text-text-muted sm:text-sm">
          &ldquo;Indonesia membuang jutaan ton makanan setiap tahunnya. Kami hadir untuk menekan angka ini hingga nol.&rdquo;
        </p>
      </Motion.div>
    </Motion.div>
  );
}

function HeroVisual({ variants }) {
  return (
    <div className="relative mx-auto w-full max-w-[720px] [perspective:1200px]">
      <Motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 rounded-[2.75rem] bg-[radial-gradient(circle_at_55%_45%,rgba(80,200,120,0.28),transparent_58%)] blur-2xl"
        variants={variants.heroGlow}
        initial="hidden"
        animate="visible"
      />
      <Motion.div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-slate-200 shadow-sm sm:rounded-[2.5rem]"
        variants={variants.heroImageReveal}
        initial="hidden"
        animate="visible"
      >
        <img
          src={heroImage}
          alt=""
          className="h-full w-full object-cover opacity-55"
        />
        <Motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-white/25"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 0.45, duration: 0.65, ease: 'easeOut' }}
        />
        <ReportCard variants={variants} />
      </Motion.div>
    </div>
  );
}

function HeroTitleLine({ children, variants }) {
  return (
    <Motion.span className="block overflow-hidden" variants={variants.heroTitleMask}>
      <Motion.span className="inline-block will-change-transform" variants={variants.heroTitleItem}>
        {children}
      </Motion.span>
    </Motion.span>
  );
}

function HeroSection({ variants, reducedMotion }) {
  const navigate = useNavigate();
  return (
    <section className="overflow-hidden bg-[#f3f3f6] px-5 py-14 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
        <Motion.div
          className="max-w-[620px]"
          variants={variants.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <Motion.div
            variants={variants.heroBadge}
            className="inline-flex items-center gap-2 rounded-xl bg-green-light-active px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-green-dark"
          >
            <Motion.span
              animate={reducedMotion ? undefined : { rotate: [0, -7, 0], scale: [1, 1.08, 1] }}
              transition={{ delay: 0.16, duration: 0.5, ease: 'easeOut' }}
            >
              <LandingIcon icon={Leaf} size="h-5 w-5" />
            </Motion.span>
            Sustainability First
          </Motion.div>
          <Motion.h1
            variants={variants.heroTitleMask}
            className="mt-6 text-[42px] font-extrabold leading-[1.05] text-black sm:text-[56px] lg:text-[64px]"
          >
            <HeroTitleLine variants={variants}>Selamatkan Makanan</HeroTitleLine>
            <Motion.span className="block overflow-hidden" variants={variants.heroTitleMask}>
              <Motion.span className="inline-block will-change-transform" variants={variants.heroTitleItem}>
                dalam{' '}
                <Motion.span className="inline-block text-primary" variants={variants.heroHighlight}>
                  60 Menit
                </Motion.span>
              </Motion.span>
            </Motion.span>
          </Motion.h1>
          <Motion.p
            variants={variants.heroDescription}
            className="mt-5 max-w-[560px] text-base font-medium leading-relaxed text-text-muted sm:text-lg"
          >
            Platform logistik hulu-ke-hilir untuk mengurangi pemborosan makanan melalui sistem pencatatan kilat dan distribusi mitra strategis yang terintegrasi secara real-time.
          </Motion.p>
          <Motion.div
            variants={variants.heroCta}
            className="mt-10 inline-flex rounded-2xl"
          >
            <Motion.div
              whileHover={reducedMotion ? undefined : { y: -3, scale: 1.015 }}
              whileTap={reducedMotion ? undefined : { y: 1, scale: 0.99 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="rounded-2xl"
            >
              <Button
                type="button"
                size="md"
                className="rounded-2xl px-8 text-lg sm:px-10"
                onClick={() => navigate(ROUTES.AUTH)}
              >
                Mulai Sekarang
              </Button>
            </Motion.div>
          </Motion.div>
        </Motion.div>
        <HeroVisual variants={variants} />
      </div>
    </section>
  );
}

function PillarsSection({ variants, reducedMotion }) {
  return (
    <section className="overflow-hidden bg-white px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1300px]">
        <Motion.div
          className="max-w-4xl"
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Tiga Pilar Solusi SurplusIn</h2>
          <p className="mt-4 text-sm font-semibold text-text-muted sm:text-base">
            Teknologi terintegrasi untuk memastikan setiap gram surplus makanan kembali memiliki manfaat
          </p>
        </Motion.div>
        <Motion.div
          className="mt-8 grid gap-8 md:grid-cols-3"
          variants={variants.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {pillars.map((pillar) => (
            <Motion.article
              key={pillar.title}
              className="group relative flex min-h-[310px] flex-col overflow-hidden border border-transparent bg-[#f3f3f6] p-8 sm:p-10"
              variants={{ ...variants.cardReveal, hover: variants.cardHover }}
              whileHover="hover"
              whileTap={reducedMotion ? undefined : { y: -2 }}
            >
              <Motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(80,200,120,0.14),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                variants={{ hover: { opacity: 1 } }}
              />
              <div className="relative flex min-h-[310px] flex-col">
                <IconTile icon={pillar.icon} />
                <h3 className="mt-10 text-xl font-extrabold text-text sm:text-2xl">{pillar.title}</h3>
                <p className="mt-5 text-base font-medium leading-relaxed text-text-muted">{pillar.body}</p>
                <button type="button" className="mt-auto pt-10 text-left text-base font-semibold text-text-muted transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  {pillar.action} &rarr;
                </button>
              </div>
            </Motion.article>
          ))}
        </Motion.div>
      </div>
    </section>
  );
}

function AboutImage({ variants }) {
  return (
    <Motion.img
      src={aboutImage}
      alt="Tim SurplusIn memeriksa inventaris makanan"
      loading="lazy"
      className="h-full min-h-[360px] w-full rounded-2xl object-cover sm:min-h-[520px]"
      variants={variants.fromLeft}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    />
  );
}

function AboutSection({ variants }) {
  return (
    <section id="tentang-kami" className="scroll-mt-24 overflow-hidden bg-white px-5 pb-16 sm:px-8 lg:pb-20">
      <div className="mx-auto max-w-[1300px]">
        <Motion.h2
          className="text-3xl font-extrabold text-text"
          variants={variants.fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          Tentang Kami
        </Motion.h2>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <AboutImage variants={variants} />
          <Motion.div
            variants={variants.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Motion.h3
              variants={variants.fromRight}
              className="text-[38px] font-extrabold leading-[1.08] text-[#0f172a] sm:text-[56px] lg:text-[64px]"
            >
              Misi Sosial Mengurangi Limbah Pangan.
            </Motion.h3>
            <Motion.p
              variants={variants.fadeUp}
              className="mt-7 text-base font-medium leading-relaxed text-text-muted sm:text-lg"
            >
              SurplusIn hadir untuk menjawab tantangan krisis pangan di tengah melimpahnya limbah makanan. Kami membangun jembatan antara retail atau pelaku usaha makanan dengan lembaga social yang membutuhkan. Sistem kami akan memastikan setiap gram makanan yang terselamatkan sampai ke tangan yang tepat dalam kondisi prima.
            </Motion.p>
            <Motion.ul className="mt-8 space-y-5" variants={variants.staggerContainer}>
              {values.map((value) => (
                <Motion.li
                  key={value.label}
                  variants={variants.fadeUp}
                  whileHover="hover"
                  className="flex items-center gap-4 text-base font-extrabold text-text-muted sm:text-lg"
                >
                  <IconTile icon={value.icon} tileSize="h-11 w-11" className="rounded-lg" />
                  <span>{value.label}</span>
                </Motion.li>
              ))}
            </Motion.ul>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}

function MetricsStrip({ variants, reducedMotion }) {
  return (
    <Motion.section
      className="overflow-hidden bg-gradient-to-r from-green-dark to-[#27623b] px-5 py-14 text-white sm:px-8 lg:py-18"
      variants={variants.fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <Motion.div
        className="mx-auto grid max-w-[1300px] gap-10 text-center md:grid-cols-3"
        variants={variants.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {metrics.map((metric) => (
          <Motion.div key={metric.label} className="text-center" variants={variants.fadeUp}>
            <SlotMetricValue value={metric.value} reducedMotion={reducedMotion} />
            <span className="mt-4 block text-sm font-extrabold uppercase tracking-wide text-white/90 sm:text-base">{metric.label}</span>
          </Motion.div>
        ))}
      </Motion.div>
    </Motion.section>
  );
}

function FinalCTASection({ variants, reducedMotion }) {
  const navigate = useNavigate();
  return (
    <section id="daftar" className="relative scroll-mt-24 overflow-hidden bg-[#f3f3f6] px-5 py-20 text-center sm:px-8 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,102,0,0.10),transparent_42%)]" />
      <Motion.div
        className="relative mx-auto max-w-3xl"
        variants={variants.staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <Motion.h2 variants={variants.fadeUp} className="text-2xl font-extrabold text-text sm:text-3xl">
          Siap Mengubah Surplus Menjadi Berkah?
        </Motion.h2>
        <Motion.p
          variants={variants.fadeUp}
          className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-text-muted sm:text-base"
        >
          Bergabunglah dengan ratusan bisnis yang telah berkomitmen untuk mengurangi food waste di Indonesia
        </Motion.p>
        <Motion.div
          variants={variants.scaleIn}
          whileHover={reducedMotion ? undefined : { y: -3, scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { y: 1, scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="mt-10 inline-flex"
        >
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="min-h-[56px] rounded-2xl px-8 text-base hover:shadow-[0_14px_34px_rgba(255,102,0,0.28)] sm:px-10 sm:text-lg"
            onClick={() => navigate(ROUTES.AUTH)}
          >
            Daftar Sebagai Mitra
          </Button>
        </Motion.div>
      </Motion.div>
    </section>
  );
}

export default function LandingPage() {
  const reducedMotion = useReducedMotion();
  const variants = createLandingVariants(reducedMotion);

  return (
    <div className="overflow-x-hidden">
      <HeroSection variants={variants} reducedMotion={reducedMotion} />
      <PillarsSection variants={variants} reducedMotion={reducedMotion} />
      <AboutSection variants={variants} />
      <MetricsStrip variants={variants} reducedMotion={reducedMotion} />
      <FinalCTASection variants={variants} reducedMotion={reducedMotion} />
    </div>
  );
}
