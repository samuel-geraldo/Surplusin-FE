export function AuthDivider({ label = 'ATAU' }) {
  return (
    <div className="flex items-center gap-4 py-1 text-label font-bold text-[#64748b]">
      <span className="h-px flex-1 bg-[#d6dbe3]" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-[#d6dbe3]" />
    </div>
  );
}

