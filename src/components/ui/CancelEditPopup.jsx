export function CancelEditPopup({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[340px] rounded-3xl bg-white p-6 pb-7 text-center shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#2563eb]">
          <span className="font-[Manrope] text-[20px] font-bold text-white">!</span>
        </div>

        {/* Text */}
        <h3 className="mb-7 font-[Manrope] text-[17px] font-semibold text-[#0f172a] leading-snug">
          Apakah Anda yakin ingin<br />membatalkan perubahan?
        </h3>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full bg-transparent py-3 font-[Manrope] text-[15px] font-medium text-[#374151] transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Tidak
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[#f97316] py-3 font-[Manrope] text-[15px] font-bold text-white transition-colors hover:bg-[#ea580c] cursor-pointer"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
}
