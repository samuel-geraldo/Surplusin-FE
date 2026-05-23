import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { env } from '@/lib/env';

const DEFAULT_CENTER = [106.8456, -6.2088];
let googleMapsPromise;

function toLngLat(center) {
  const nextCenter = Array.isArray(center) ? center : DEFAULT_CENTER;
  return [
    Number(nextCenter[0]) || DEFAULT_CENTER[0],
    Number(nextCenter[1]) || DEFAULT_CENTER[1],
  ];
}

function loadGoogleMaps() {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!env.GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('Google Maps API key missing'));
  }

  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-surplusin-google-maps]');

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.google.maps), { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.dataset.surplusinGoogleMaps = 'true';
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}

export function GoogleLocationMap({
  center = DEFAULT_CENTER,
  editable = false,
  onPick,
  className,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const clickListenerRef = useRef(null);
  const editableRef = useRef(editable);
  const onPickRef = useRef(onPick);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    editableRef.current = editable;
    onPickRef.current = onPick;
  }, [editable, onPick]);

  const applyMapMode = useCallback((map, marker) => {
    const isEditable = editableRef.current;
    map.setOptions({
      draggable: isEditable,
      gestureHandling: isEditable ? 'auto' : 'none',
      keyboardShortcuts: isEditable,
      zoomControl: isEditable,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });
    marker.setDraggable(isEditable);
  }, []);

  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return;

    const position = toLngLat(center);

    loadGoogleMaps()
      .then((maps) => {
        if (!containerRef.current || mapRef.current) return;

        const latLng = { lat: position[1], lng: position[0] };
        const map = new maps.Map(containerRef.current, {
          center: latLng,
          zoom: 16,
          disableDefaultUI: !editableRef.current,
        });
        const marker = new maps.Marker({
          position: latLng,
          map,
          draggable: editableRef.current,
        });

        marker.addListener('dragend', () => {
          if (!editableRef.current) return;
          const nextPosition = marker.getPosition();
          if (!nextPosition) return;
          onPickRef.current?.([nextPosition.lng(), nextPosition.lat()]);
        });

        clickListenerRef.current = map.addListener('click', (event) => {
          if (!editableRef.current || !event.latLng) return;
          marker.setPosition(event.latLng);
          map.panTo(event.latLng);
          onPickRef.current?.([event.latLng.lng(), event.latLng.lat()]);
        });

        mapRef.current = map;
        markerRef.current = marker;
        applyMapMode(map, marker);
        setMapError('');
      })
      .catch(() => {
        setMapError('Peta interaktif tidak bisa dimuat. Menampilkan fallback Google Maps.');
      });
  }, [applyMapMode, center]);

  useEffect(() => {
    initMap();
    return () => {
      clickListenerRef.current?.remove();
      clickListenerRef.current = null;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [initMap]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const position = toLngLat(center);
    const latLng = { lat: position[1], lng: position[0] };
    markerRef.current.setPosition(latLng);
    mapRef.current.panTo(latLng);
    applyMapMode(mapRef.current, markerRef.current);
  }, [applyMapMode, center, editable]);

  const position = toLngLat(center);
  const iframeSrc = `https://maps.google.com/maps?q=${position[1]},${position[0]}&z=16&output=embed`;

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#edf2f7]', className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {mapError ? (
        <div className="absolute inset-0 z-10 bg-[#edf2f7]">
          <iframe
            title="Fallback Google Maps"
            src={iframeSrc}
            className="h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-x-3 top-3 rounded-xl bg-white/90 px-3 py-2 text-center font-[Manrope] text-[12px] font-semibold text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
            {mapError}
          </div>
        </div>
      ) : null}
      {!editable ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-white/90 px-3 py-2 text-center font-[Manrope] text-[12px] font-semibold text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
          Lokasi terkunci. Klik edit untuk mengubah titik lokasi.
        </div>
      ) : null}
    </div>
  );
}
