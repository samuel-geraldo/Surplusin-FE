/**
 * Popup sukses setelah klaim donasi berhasil.
 * Muncul sebagai popup terpisah di atas backdrop dashboard.
 */
export function ClaimSuccessPopup({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="flex w-[90%] max-w-[330px] flex-col items-center rounded-[16px] bg-white text-center max-h-[240px]"
        style={{ padding: '2.5rem 2rem 2rem', boxShadow: '0 32px 80px rgba(0,0,0,0.22)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green checkmark circle */}
        <img
          src="/recipient_retailer icon/basic-icon/Done Status.svg"
          alt="Berhasil"
          className="mb-2 h-[34px] w-[40px]"
        />

        {/* Message */}
        <p
          className="font-[Manrope] font-semibold text-[#0f172a]"
          style={{ fontSize: '18px', lineHeight: 1.4, marginBottom: '1rem' }}
        >
          Donasi berhasil diklaim.<br />
          Bersiaplah untuk melakukan<br />
          penjemputan
        </p>

        {/* Oke Button */}
        <button
          onClick={onClose}
          className="font-[Manrope] font-semibold text-white transition-all hover:opacity-70 active:scale-[0.98] focus:outline-none cursor-pointer"
          style={{
            backgroundColor: '#ff6600',
            borderRadius: '999px',
            padding: '7px 42px',
            fontSize: '18px',
          }}
        >
          Oke
        </button>
      </div>
    </div>
  );
}
