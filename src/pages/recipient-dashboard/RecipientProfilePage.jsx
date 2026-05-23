import { useState, useCallback, useRef, useEffect } from 'react';
import { env } from '@/lib/env';

const MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY;

const initialProfile = {
  name: '',
  category: '',
  whatsapp: '',
  address: '',
  patokan: '',
  email: '',
  avatar: null,
};

// Format decimal degrees → DMS
function toDMS(lat, lng) {
  const fmt = (val, pos, neg) => {
    const d = Math.abs(val);
    const deg = Math.floor(d);
    const min = Math.floor((d - deg) * 60);
    return `${deg}°${min < 10 ? '0' : ''}${min}'${val >= 0 ? pos : neg}`;
  };
  return `${fmt(lat, 'N', 'S')}, ${fmt(lng, 'E', 'W')}`;
}

// Load Google Maps JS API script once
let mapsScriptLoaded = false;
let mapsScriptLoading = false;
const mapsReadyCallbacks = [];

function loadMapsScript(apiKey, callback) {
  if (mapsScriptLoaded) { callback(); return; }
  mapsReadyCallbacks.push(callback);
  if (mapsScriptLoading) return;
  mapsScriptLoading = true;
  window.__googleMapsReady = () => {
    mapsScriptLoaded = true;
    mapsReadyCallbacks.forEach((cb) => cb());
  };
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__googleMapsReady`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

import { getRecipientProfile, updateRecipientProfile } from '../../services/api/recipient';

export default function RecipientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // ── Map state ──
  const [lat, setLat] = useState(-6.2500);
  const [lng, setLng] = useState(106.8000);
  const [detecting, setDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapperRef = useRef(null);

  // ── Map refs ──
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // ── Fetch Profile ──
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getRecipientProfile();
        if (data) {
          const mappedProfile = {
            id: data.id || data.penerima_id || 1, // Fallback ID if not provided
            name: data.nama_instansi || '',
            category: data.kategori || 'Panti Asuhan',
            whatsapp: data.nomor_whatsapp || '',
            address: data.alamat || '',
            patokan: data.patokan || '',
            email: data.email || '', // Optional
          };
          setProfile(mappedProfile);
          setDraft(mappedProfile);
          if (data.latitude) setLat(Number(data.latitude));
          if (data.longitude) setLng(Number(data.longitude));
        }
      } catch (error) {
        console.error('Gagal mengambil profil:', error);
      }
    }
    loadProfile();
  }, []);

  // ── Profile handlers ──
  const handleEdit = () => { setDraft(profile); setIsEditing(true); };
  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        nama_instansi: draft.name,
        kategori: draft.category,
        nomor_whatsapp: draft.whatsapp,
        alamat: draft.address,
        latitude: lat,
        longitude: lng,
        patokan: draft.patokan
      };

      // Backend uses JWT to identify the penerima, no ID needed
      await updateRecipientProfile(payload);

      setProfile({ ...draft, lat, lng });
      setIsEditing(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch (error) {
      console.error('Gagal menyimpan profil:', error);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 2500);
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = () => setShowCancelPopup(true);
  const confirmCancel = () => {
    setDraft(profile);
    setIsEditing(false);
    setShowCancelPopup(false);
  };
  const rejectCancel = () => setShowCancelPopup(false);

  // ── Initialize Map ──
  const initMap = useCallback(() => {
    if (!mapContainerRef.current || !window.google) return;

    const mapOptions = {
      center: { lat, lng },
      zoom: 16,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: 'Seret untuk memindahkan lokasi',
    });
    markerRef.current = marker;

    // Update coords when marker is dragged
    marker.addListener('dragend', (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setLat(newLat);
      setLng(newLng);
    });

    // Click on map to move marker
    map.addListener('click', (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      marker.setPosition({ lat: newLat, lng: newLng });
      map.panTo({ lat: newLat, lng: newLng });
      setLat(newLat);
      setLng(newLng);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load Maps script on mount
  useEffect(() => {
    loadMapsScript(MAPS_API_KEY, initMap);
  }, [initMap]);

  // When lat/lng changes externally (auto-detect / search), update map + marker
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const pos = { lat, lng };
    markerRef.current.setPosition(pos);
    mapInstanceRef.current.panTo(pos);
  }, [lat, lng]);

  // ── Auto-detect location ──
  const handleAutoDetect = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setDetecting(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Gagal mendeteksi lokasi. Pastikan izin lokasi diberikan.');
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // ── Search address via Nominatim (free, no API key needed) ──
  const handleSearch = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      setSearching(true);
      setShowDropdown(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5`,
          { headers: { 'Accept-Language': 'id,en' } }
        );
        const data = await res.json();
        if (data.length > 0) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    [searchQuery]
  );

  // When a result is picked
  const handleSelectResult = useCallback((result) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    setLat(newLat);
    setLng(newLng);
    setSearchQuery(result.display_name);
    setShowDropdown(false);
    setSearchResults([]);
  }, []);

  // ── Reusable field components ──
  const Field = ({ label, value, half }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="mb-1 block font-[Manrope] font-medium text-text" style={{ fontSize: '16px' }}>
        {label}
      </label>
      <div
        className="w-full rounded-lg font-[Manrope] text-text"
        style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5f7eb', border: '1px solid #d1fae5', minHeight: 42 }}
      >
        {value || '-'}
      </div>
    </div>
  );

  // Edit field: plain input
  const EditField = ({ label, field, multiline, half }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="mb-1 block font-[Manrope] font-medium text-[#374151]" style={{ fontSize: '14px' }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={draft[field]}
          onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          rows={3}
          className="w-full rounded-xl font-[Manrope] text-[#374151] outline-none"
          style={{ padding: '10px 14px', fontSize: '14px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff', resize: 'none' }}
        />
      ) : (
        <input
          type="text"
          value={draft[field]}
          onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          className="w-full rounded-xl font-[Manrope] text-[#374151] outline-none"
          style={{ padding: '10px 14px', fontSize: '14px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff' }}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-16">
      {/* ════════════ LEFT COLUMN: Profile ════════════ */}
      <div className="flex flex-1 flex-col gap-6" style={{ minWidth: 0 }}>
        {/* ── Informasi Dasar Card ── */}
        <div className="flex flex-col h-full rounded-3xl bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100">
          {/* Header — always visible, pencil only when not editing */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/recipient_retailer icon/basic-icon/icon rumah.svg" alt="" style={{ width: 24, height: 24 }} />
              <h3 className="font-[Manrope] font-extrabold text-[#0f172a]" style={{ fontSize: '18px' }}>
                Informasi Dasar
              </h3>
            </div>
            {/* Edit pencil — only in view mode */}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center transition-opacity hover:opacity-70"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                title="Edit Profil"
              >
                <img src="/recipient_retailer icon/basic-icon/edit logo.svg" alt="Edit" style={{ width: 20, height: 20 }} />
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Panti/Yayasan */}
            {!isEditing
              ? <Field label="Nama Panti/Yayasan" value={profile.name} half={false} />
              : <EditField label="Nama Panti/Yayasan" field="name" half={false} />}

            {/* Kategori Usaha + Nomor Whatsapp */}
            {!isEditing ? (
              <><Field label="Kategori Usaha" value={profile.category} half /><Field label="Nomor Whatsapp" value={profile.whatsapp} half /></>
            ) : (
              <>
                {/* Kategori: dropdown */}
                <div>
                  <label className="mb-1 block font-[Manrope] font-medium text-[#374151]" style={{ fontSize: '14px' }}>Kategori Usaha</label>
                  <div className="relative">
                    <select
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="w-full appearance-none rounded-xl font-[Manrope] text-[#374151] outline-none"
                      style={{ padding: '10px 36px 10px 14px', fontSize: '14px', border: '1.5px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer' }}
                    >
                      <option value="Panti Asuhan">Panti Asuhan</option>
                      <option value="Panti Jompo">Panti Jompo</option>
                      <option value="Yayasan Sosial">Yayasan Sosial</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94a3b8" className="pointer-events-none absolute" style={{ width: 18, height: 18, right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>
                <EditField label="Nomor Whatsapp" field="whatsapp" half />
              </>
            )}

            {/* Alamat Lengkap */}
            {!isEditing
              ? <Field label="Alamat Lengkap" value={profile.address} half={false} />
              : <EditField label="Alamat Lengkap" field="address" multiline half={false} />}

            {/* Patokan */}
            {!isEditing
              ? <Field label="Patokan (Opsional)" value={profile.patokan} half={false} />
              : <EditField label="Patokan (Opsional)" field="patokan" half={false} />}
          </div>

          {/* Action buttons — only in edit mode, at the bottom */}
          {isEditing && (
            <div className="mt-auto pt-6 flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="rounded-xl font-[Manrope] font-semibold text-[#374151] transition-colors hover:bg-[#e2e8f0]"
                style={{ padding: '10px 28px', fontSize: '14px', backgroundColor: '#f1f5f9', border: 'none', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl font-[Manrope] font-bold text-white transition-opacity"
                style={{
                  padding: '10px 28px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: saving ? 'wait' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  background: 'linear-gradient(135deg, #ff7a00 0%, #ff9500 100%)',
                  boxShadow: '0 4px 14px rgba(255,122,0,0.35)',
                }}
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════════════ RIGHT COLUMN: Pinpoint Lokasi ════════════ */}
      <aside className="flex flex-1 flex-col gap-0" style={{ minWidth: 0 }}>
        <div className="flex flex-col h-full rounded-3xl bg-white p-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100">
          {/* ── Header ── */}
          <div className="mb-2 flex items-center gap-3">
            <img src="/recipient_retailer icon/basic-icon/location black.svg" alt="" style={{ width: 24, height: 24 }} />
            <h3 className="font-[Manrope] font-extrabold text-[#0f172a]" style={{ fontSize: '18px' }}>
              Pinpoint Lokasi
            </h3>
          </div>
          <p className="mb-4 font-[Manrope] text-[#64748b]" style={{ fontSize: '13px', lineHeight: 1.5 }}>
            Geser pin pada peta untuk menentukan titik koordinat penjemputan donasi yang lebih akurat
          </p>

          {/* ── Search bar + dropdown ── */}
          <div className="relative mb-3" ref={searchWrapperRef}>
            <form onSubmit={handleSearch} className="flex items-center">
              <div
                className="flex flex-1 items-center gap-2 rounded-xl bg-white"
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94a3b8" style={{ width: 18, height: 18, flexShrink: 0 }}>
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value.trim()) { setShowDropdown(false); setSearchResults([]); }
                  }}
                  onKeyDown={(e) => { if (e.key === 'Escape') { setShowDropdown(false); } }}
                  placeholder="Cari alamat..."
                  className="w-full bg-transparent font-[Manrope] text-[#374151] outline-none placeholder:text-[#94a3b8]"
                  style={{ fontSize: '14px', border: 'none' }}
                  autoComplete="off"
                />
                {/* Clear button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setShowDropdown(false); setSearchResults([]); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#94a3b8" style={{ width: 16, height: 16 }}>
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                )}
              </div>
              {/* Auto-detect icon button */}
              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={detecting}
                className="flex shrink-0 items-center justify-center transition-colors hover:bg-[#f1f5f9]"
                style={{
                  width: 42, height: 42,
                  borderRadius: 12,
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#fff',
                  marginLeft: 6,
                  cursor: detecting ? 'wait' : 'pointer',
                  opacity: detecting ? 0.5 : 1,
                }}
                title="Auto-Detect Lokasi"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#64748b" style={{ width: 20, height: 20 }}>
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </svg>
              </button>
            </form>

            {/* ── Dropdown results ── */}
            {showDropdown && (
              <div
                className="absolute z-50 w-full overflow-hidden rounded-xl bg-white"
                style={{
                  top: '100%',
                  marginTop: 4,
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  maxHeight: 220,
                  overflowY: 'auto',
                }}
              >
                {searching && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <div
                      className="animate-spin rounded-full border-2 border-[#e2e8f0] border-t-[#22c55e]"
                      style={{ width: 18, height: 18 }}
                    />
                    <span className="font-[Manrope] text-[#64748b]" style={{ fontSize: '13px' }}>Mencari...</span>
                  </div>
                )}
                {!searching && searchResults.length === 0 && (
                  <div className="px-4 py-4 text-center font-[Manrope] text-[#94a3b8]" style={{ fontSize: '13px' }}>
                    Lokasi tidak ditemukan
                  </div>
                )}
                {!searching && searchResults.map((result, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="flex w-full items-start gap-3 text-left transition-colors hover:bg-[#f8fafc]"
                    style={{
                      padding: '10px 14px',
                      borderBottom: i < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                      background: 'none',
                      border: i < searchResults.length - 1 ? '0 0 1px 0 solid #f1f5f9' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      borderBottom: i < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#22c55e" style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                    <div style={{ minWidth: 0 }}>
                      <p
                        className="font-[Manrope] font-semibold text-[#0f172a]"
                        style={{ fontSize: '13px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {result.name || result.display_name.split(',')[0]}
                      </p>
                      <p
                        className="font-[Manrope] text-[#94a3b8]"
                        style={{ fontSize: '11px', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {result.display_name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Interactive Map (Google Maps JS API with draggable marker) ── */}
          <div className="relative overflow-hidden rounded-2xl flex-1" style={{ minHeight: 260, border: '1px solid #e2e8f0' }}>
            {/* Map container — Google Maps mounts here */}
            <div
              ref={mapContainerRef}
              style={{ width: '100%', height: '100%' }}
            />

            {/* ── Coordinate overlay ── */}
            <div
              className="absolute flex items-center gap-3"
              style={{
                bottom: 12, left: 12, right: 12,
                padding: '10px 14px',
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                pointerEvents: 'none',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#64748b" style={{ width: 18, height: 18, flexShrink: 0 }}>
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
              </svg>
              <div className="flex flex-1 flex-col" style={{ minWidth: 0 }}>
                <span className="font-[Manrope] font-bold uppercase tracking-wider text-[#374151]" style={{ fontSize: '10px' }}>
                  Koordinat Saat Ini
                </span>
                <span className="font-[Manrope] font-semibold text-[#0f172a]" style={{ fontSize: '13px' }}>
                  {toDMS(lat, lng)}
                </span>
              </div>
              {/* Auto-Detect button — re-enable pointer events */}
              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={detecting}
                className="shrink-0 rounded-full font-[Manrope] font-bold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '6px 16px',
                  fontSize: '12px',
                  border: 'none',
                  cursor: detecting ? 'wait' : 'pointer',
                  opacity: detecting ? 0.5 : 1,
                  pointerEvents: 'all',
                }}
              >
                {detecting ? 'Mendeteksi...' : 'Auto-Detect'}
              </button>
            </div>
          </div>

          {/* Hint text */}
          <p className="mt-2 text-center font-[Manrope] text-[#94a3b8]" style={{ fontSize: '11px' }}>
            Klik pada peta atau seret pin merah untuk mengubah koordinat
          </p>
        </div>
      </aside>

      {/* ════════════ CANCEL CONFIRMATION POPUP ════════════ */}
      {showCancelPopup && (
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
                onClick={rejectCancel}
                className="flex-1 rounded-full bg-transparent py-3 font-[Manrope] text-[15px] font-medium text-[#374151] transition-colors hover:bg-slate-50 cursor-pointer"
              >
                Tidak
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 rounded-full bg-[#f97316] py-3 font-[Manrope] text-[15px] font-bold text-white transition-colors hover:bg-[#ea580c] cursor-pointer"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ SUCCESS POPUP ════════════ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[340px] rounded-3xl bg-[#dcfce7] p-8 text-center shadow-2xl">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#4ade80]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 26, height: 26 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Text */}
            <h3 className="font-[Manrope] text-[18px] font-semibold text-[#0f172a] leading-snug">
              Perubahan berhasil<br />disimpan!
            </h3>
          </div>
        </div>
      )}

      {/* ════════════ ERROR POPUP ════════════ */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[340px] rounded-3xl bg-[#ffcaca] p-8 text-center shadow-2xl">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ef4444]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>

            {/* Text */}
            <h3 className="font-[Manrope] text-[18px] font-semibold text-[#0f172a] leading-snug">
              Gagal melakukan<br />perubahan!
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
