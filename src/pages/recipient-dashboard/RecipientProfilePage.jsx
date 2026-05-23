import { useCallback, useEffect, useRef, useState } from 'react';
import { LocateFixed, Search } from 'lucide-react';
import { GoogleLocationMap, CancelEditPopup, FailedUpdatePopup, SuccessUpdatePopup } from '@/components/ui';
import {
  getRecipientProfile,
  updateRecipientProfile,
} from '@/services/api/recipient';
import {
  searchAddresses,
  shouldSearchAddress,
} from '@/features/auth/components/locationSearch';

const DEFAULT_CENTER = [106.8456, -6.2088];

const emptyProfile = {
  name: '',
  category: '',
  whatsapp: '',
  address: '',
  patokan: '',
  latitude: -6.2088,
  longitude: 106.8456,
};

const fields = [
  { id: 'name', label: 'Nama Panti/Yayasan' },
  { id: 'category', label: 'Kategori Usaha' },
  { id: 'whatsapp', label: 'Nomor Whatsapp' },
  { id: 'address', label: 'Alamat Lengkap', multiline: true },
  { id: 'patokan', label: 'Patokan (Opsional)' },
];

const categoryOptions = [
  'Panti Asuhan',
  'Panti Jompo',
  'Yayasan Sosial',
  'Lainnya',
];

function toProfile(data) {
  return {
    name: data?.nama_instansi ?? '',
    category: data?.kategori ?? '',
    whatsapp: data?.nomor_whatsapp ?? '',
    address: data?.alamat ?? '',
    patokan: data?.patokan ?? '',
    latitude: Number(data?.latitude ?? -6.2088),
    longitude: Number(data?.longitude ?? 106.8456),
  };
}

function toPayload(profile) {
  return {
    nama_instansi: profile.name.trim(),
    kategori: profile.category.trim(),
    nomor_whatsapp: profile.whatsapp.trim(),
    alamat: profile.address.trim(),
    patokan: profile.patokan.trim() || undefined,
    latitude: profile.latitude,
    longitude: profile.longitude,
  };
}

function getCenter(profile) {
  return profile.longitude && profile.latitude
    ? [Number(profile.longitude), Number(profile.latitude)]
    : DEFAULT_CENTER;
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0f172a" style={{ width: 22, height: 22 }} aria-hidden="true">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" style={{ width: 18, height: 18 }}>
      <path
        fill="black"
        d="M4 22.9V28h5.1L24.15 12.95l-5.1-5.1L4 22.9Zm24.05-13.9a1.36 1.36 0 0 0 0-1.92l-3.13-3.13a1.36 1.36 0 0 0-1.92 0l-2.45 2.45 5.1 5.1 2.4-2.5Z"
      />
    </svg>
  );
}

