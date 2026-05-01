/**
 * Popup sukses setelah klaim donasi berhasil.
 * Muncul sebagai popup terpisah di atas backdrop dashboard.
 */
export function ClaimSuccessPopup({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.50)' }}
    >
      <div
        className="flex w-[90%] max-w-[400px] flex-col items-center rounded-3xl bg-white text-center"
        style={{ padding: '2.5rem 2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.20)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green checkmark circle */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 76, height: 76, backgroundColor: '#22c55e', marginBottom: '1.75rem' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 40, height: 40 }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Message */}
        <p
          className="font-[Manrope] font-bold text-[#0f172a]"
          style={{ fontSize: '20px', lineHeight: 1.5, marginBottom: '2rem' }}
        >
          Donasi berhasil diklaim.<br />
          Bersiaplah untuk melakukan<br />
          penjemputan
        </p>

        {/* Oke Button */}
        <button
          onClick={onClose}
          className="font-[Manrope] font-bold text-white transition-opacity hover:opacity-90 focus:outline-none"
          style={{
            backgroundColor: '#ff7a00',
            borderRadius: '999px',
            padding: '13px 70px',
            fontSize: '17px',
          }}
        >
          Oke
        </button>
      </div>
    </div>
  );
}
