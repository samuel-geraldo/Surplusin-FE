export function FailedUpdatePopup({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div
        className="flex w-full max-w-[340px] flex-col items-center justify-center rounded-3xl p-8 text-center shadow-2xl"
        style={{ backgroundColor: '#ffcece' }}
      >
        {/* Icon */}
        <div
          className="mb-5 flex items-center justify-center rounded-full"
          style={{ width: 64, height: 64, backgroundColor: '#ff4d4f' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        {/* Text */}
        <h3
          className="font-[Manrope] font-semibold text-[#0f172a]"
          style={{ fontSize: '22px', lineHeight: 1.3 }}
        >
          Gagal melakukan<br />perubahan!
        </h3>
      </div>
    </div>
  );
}
