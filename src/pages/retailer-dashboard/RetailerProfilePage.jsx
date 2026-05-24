import { useCallback, useEffect, useRef, useState } from 'react';
import { LocateFixed, Search } from 'lucide-react';
import { GoogleLocationMap, CancelEditPopup, FailedUpdatePopup, SuccessUpdatePopup } from '@/components/ui';
import {
  searchAddresses,
  shouldSearchAddress,
} from '@/features/auth/components/locationSearch';
import {
  getRetailerProfile,
  updateRetailerProfile,
} from '@/services/api/retailer';

const DEFAULT_CENTER = [106.8456, -6.2088];

const initialProfile = {
  storeName: '',
  category: '',
  whatsapp: '',
  address: '',
  landmark: '',
  latitude: -6.2088,
  longitude: 106.8456,
};

const profileFields = [
  {
    id: 'storeName',
    label: 'Nama Toko/Usaha',
  },
  {
    id: 'category',
    label: 'Kategori Usaha',
  },
  {
    id: 'whatsapp',
    label: 'Nomor Whatsapp',
  },
  {
    id: 'address',
    label: 'Alamat Lengkap',
    multiline: true,
  },
  {
    id: 'landmark',
    label: 'Patokan (Opsional)',
  },
];

function getProfileCenter(profile) {
  return profile.longitude && profile.latitude
    ? [Number(profile.longitude), Number(profile.latitude)]
    : DEFAULT_CENTER;
}

function HomeProfileIcon() {
  return <img src="/recipient_retailer icon/basic-icon/icon rumah.svg" alt="" aria-hidden="true" style={{ width: 22, height: 22 }} />;
}

function EditProfileIcon() {
  return <img src="/recipient_retailer icon/basic-icon/edit logo.svg" alt="" aria-hidden="true" style={{ width: 18, height: 18 }} />;
}

