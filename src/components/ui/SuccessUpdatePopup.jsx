export function SuccessUpdatePopup({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div
        className="flex w-full max-w-[340px] flex-col items-center justify-center rounded-3xl p-8 text-center shadow-2xl"
        style={{ backgroundColor: '#d0f0d7' }}
      >
        {/* Icon */}
        <div
          className="mb-5 flex items-center justify-center rounded-full"
          style={{ width: 64, height: 64, backgroundColor: '#50c878' }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Text */}
        <h3
          className="font-[Manrope] font-semibold text-[#0f172a]"
          style={{ fontSize: '22px', lineHeight: 1.3 }}
        >
          Perubahan berhasil<br />disimpan!
        </h3>
      </div>
    </div>
  );
}
