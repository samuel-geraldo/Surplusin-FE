import { cn } from '@/lib/utils';

const DEFAULT_CENTER = [106.8456, -6.2088];

function toLngLat(center) {
  const nextCenter = Array.isArray(center) ? center : DEFAULT_CENTER;
  return [
    Number(nextCenter[0]) || DEFAULT_CENTER[0],
    Number(nextCenter[1]) || DEFAULT_CENTER[1],
  ];
}

function buildOpenStreetMapEmbedUrl(center) {
  const [lng, lat] = center;
  const bounds = [
    lng - 0.01,
    lat - 0.01,
    lng + 0.01,
    lat + 0.01,
  ].join('%2C');

  return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function GoogleLocationMap({
  center = DEFAULT_CENTER,
  editable = false,
  className,
}) {
  const position = toLngLat(center);
  const iframeSrc = buildOpenStreetMapEmbedUrl(position);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#edf2f7]', className)}>
      <iframe
        title="OpenStreetMap"
        src={iframeSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
      />
      {editable ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-white/90 px-3 py-2 text-center font-[Manrope] text-[12px] font-semibold text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
          Gunakan pencarian alamat atau lokasi saat ini untuk mengubah titik lokasi.
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-white/90 px-3 py-2 text-center font-[Manrope] text-[12px] font-semibold text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
          Lokasi terkunci. Klik edit untuk mengubah titik lokasi.
        </div>
      )}
    </div>
  );
}