function FieldBox({ field, value, draftValue, error, isEditing, onChange }) {
  const inputClass = 'w-full rounded-xl font-[Manrope] text-[#374151] outline-none';
  const inputStyle = {
    padding: '10px 14px',
    fontSize: '14px',
    border: error ? '1.5px solid #ff4542' : '1.5px solid #e2e8f0',
    backgroundColor: '#fff',
  };

  return (
    <label className={`flex flex-col ${field.id === 'category' || field.id === 'whatsapp' ? '' : 'col-span-2'}`}>
      <span className="mb-1 block font-[Manrope] font-medium text-[#374151]" style={{ fontSize: '14px' }}>
        {field.label}
      </span>
      {isEditing ? (
        field.id === 'category' ? (
          <select
            value={draftValue}
            onChange={(event) => onChange(field.id, event.target.value)}
            required
            aria-invalid={Boolean(error)}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">Pilih kategori</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : field.multiline ? (
          <textarea
            value={draftValue}
            onChange={(event) => onChange(field.id, event.target.value)}
            required
            aria-invalid={Boolean(error)}
            className={`${inputClass} resize-none`}
            style={{ ...inputStyle, resize: 'none' }}
            rows={3}
          />
        ) : (
          <input
            value={draftValue}
            onChange={(event) => onChange(field.id, event.target.value)}
            required
            aria-invalid={Boolean(error)}
            className={inputClass}
            style={inputStyle}
          />
        )
      ) : (
        <span
          className="w-full rounded-xl font-[Manrope] text-[#374151]"
          style={{
            padding: '10px 14px',
            fontSize: '14px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #d1fae5',
            minHeight: field.multiline ? 92 : 42,
          }}
        >
          {value || '-'}
        </span>
      )}
      {error ? (
        <span className="font-[Manrope] text-[13px] font-medium leading-none text-[#ff4542]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function RecipientLocationMap({ editable, profile, draft, onLocationChange }) {
  const activeProfile = editable ? draft : profile;
  const [center, setCenter] = useState(getCenter(activeProfile));
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [locationError, setLocationError] = useState('');
  const selectedAddressRef = useRef(activeProfile.address);
  const searchQuery = activeProfile.address;

  const handlePick = useCallback(
    (nextCenter) => {
      if (!editable) return;

      setCenter(nextCenter);
      setLocationError('');
      onLocationChange({
        longitude: nextCenter[0],
        latitude: nextCenter[1],
      });
    },
    [editable, onLocationChange],
  );

  useEffect(() => {
    if (!editable || searchQuery === selectedAddressRef.current) return undefined;
    if (!shouldSearchAddress(searchQuery)) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      setSearchError('');

      searchAddresses(searchQuery, controller.signal)
        .then(setAddressResults)
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setAddressResults([]);
            setSearchError('Alamat tidak bisa dimuat');
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsSearching(false);
        });
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, editable]);

  function handleAddressChange(event) {
    if (!editable) return;

    const nextQuery = event.target.value;
    selectedAddressRef.current = '';
    setLocationError('');
    onLocationChange({ address: nextQuery });

    if (!shouldSearchAddress(nextQuery)) {
      setAddressResults([]);
      setSearchError('');
      setIsSearching(false);
    }
  }

  function handleAddressSelect(result) {
    if (!editable) return;

    selectedAddressRef.current = result.label;
    setAddressResults([]);
    setSearchError('');
    onLocationChange({ address: result.label });
    handlePick(result.center);
  }

  function handleLocate() {
    if (!editable) return;

    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Browser tidak mendukung lokasi perangkat.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handlePick([position.coords.longitude, position.coords.latitude]);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'Izin lokasi ditolak browser/perangkat.'
            : 'Lokasi perangkat tidak tersedia. Cek Location Services Windows.',
        );
      },
      { enableHighAccuracy: true, timeout: 6000 },
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="relative">
        <div className="flex h-11 w-full items-center rounded-[8px] border border-[#94a3b8] bg-white px-3">
          <Search className="size-5 text-[#64748b]" strokeWidth={2.2} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleAddressChange}
            placeholder="Cari alamat..."
            disabled={!editable}
            className="ml-2 h-full min-w-0 flex-1 bg-transparent font-[Manrope] text-[14px] font-normal leading-5 text-[#1e293b] outline-none placeholder:text-[#64748b] disabled:cursor-not-allowed"
          />
          <button
            type="button"
            aria-label="Gunakan lokasi saat ini"
            disabled={!editable || isLocating}
            className="ml-3 grid size-7 shrink-0 place-items-center rounded-full text-[#0f172a] transition-colors hover:bg-[#dcfce9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a] disabled:opacity-50"
            onClick={handleLocate}
          >
            <LocateFixed className="size-5" strokeWidth={2.5} />
          </button>
        </div>

        {editable && (addressResults.length > 0 || isSearching || searchError) && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-[#d6dbe3] bg-white shadow-lg">
            {isSearching && (
              <p className="px-4 py-3 font-[Manrope] text-[14px] text-[#64748b]">
                Mencari alamat...
              </p>
            )}
            {searchError && (
              <p className="px-4 py-3 font-[Manrope] text-[14px] text-red-dark">
                {searchError}
              </p>
            )}
            {addressResults.map((result) => (
              <button
                key={result.id}
                type="button"
                className="block w-full px-4 py-3 text-left font-[Manrope] text-[14px] leading-5 text-[#0f172a] hover:bg-[#dcfce9] focus-visible:bg-[#dcfce9] focus-visible:outline-none"
                onClick={() => handleAddressSelect(result)}
              >
                {result.label}
              </button>
            ))}
          </div>
        )}
        {editable && locationError ? (
          <p className="mt-2 font-[Manrope] text-[14px] text-red-dark">
            {locationError}
          </p>
        ) : null}
      </div>

      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#edf2f7]">
        <GoogleLocationMap
          center={center}
          onPick={handlePick}
          editable={editable}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}

