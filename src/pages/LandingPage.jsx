import { createElement } from 'react';
import { Button } from '@/components/ui';
import aboutImage from '@/assets/about.png';
import heroImage from '@/assets/hero.png';
import { Folder, Leaf, Truck, Users, Zap } from 'lucide-react';

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

function LandingIcon({ icon, size = 'h-7 w-7', className = '' }) {
  return createElement(icon, {
    'aria-hidden': 'true',
    className: `${size} text-[#059669] ${className}`,
    strokeWidth: 2.5,
  });
}

function IconTile({
  icon,
  tileSize = 'h-12 w-12',
  iconSize = 'h-7 w-7',
  className = '',
}) {
  return (
    <span className={`inline-flex ${tileSize} shrink-0 items-center justify-center rounded-xl bg-green-light-active ${className}`}>
      <LandingIcon icon={icon} size={iconSize} />
    </span>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[720px] overflow-hidden rounded-[2rem] bg-slate-200 shadow-sm sm:rounded-[2.5rem]">
      <img
        src={heroImage}
        alt=""
        className="h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-white/25" />
      <ReportCard />
    </div>
  );
}

function ReportCard() {
  return (
    <div className="absolute left-1/2 top-1/2 w-[78%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white px-5 py-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.18)] sm:px-10 sm:py-12">
      <p className="text-base font-extrabold text-text sm:text-lg">Laporan Nasional</p>
      <div className="mx-auto mt-8 grid h-32 w-32 place-items-center rounded-full bg-[conic-gradient(#b45309_0_41.2%,#f1f5f9_41.2%_100%)] sm:h-40 sm:w-40">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-white sm:h-30 sm:w-30">
          <div>
            <strong className="block text-2xl font-extrabold leading-none text-text sm:text-3xl">41.2%</strong>
            <span className="mt-1 block text-[10px] font-bold text-text-muted sm:text-xs">Food Waste Ratio</span>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[360px] text-xs font-semibold leading-relaxed text-text-muted sm:text-sm">
        “Indonesia membuang jutaan ton makanan setiap tahunnya. Kami hadir untuk menekan angka ini hingga nol.”
      </p>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#f3f3f6] px-5 py-14 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="max-w-[620px]">
          <div className="inline-flex items-center gap-2 rounded-xl bg-green-light-active px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-green-dark">
            <LandingIcon icon={Leaf} size="h-5 w-5" />
            Sustainability First
          </div>
          <h1 className="mt-6 text-[42px] font-extrabold leading-[1.05] text-black sm:text-[56px] lg:text-[64px]">
            Selamatkan Makanan dalam <span className="text-primary">60 Menit</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-base font-medium leading-relaxed text-text-muted sm:text-lg">
            Platform logistik hulu-ke-hilir untuk mengurangi pemborosan makanan melalui sistem pencatatan kilat dan distribusi mitra strategis yang terintegrasi secara real-time.
          </p>
          <Button type="button" size="md" className="mt-10 rounded-2xl px-8 text-lg sm:px-10">
            Mulai Sekarang
          </Button>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1300px]">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Tiga Pilar Solusi SurplusIn</h2>
          <p className="mt-4 text-sm font-semibold text-text-muted sm:text-base">
            Teknologi terintegrasi untuk memastikan setiap gram surplus makanan kembali memiliki manfaat
          </p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="flex min-h-[310px] flex-col bg-[#f3f3f6] p-8 sm:p-10">
              <IconTile icon={pillar.icon} />
              <h3 className="mt-10 text-xl font-extrabold text-text sm:text-2xl">{pillar.title}</h3>
              <p className="mt-5 text-base font-medium leading-relaxed text-text-muted">{pillar.body}</p>
              <button type="button" className="mt-auto pt-10 text-left text-base font-semibold text-text-muted transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                {pillar.action} →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutImage() {
  return (
    <img
      src={aboutImage}
      alt="Tim SurplusIn memeriksa inventaris makanan"
      loading="lazy"
      className="h-full min-h-[360px] w-full rounded-2xl object-cover sm:min-h-[520px]"
    />
  );
}

function AboutSection() {
  return (
    <section className="bg-white px-5 pb-16 sm:px-8 lg:pb-20">
      <div className="mx-auto max-w-[1300px]">
        <h2 className="text-3xl font-extrabold text-text">Tentang Kami</h2>
        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <AboutImage />
          <div>
            <h3 className="text-[38px] font-extrabold leading-[1.08] text-[#0f172a] sm:text-[56px] lg:text-[64px]">
              Misi Sosial Mengurangi Limbah Pangan.
            </h3>
            <p className="mt-7 text-base font-medium leading-relaxed text-text-muted sm:text-lg">
              SurplusIn hadir untuk menjawab tantangan krisis pangan di tengah melimpahnya limbah makanan. Kami membangun jembatan antara retail atau pelaku usaha makanan dengan lembaga social yang membutuhkan. Sistem kami akan memastikan setiap gram makanan yang terselamatkan sampai ke tangan yang tepat dalam kondisi prima.
            </p>
            <ul className="mt-8 space-y-5">
              {values.map((value) => (
                <li key={value.label} className="flex items-center gap-4 text-base font-extrabold text-text-muted sm:text-lg">
                  <IconTile icon={value.icon} tileSize="h-11 w-11" className="rounded-lg" />
                  <span>{value.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsStrip() {
  return (
    <section className="bg-gradient-to-r from-green-dark to-[#27623b] px-5 py-14 text-white sm:px-8 lg:py-18">
      <div className="mx-auto grid max-w-[1300px] gap-10 text-center md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="text-center">
            <strong className="block text-[40px] font-extrabold leading-none sm:text-5xl">{metric.value}</strong>
            <span className="mt-4 block text-sm font-extrabold uppercase tracking-wide text-white/90 sm:text-base">{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="bg-[#f3f3f6] px-5 py-20 text-center sm:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-extrabold text-text sm:text-3xl">Siap Mengubah Surplus Menjadi Berkah?</h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-text-muted sm:text-base">
          Bergabunglah dengan ratusan bisnis yang telah berkomitmen untuk mengurangi food waste di Indonesia
        </p>
        <Button type="button" variant="secondary" size="lg" className="mt-10 rounded-2xl text-xl">
          Daftar Sebagai Mitra
        </Button>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <PillarsSection />
      <AboutSection />
      <MetricsStrip />
      <FinalCTASection />
    </main>
  );
}
