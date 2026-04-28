import { Search } from 'lucide-react';
import { Select } from '@/components/ui';

export function DonationFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  typeOptions,
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_240px]">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari toko, jenis makanan, dll..."
          className="h-[45px] w-full rounded-lg border border-[#94a3b8] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-normal"
        />
      </label>

      <div className="flex items-center gap-2">
        <span className="text-label font-semibold text-text">Jenis Makanan:</span>
        <Select
          className="w-full"
          options={typeOptions}
          value={selectedType}
          onChange={onTypeChange}
          placeholder="Semua"
        />
      </div>
    </div>
  );
}