export default function RecipientProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showFailedPopup, setShowFailedPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = toProfile(await getRecipientProfile());
        if (cancelled) return;
        setProfile(data);
        setDraft(data);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            'Gagal memuat profil penerima',
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEdit = () => {
    setDraft(profile);
    setErrors({});
    setIsEditing(true);
  };

  const handleChange = (fieldId, value) => {
    setDraft((current) => ({ ...current, [fieldId]: value }));
    setErrors((current) => {
      if (!current[fieldId]) return current;

      const next = { ...current };
      delete next[fieldId];
      return next;
    });
  };

  const handleLocationChange = useCallback((nextLocation) => {
    setDraft((current) => ({ ...current, ...nextLocation }));
    setErrors((current) => {
      if (!nextLocation.address || !current.address) return current;

      const next = { ...current };
      delete next.address;
      return next;
    });
  }, []);

  const handleCancelClick = () => {
    setShowCancelPopup(true);
  };

  const handleCancelConfirm = () => {
    setDraft(profile);
    setErrors({});
    setIsEditing(false);
    setShowCancelPopup(false);
    setShowFailedPopup(true);
    setTimeout(() => setShowFailedPopup(false), 2000);
  };

  const handleSave = async () => {
    const nextErrors = fields.reduce((accumulator, field) => {
      if (field.id !== 'patokan' && !draft[field.id].trim()) {
        accumulator[field.id] = `${field.label} wajib diisi`;
      }
      return accumulator;
    }, {});

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const nextProfile = {
      name: draft.name.trim(),
      category: draft.category.trim(),
      whatsapp: draft.whatsapp.trim(),
      address: draft.address.trim(),
      patokan: draft.patokan.trim(),
      latitude: draft.latitude,
      longitude: draft.longitude,
    };

    try {
      setIsSaving(true);
      setErrorMessage('');
      await updateRecipientProfile(toPayload(nextProfile));
      setProfile(nextProfile);
      setDraft(nextProfile);
      setIsEditing(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Gagal menyimpan profil penerima',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-6 px-8 py-8 font-[Manrope]" style={{ marginTop: '1rem' }}>
      {isLoading && (
        <div className="fixed inset-x-0 top-20 z-40 mx-auto w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#64748b] shadow">
          Memuat profil...
        </div>
      )}
      {errorMessage && (
        <div className="fixed inset-x-0 top-20 z-40 mx-auto w-fit rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 shadow">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-6" style={{ minWidth: 0 }}>
        <section
          className="rounded-3xl bg-white"
          style={{ padding: '1.75rem 2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HomeIcon />
              <h2 className="font-[Manrope] text-[18px] font-extrabold leading-6 text-[#0f172a]">
                Informasi Dasar
              </h2>
            </div>
            {!isEditing ? (
              <button
                type="button"
                aria-label="Edit profil"
                onClick={handleEdit}
                className="flex size-7 items-center justify-center text-black transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a]"
              >
                <EditIcon />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <FieldBox
                key={field.id}
                field={field}
                value={profile[field.id]}
                draftValue={draft[field.id]}
                error={errors[field.id]}
                isEditing={isEditing}
                onChange={handleChange}
              />
            ))}
          </div>

          {isEditing ? (
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelClick}
                className="rounded-xl font-[Manrope] font-semibold text-[#374151] transition-colors hover:bg-[#e2e8f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64748b]"
                style={{ padding: '10px 28px', fontSize: '14px', backgroundColor: '#f1f5f9' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl font-[Manrope] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6600]"
                style={{
                  padding: '10px 28px',
                  fontSize: '14px',
                  background: 'linear-gradient(135deg, #ff7a00 0%, #ff9500 100%)',
                  boxShadow: '0 4px 14px rgba(255,122,0,0.35)',
                }}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          ) : null}
        </section>
      </div>

      <aside className="hidden shrink-0 flex-col gap-0 xl:flex" style={{ width: 380 }}>
        <section
          className="flex flex-col rounded-3xl bg-white"
          style={{ padding: '1.75rem', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
        >
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/recipient_retailer icon/basic-icon/location black.svg"
                alt=""
                aria-hidden="true"
                style={{ width: 18, height: 23 }}
              />
              <h2 className="font-[Manrope] text-[18px] font-extrabold leading-6 text-black">
                Pinpoint Lokasi
              </h2>
            </div>
            <p className="mt-2 text-[13px] font-normal leading-5 text-[#64748b]">
              Geser pin pada peta untuk menentukan titik koordinat penerima donasi yang lebih akurat
            </p>

            <RecipientLocationMap
              key={`${isEditing ? 'edit' : 'view'}-${profile.address}-${profile.latitude}-${profile.longitude}`}
              editable={isEditing}
              profile={profile}
              draft={draft}
              onLocationChange={handleLocationChange}
            />
          </div>
        </section>
      </aside>
      
      <CancelEditPopup
        isOpen={showCancelPopup}
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelPopup(false)}
      />
      <FailedUpdatePopup isOpen={showFailedPopup} />
      <SuccessUpdatePopup isOpen={showSuccessPopup} />
    </div>
  );
}
