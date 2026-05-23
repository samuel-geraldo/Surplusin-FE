import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Input, GoogleLocationMap } from '@/components/ui';
import { searchAddresses, shouldSearchAddress } from './locationSearch';

const DEFAULT_CENTER = [106.8456, -6.2088];

export function LocationPicker({ register, confirmed, setValue }) {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [locationError, setLocationError] = useState('');
  const selectedAddressRef = useRef('');
  const addressField = register('address');

  const handlePick = useCallback(
    (nextCenter) => {
      setCenter(nextCenter);
      setLocationError('');
      setValue('longitude', nextCenter[0], { shouldDirty: true });
      setValue('latitude', nextCenter[1], { shouldDirty: true });
      setValue('locationConfirmed', false, { shouldDirty: true });
    },
    [setValue],
  );

  function handleLocate() {
    setLocationError('');

    if (!navigator.geolocation) {
      setValue('locationConfirmed', false);
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
        setValue('locationConfirmed', false);
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

  useEffect(() => {
    if (addressQuery === selectedAddressRef.current) {
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
  }, [addressQuery]);

  function handleAddressChange(event) {
    const nextQuery = event.target.value;

    addressField.onChange(event);
    selectedAddressRef.current = '';
    setAddressQuery(nextQuery);
    setLocationError('');
    setValue('locationConfirmed', false, { shouldDirty: true });

    if (!shouldSearchAddress(nextQuery)) {
      setAddressResults([]);
      setSearchError('');
      setIsSearching(false);
    }
  }

  function handleAddressSelect(result) {
    selectedAddressRef.current = result.label;
    setAddressQuery(result.label);
    setAddressResults([]);
    setSearchError('');
    setValue('address', result.label, { shouldDirty: true, shouldValidate: true });
    handlePick(result.center);
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-body2 font-extrabold text-black">
        <MapPinIcon />
        Lokasi
      </label>

      <div className="relative">
        <SearchIcon />
        <Input
          placeholder="Cari alamat..."
          className="h-[56px] rounded-lg border-black px-10 pr-11 text-body2"
          {...addressField}
          value={addressQuery}
          onChange={handleAddressChange}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center text-[#3b9b5b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal"
          aria-label="Gunakan lokasi saat ini"
          disabled={isLocating}
          onClick={handleLocate}
        >
          <TargetIcon />
        </button>
        {(addressResults.length > 0 || isSearching || searchError) && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-[#d6dbe3] bg-white shadow-lg">
            {isSearching && (
              <p className="px-4 py-3 text-label text-[#64748b]">
                Mencari alamat...
              </p>
            )}
            {searchError && (
              <p className="px-4 py-3 text-label text-red-dark">{searchError}</p>
            )}
            {addressResults.map((result) => (
              <button
                key={result.id}
                type="button"
                className="block w-full px-4 py-3 text-left text-label text-[#0f172a] hover:bg-green-light focus-visible:bg-green-light focus-visible:outline-none"
                onClick={() => handleAddressSelect(result)}
              >
                {result.label}
              </button>
            ))}
          </div>
        )}
        {locationError ? (
          <p className="mt-2 text-label text-red-dark">{locationError}</p>
        ) : null}
      </div>

      <div className="relative min-h-[190px] overflow-hidden rounded-2xl border border-[#d6dbe3] bg-[#edf2f7]">
        <Map
          center={center}
          editable={!confirmed}
          onPick={handlePick}
          className="absolute inset-0"
        />
        {confirmed ? (
          <div
            className="absolute inset-0 z-10 cursor-not-allowed"
            aria-label="Lokasi sudah dikonfirmasi"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#d6dbe3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-body2 font-bold text-[#0f172a]">Konfirmasi Lokasi</p>
          <p className="text-label text-[#64748b]">
            {confirmed
              ? 'Lokasi sudah dikonfirmasi.'
              : 'Pin sudah sesuai dengan titik lokasi?'}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={confirmed ? 'primary' : 'secondary'}
          className="min-h-11 rounded-xl px-6 text-body2"
          onClick={() => {
            setValue('locationConfirmed', !confirmed, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        >
          {confirmed ? 'Ubah' : 'OK'}
        </Button>
      </div>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#64748b]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}
