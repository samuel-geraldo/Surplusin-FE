import { useCallback, useEffect, useRef, useState } from 'react';
import { LocateFixed, Search } from 'lucide-react';
import { Map } from '@/components/ui';
import {
  searchAddresses,
  shouldSearchAddress,
} from '@/features/auth/components/locationSearch';

const DEFAULT_CENTER = [106.8456, -6.2088];

const initialProfile = {
  storeName: 'Catering Ibu Endang',
  category: 'Makanan Siap Saji',
  whatsapp: '081234567890',
  address: 'Jl. Kebahagian No.123, Kebayoran baru, Jakarta Selatan',
  landmark: 'Depan Alfamart',
  latitude: -6.2088,
  longitude: 106.8456,
};

const profileFields = [
  {
    id: 'storeName',
    label: 'Nama Toko/Usaha',
    style: { width: 573, height: 60 },
  },
  {
    id: 'category',
    label: 'Kategori Usaha',
    style: { width: 278, height: 60 },
  },
  {
    id: 'whatsapp',
    label: 'Nomor Whatsapp',
    style: { width: 278, height: 60 },
  },
  {
    id: 'address',
    label: 'Alamat Lengkap',
    style: { width: 573, height: 119, alignItems: 'flex-start', paddingTop: 14 },
    multiline: true,
  },
  {
    id: 'landmark',
    label: 'Patokan (Opsional)',
    style: { width: 573, height: 60 },
  },
];

function getProfileCenter(profile) {
  return profile.longitude && profile.latitude
    ? [Number(profile.longitude), Number(profile.latitude)]
    : DEFAULT_CENTER;
}

function HomeProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 54 44" style={{ width: 54, height: 44 }}>
      <path
        fill="black"
        d="M45.7 24.78v16.1c0 .58-.21 1.08-.64 1.51-.43.42-.93.64-1.52.64H30.61V30.15h-8.62v12.88H9.06c-.58 0-1.09-.22-1.52-.64a2.06 2.06 0 0 1-.64-1.51v-16.1c0-.02 0-.05.02-.1.01-.04.02-.08.02-.1L26.3 8.69l19.36 15.9c.03.04.04.1.04.2ZM53.2 22.47l-2.09 2.48c-.18.2-.41.32-.7.36h-.1c-.3 0-.53-.08-.71-.24L26.3 5.72 3 25.07c-.27.18-.54.26-.81.24a1.06 1.06 0 0 1-.71-.36L-.61 22.47a1.02 1.02 0 0 1-.24-.79c.02-.3.15-.54.37-.72L23.72.88A4.04 4.04 0 0 1 26.3 0c.99 0 1.84.3 2.56.88l8.21 6.84V1.17c0-.31.1-.57.3-.77.2-.2.46-.3.78-.3h6.46c.32 0 .58.1.78.3.2.2.3.46.3.77v13.68l7.37 6.1c.23.19.35.43.38.73.02.3-.06.57-.24.79Z"
      />
    </svg>
  );
}

function EditProfileIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" style={{ width: 32, height: 32 }}>
      <path
        fill="black"
        d="M4 22.9V28h5.1L24.15 12.95l-5.1-5.1L4 22.9Zm24.05-13.9a1.36 1.36 0 0 0 0-1.92l-3.13-3.13a1.36 1.36 0 0 0-1.92 0l-2.45 2.45 5.1 5.1 2.4-2.5Z"
      />
    </svg>
  );
}