function FieldBox({ field, value, draftValue, error, isEditing, onChange }) {
  const inputClass = `w-full rounded-xl font-[Manrope] text-[#374151] outline-none px-3 py-2 text-[13px] sm:px-[14px] sm:py-[10px] sm:text-[14px] bg-white ${error ? 'border-[1.5px] border-[#ff4542]' : 'border-[1.5px] border-[#e2e8f0]'}`;

  return (
    <label className={`flex flex-col min-w-0 ${field.id === 'category' || field.id === 'whatsapp' ? '' : 'sm:col-span-2 md:col-span-1 lg:col-span-2'}`}>
      <span className="mb-1 block font-[Manrope] font-medium text-[#374151] text-[13px] sm:text-[14px]">
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
            rows={3}
          />
        ) : (
          <input
            value={draftValue}
            onChange={(event) => onChange(field.id, event.target.value)}
            required
            aria-invalid={Boolean(error)}
            className={inputClass}
          />
        )
      ) : (
        <span
          className="flex w-full min-h-[36px] sm:min-h-[42px] items-center break-words rounded-xl font-[Manrope] text-[#374151] px-3 py-2 text-[13px] sm:px-[14px] sm:py-[10px] sm:text-[14px] bg-[#f0fdf4] border border-[#d1fae5]"
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

function RetailerLocationMap({ editable, profile, draft, onLocationChange }) {
  const activeProfile = editable ? draft : profile;
  const [center, setCenter] = useState(getProfileCenter(activeProfile));
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [locationError, setLocationError] = useState('');
  const selectedAddressRef = useRef(activeProfile.address);
  const searchQuery = activeProfile.address;

  const handlePick = useCallback(
    (nextCenter) => {
      if (!editable) {
        return;
      }

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
    if (!editable || searchQuery === selectedAddressRef.current) {
      return undefined;
    }

    if (!shouldSearchAddress(searchQuery)) {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      setSearchError('');

      searchAddresses(searchQuery, controller.signal)
        .then((results) => {
          setAddressResults(results);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setAddressResults([]);
            setSearchError('Alamat tidak bisa dimuat');
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsSearching(false);
          }
        });
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, editable]);

  function handleAddressChange(event) {
    if (!editable) {
      return;
    }

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
    if (!editable) {
      return;
    }

    selectedAddressRef.current = result.label;
    setAddressResults([]);
    setSearchError('');
    onLocationChange({ address: result.label });
    handlePick(result.center);
  }

  function handleLocate() {
    if (!editable) {
      return;
    }

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
    <div className="mt-4 flex flex-1 flex-col gap-3">
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

      <div className="relative flex-1 min-h-[200px] sm:min-h-[260px] w-full overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#edf2f7]">
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

export default function RetailerProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
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
        const data = await getRetailerProfile();
        if (cancelled) return;
        setProfile(data);
        setDraft(data);
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              'Gagal memuat profil retailer',
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

  const handleEditClick = () => {
    setDraft(profile);
    setErrors({});
    setIsEditing(true);
  };

  const handleFieldChange = (fieldId, value) => {
    setDraft((currentDraft) => ({ ...currentDraft, [fieldId]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[fieldId]) return currentErrors;

      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldId];
      return nextErrors;
    });
  };

  const handleLocationChange = useCallback((nextLocation) => {
    setDraft((currentDraft) => ({ ...currentDraft, ...nextLocation }));
    setErrors((currentErrors) => {
      if (!nextLocation.address || !currentErrors.address) return currentErrors;

      const nextErrors = { ...currentErrors };
      delete nextErrors.address;
      return nextErrors;
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
    const nextErrors = profileFields.reduce((accumulator, field) => {
      if (field.id !== 'landmark' && !draft[field.id].trim()) {
        accumulator[field.id] = `${field.label} wajib diisi`;
      }
      return accumulator;
    }, {});

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nextProfile = {
      storeName: draft.storeName.trim(),
      category: draft.category.trim(),
      whatsapp: draft.whatsapp.trim(),
      address: draft.address.trim(),
      landmark: draft.landmark.trim(),
      latitude: draft.latitude,
      longitude: draft.longitude,
    };

    try {
      setIsSaving(true);
      setErrorMessage('');
      await updateRetailerProfile(nextProfile);
      setProfile(nextProfile);
      setDraft(nextProfile);
      setIsEditing(false);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Gagal menyimpan profil retailer',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 px-4 py-4 sm:py-6 font-[Manrope] sm:px-6 lg:px-8 md:py-8" style={{ marginTop: '1rem' }}>
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
          className="flex flex-col h-full rounded-3xl bg-white p-5 sm:p-7 lg:px-8"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <HomeProfileIcon />
              <h2 className="font-[Manrope] text-[16px] sm:text-[18px] font-extrabold leading-6 text-[#0f172a]">
                Informasi Dasar
              </h2>
            </div>
            {!isEditing ? (
              <button
                type="button"
                aria-label="Edit profil"
                onClick={handleEditClick}
                className="flex size-7 items-center justify-center text-black transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a]"
              >
                <EditProfileIcon />
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <FieldBox
              field={profileFields[0]}
              value={profile.storeName}
              draftValue={draft.storeName}
              error={errors.storeName}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
            <FieldBox
              field={profileFields[1]}
              value={profile.category}
              draftValue={draft.category}
              error={errors.category}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
            <FieldBox
              field={profileFields[2]}
              value={profile.whatsapp}
              draftValue={draft.whatsapp}
              error={errors.whatsapp}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
            <FieldBox
              field={profileFields[3]}
              value={profile.address}
              draftValue={draft.address}
              error={errors.address}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
            <FieldBox
              field={profileFields[4]}
              value={profile.landmark}
              draftValue={draft.landmark}
              error={errors.landmark}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
          </div>
          {isEditing ? (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={handleCancelClick}
                className="w-full rounded-xl font-[Manrope] font-semibold text-[#374151] transition-colors hover:bg-[#e2e8f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64748b] sm:w-auto"
                style={{ padding: '10px 28px', fontSize: '14px', backgroundColor: '#f1f5f9' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-xl font-[Manrope] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6600] sm:w-auto"
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

      <aside className="flex w-full shrink-0 flex-col gap-0 md:w-[320px] lg:w-[380px]">
        <section
          className="flex flex-col h-full rounded-3xl bg-white p-5 sm:p-7"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}
        >
          <div className="flex flex-1 min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/recipient_retailer icon/basic-icon/location black.svg"
                alt=""
                aria-hidden="true"
                style={{ width: 18, height: 23 }}
              />
              <h2 className="font-[Manrope] text-[16px] sm:text-[18px] font-extrabold leading-6 text-black">
                Pinpoint Lokasi
              </h2>
            </div>
            <p className="mt-2 text-[13px] font-normal leading-5 text-[#64748b]">
              Geser pin pada peta untuk menentukan titik koordinat penjemputan donasi yang lebih akurat
            </p>

            <RetailerLocationMap
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
