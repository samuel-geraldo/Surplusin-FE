import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const MAPS_API_KEY = 'AIzaSyAxvkMdHwDpYBUi62RVVoO4O9SmG_AgPp0';
const DEFAULT_CENTER = [106.8456, -6.2088];

let mapsScriptLoaded = false;
let mapsScriptLoading = false;
const mapsReadyCallbacks = [];

function loadMapsScript(callback) {
  if (mapsScriptLoaded) {
    callback();
    return;
  }

  mapsReadyCallbacks.push(callback);

  if (mapsScriptLoading) return;

  mapsScriptLoading = true;
  window.__googleMapsReady = () => {
    mapsScriptLoaded = true;
    mapsReadyCallbacks.splice(0).forEach((item) => item());
  };

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=__googleMapsReady`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function toLatLng(center) {
  const nextCenter = Array.isArray(center) ? center : DEFAULT_CENTER;
  return {
    lat: Number(nextCenter[1]) || DEFAULT_CENTER[1],
    lng: Number(nextCenter[0]) || DEFAULT_CENTER[0],
  };
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
  const editableRef = useRef(editable);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    editableRef.current = editable;
    onPickRef.current = onPick;
  }, [editable, onPick]);

  const applyMapMode = useCallback((map, marker) => {
    const isEditable = editableRef.current;

    map.setOptions({
      disableDefaultUI: !isEditable,
      zoomControl: isEditable,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      draggable: isEditable,
      scrollwheel: isEditable,
      disableDoubleClickZoom: !isEditable,
      keyboardShortcuts: isEditable,
    });

    marker.setDraggable(isEditable);
  }, []);

  const initMap = useCallback(() => {
    if (!containerRef.current || !window.google || mapRef.current) return;

    const position = toLatLng(center);
    const map = new window.google.maps.Map(containerRef.current, {
      center: position,
      zoom: 16,
      disableDefaultUI: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      position,
      map,
      draggable: editableRef.current,
      animation: window.google.maps.Animation.DROP,
      title: 'Lokasi',
    });

    marker.addListener('dragend', (event) => {
      if (!editableRef.current) return;
      onPickRef.current?.([event.latLng.lng(), event.latLng.lat()]);
    });

    map.addListener('click', (event) => {
      if (!editableRef.current) return;
      const nextPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      marker.setPosition(nextPosition);
      map.panTo(nextPosition);
      onPickRef.current?.([nextPosition.lng, nextPosition.lat]);
    });

    mapRef.current = map;
    markerRef.current = marker;
    applyMapMode(map, marker);
  }, [applyMapMode, center]);

  useEffect(() => {
    loadMapsScript(initMap);
  }, [initMap]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const position = toLatLng(center);
    markerRef.current.setPosition(position);
    mapRef.current.panTo(position);
    applyMapMode(mapRef.current, markerRef.current);
  }, [applyMapMode, center, editable]);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#edf2f7]', className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {!editable ? (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl bg-white/90 px-3 py-2 text-center font-[Manrope] text-[12px] font-semibold text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
          Lokasi terkunci. Klik edit untuk mengubah titik lokasi.
        </div>
      ) : null}
    </div>
  );
}