function FieldBox({ field, value, draftValue, error, isEditing, onChange }) {
  const inputBaseStyle = {
    ...field.style,
    backgroundColor: '#dcfce9',
    border: error ? '1.5px solid #ff4542' : '1.5px solid transparent',
  };

  const sharedInputClass =
    'rounded-[10px] px-2.5 font-[Manrope] text-[18px] font-normal leading-[25px] tracking-[-0.36px] text-[#1e293b] outline-none focus:border-[#3c965a]';

  return (
    <label className="flex flex-col gap-[13px]">
      <span className="font-[Manrope] text-[20px] font-medium leading-[27px] tracking-[-0.4px] text-black">
        {field.label}
      </span>
      {isEditing ? (
        field.multiline ? (
          <textarea
            value={draftValue}
            onChange={(event) => onChange(field.id, event.target.value)}
            onInput={(event) => onChange(field.id, event.currentTarget.value)}
            required
            aria-invalid={Boolean(error)}
            className={`${sharedInputClass} resize-none`}
            style={inputBaseStyle}
          />
        ) : (
          <input
            value={draftValue}
            onChange={(event) => onChange(field.id, event.target.value)}
            onInput={(event) => onChange(field.id, event.currentTarget.value)}
            required
            aria-invalid={Boolean(error)}
            className={sharedInputClass}
            style={inputBaseStyle}
          />
        )
      ) : (
        <span
          className="flex items-center rounded-[10px] px-2.5 font-[Manrope] text-[18px] font-normal leading-[25px] tracking-[-0.36px] text-[#1e293b]"
          style={{ backgroundColor: '#dcfce9', ...field.style }}
        >
          {value}
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
  const [addressQuery, setAddressQuery] = useState(activeProfile.address);
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [locationError, setLocationError] = useState('');
  const selectedAddressRef = useRef(activeProfile.address);

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
    if (!editable || addressQuery === selectedAddressRef.current) {
      return undefined;
    }

    if (!shouldSearchAddress(addressQuery)) {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsSearching(true);
      setSearchError('');

      searchAddresses(addressQuery, controller.signal)
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
  }, [addressQuery, editable]);

  function handleAddressChange(event) {
    if (!editable) {
      return;
    }

    const nextQuery = event.target.value;

    selectedAddressRef.current = '';
    setAddressQuery(nextQuery);
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
    setAddressQuery(result.label);
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
    <div className="mt-[33px] flex flex-col gap-[18px]">
      <div className="relative">
        <div className="flex items-center rounded-[10px] border border-[#64748b] bg-white px-3" style={{ width: 538.5, height: 60 }}>
          <Search className="size-8 text-[#64748b]" strokeWidth={2.2} />
          <input
            type="text"
            value={addressQuery}
            onChange={handleAddressChange}
            placeholder="Cari alamat..."
            disabled={!editable}
            className="ml-2 h-full min-w-0 flex-1 bg-transparent font-[Manrope] text-[20px] font-normal leading-[27px] tracking-[-0.4px] text-[#1e293b] outline-none placeholder:text-[#64748b] disabled:cursor-not-allowed"
          />
          <button
            type="button"
            aria-label="Gunakan lokasi saat ini"
            disabled={!editable || isLocating}
            className="ml-3 grid size-8 shrink-0 place-items-center rounded-full text-[#0f172a] transition-colors hover:bg-[#dcfce9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a] disabled:opacity-50"
            onClick={handleLocate}
          >
            <LocateFixed className="size-7" strokeWidth={2.5} />
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

      <div className="relative overflow-hidden rounded-2xl border border-[#d6dbe3] bg-[#edf2f7]" style={{ width: 538.5, height: 327 }}>
        <Map
          center={center}
          zoom={14}
          onPick={handlePick}
          interactive={editable}
          controls={editable}
          className="absolute inset-0"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-[#ff6600] text-white shadow-lg"
            aria-hidden="true"
          >
            <span className="size-3 rounded-full bg-white" />
            <span className="absolute top-[42px] h-4 w-1 rounded-full bg-[#ff6600]" />
          </div>
        </Map>
        {!editable ? (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-white/90 px-4 py-3 font-[Manrope] text-[14px] font-semibold text-[#0f172a] shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
            Lokasi terkunci. Klik edit untuk mengubah titik toko.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function RetailerProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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

  const handleCancel = () => {
    setDraft(profile);
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = () => {
    const nextErrors = profileFields.reduce((accumulator, field) => {
      if (!draft[field.id].trim()) {
        accumulator[field.id] = `${field.label} wajib diisi`;
      }
      return accumulator;
    }, {});

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setProfile({
      storeName: draft.storeName.trim(),
      category: draft.category.trim(),
      whatsapp: draft.whatsapp.trim(),
      address: draft.address.trim(),
      landmark: draft.landmark.trim(),
      latitude: draft.latitude,
      longitude: draft.longitude,
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full overflow-x-auto font-[Manrope]" style={{ minHeight: 947, backgroundColor: '#f3f3f6' }}>
      <div className="flex" style={{ minWidth: 1379, gap: 30, padding: '30px 42px 70px' }}>
        <section className="shrink-0 rounded-[14px] bg-white" style={{ width: 632.5, minHeight: 650, padding: '37px 30px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 33 }}>
            <div className="flex items-center gap-3">
              <HomeProfileIcon />
              <h2 className="font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-black">
                Informasi Dasar
              </h2>
            </div>
            <button
              type="button"
              aria-label="Edit profil"
              onClick={handleEditClick}
              disabled={isEditing}
              className="flex size-8 items-center justify-center text-black transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c965a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <EditProfileIcon />
            </button>
          </div>

          <div className="flex flex-col" style={{ gap: 18 }}>
            <FieldBox
              field={profileFields[0]}
              value={profile.storeName}
              draftValue={draft.storeName}
              error={errors.storeName}
              isEditing={isEditing}
              onChange={handleFieldChange}
            />
            <div className="flex" style={{ gap: 18 }}>
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
            </div>
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
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="h-11 rounded-[10px] px-6 font-[Manrope] text-[16px] font-semibold text-[#64748b] transition-colors hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#64748b]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="h-11 rounded-[10px] bg-[#50c878] px-7 font-[Manrope] text-[16px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50c878]"
              >
                Simpan
              </button>
            </div>
          ) : null}
        </section>

        <section className="shrink-0 rounded-[14px] bg-white" style={{ width: 632.5, height: 650, padding: '57px 47px' }}>
          <div className="flex flex-col" style={{ width: 538.5 }}>
            <div className="flex items-center gap-2">
              <img
                src="/recipient_retailer icon/basic-icon/location black.svg"
                alt=""
                aria-hidden="true"
                style={{ width: 27, height: 35 }}
              />
              <h2 className="font-[Manrope] text-[28px] font-bold leading-[38px] tracking-[-0.56px] text-black">
                Pinpoint Lokasi
              </h2>
            </div>
            <p className="font-[Manrope] text-[16px] font-normal leading-[22px] tracking-[-0.32px] text-[#64748b]" style={{ width: 538.5, marginTop: 12 }}>
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
      </div>
    </div>
  );
}
