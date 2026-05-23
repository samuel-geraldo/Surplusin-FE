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
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[420px] rounded-3xl bg-white"
        style={{ padding: '2rem', boxShadow: '0 24px 60px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          className="mb-6 text-center font-[Manrope] font-extrabold text-[#0f172a]"
          style={{ fontSize: '22px' }}
        >
          Konfirmasi Pengambilan
        </h2>

        {/* ── Info Row: Nama Donasi ── */}
        <div
          className="mb-3 flex items-center gap-4 rounded-2xl"
          style={{ backgroundColor: '#f0fdf4', padding: '1rem' }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-xl"
            style={{ width: 48, height: 48, backgroundColor: '#bbf7d0' }}
          >
            <img
              src="/recipient_retailer icon/basic-icon/piring.svg"
              alt="makanan"
              style={{ width: 26, height: 26 }}
            />
          </div>
          <div>
            <p
              className="font-[Manrope] font-bold uppercase tracking-widest text-[#15803d]"
              style={{ fontSize: '11px' }}
            >
              Nama Donasi
            </p>
            <p
              className="mt-0.5 font-[Manrope] font-medium text-[#0f172a]"
              style={{ fontSize: '15px' }}
            >
              {donation.foodName}
            </p>
          </div>
        </div>

        {/* ── Info Row: Estimasi Penjemputan ── */}
        <div
          className="flex items-center gap-4 rounded-2xl"
          style={{ backgroundColor: '#fff7ed', padding: '1rem' }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-xl"
            style={{ width: 48, height: 48, backgroundColor: '#fed7aa' }}
          >
            <img
              src="/recipient_retailer icon/basic-icon/clock.svg"
              alt="estimasi"
              style={{ width: 26, height: 26 }}
            />
          </div>
          <div>
            <p
              className="font-[Manrope] font-bold uppercase tracking-widest text-[#c2410c]"
              style={{ fontSize: '11px' }}
            >
              Estimasi Penjemputan
            </p>
            <p
              className="mt-0.5 font-[Manrope] font-medium text-[#0f172a]"
              style={{ fontSize: '15px' }}
            >
              {donation.expiry}
            </p>
          </div>
        </div>

        {/* ── Klaim Donasi Button ── */}
        <button
          onClick={onConfirm}
          className="mt-6 w-full font-[Manrope] font-bold text-white transition-opacity hover:opacity-90 focus:outline-none"
          style={{
            backgroundColor: '#ff7a00',
            borderRadius: '999px',
            padding: '14px 0',
            fontSize: '17px',
          }}
        >
          Klaim Donasi
        </button>

        {/* ── Batal ── */}
        <button
          onClick={onClose}
          className="mt-3 w-full font-[Manrope] font-medium text-[#64748b] transition-colors hover:text-[#0f172a] focus:outline-none"
          style={{ fontSize: '15px', padding: '8px 0' }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
