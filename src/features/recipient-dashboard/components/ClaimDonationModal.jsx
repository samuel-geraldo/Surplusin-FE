/**
 * Modal konfirmasi pengambilan donasi (Step 1 saja).
 * Setelah klik "Klaim Donasi", panggil onConfirm() — caller yang akan
 * menutup modal ini dan membuka ClaimSuccessPopup secara terpisah.
 */
export function ClaimDonationModal({ donation, onConfirm, onClose }) {
  if (!donation) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="relative w-[50%] max-w-[410px] rounded-2xl bg-white"
        style={{
          padding: '2rem 2.5rem 1.5rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Title ── */}
        <h2
          className="mb-6 text-center font-[Manrope] font-bold text-[#0f172a]"
          style={{ fontSize: '26px', letterSpacing: '-0.3px' }}
        >
          Konfirmasi Pengambilan
        </h2>

        {/* ── Info Row: Nama Donasi ── */}
        <div
          className="mb-3 flex items-center gap-4 rounded-xl"
          style={{ backgroundColor: '#eefaf2', padding: '10px 16px' }}
        >
          {/* Icon box */}
          <div
            className="flex shrink-0 items-center justify-center rounded-lg"
            style={{ width: 58, height: 58, backgroundColor: '#c9eed5' }}
          >
            <img
              src="/recipient_retailer icon/basic-icon/piring.svg"
              alt="makanan"
              style={{
                width: 25,
                height: 30,
                filter: 'brightness(0) saturate(100%) invert(38%) sepia(62%) saturate(420%) hue-rotate(104deg) brightness(90%) contrast(90%)',
              }}
            />
          </div>
          <div>
            <p
              className="font-[Manrope] font-semibold uppercase text-text"
              style={{ fontSize: '16px' }}
            >
              Nama Donasi
            </p>
            <p
              className="mt-1 font-[Manrope] text-text"
              style={{ fontSize: '16px' }}
            >
              {donation.foodName}
            </p>
          </div>
        </div>

        {/* ── Info Row: Estimasi Penjemputan ── */}
        <div
          className="flex items-center gap-4 rounded-xl"
          style={{ backgroundColor: '#eefaf2', padding: '10px 16px' }}
        >
          {/* Icon box */}
          <div
            className="flex shrink-0 items-center justify-center rounded-lg"
            style={{ width: 58, height: 58, backgroundColor: '#ffc8a0' }}
          >
            <img
              src="/recipient_retailer icon/basic-icon/Estimasi Penjemputan.svg"
              alt="estimasi"
              style={{ width: 25, height: 30 }}
            />
          </div>
          <div>
            <p
              className="font-[Manrope] font-semibold uppercase text-black"
              style={{ fontSize: '16px' }}
            >
              Estimasi Penjemputan
            </p>
            <p
              className="mt-1 font-[Manrope] text-text"
              style={{ fontSize: '16px' }}
            >
              {donation.expiry}
            </p>
          </div>
        </div>

        {/* ── Klaim Donasi Button ── */}
        <button
          onClick={onConfirm}
          className="mt-7 w-full font-[Manrope] font-semibold text-white transition-all hover:opacity-70 active:scale-[0.98] focus:outline-none cursor-pointer"
          style={{
            backgroundColor: '#ff6600',
            borderRadius: '18px',
            padding: '11px 0',
            fontSize: '18px',
          }}
        >
          Klaim Donasi
        </button>

        {/* ── Batal ── */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="font-[Manrope] text-text transition-all hover:bg-[#dde8fd] hover:text-[#0f172a] focus:outline-none cursor-pointer rounded-full"
            style={{ fontSize: '18px', padding: '2px 20px' }}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
