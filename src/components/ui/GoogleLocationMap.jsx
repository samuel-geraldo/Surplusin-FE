import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAPCN_LIGHT_STYLE } from './mapConfig';

const DEFAULT_CENTER = [106.8456, -6.2088];

function toLngLat(center) {
  const nextCenter = Array.isArray(center) ? center : DEFAULT_CENTER;
  return [
    Number(nextCenter[0]) || DEFAULT_CENTER[0],
    Number(nextCenter[1]) || DEFAULT_CENTER[1],
  ];
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

    if (isEditable) {
      map.dragPan.enable();
      map.scrollZoom.enable();
      map.doubleClickZoom.enable();
      map.keyboard.enable();
    } else {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.keyboard.disable();
    }

    marker.setDraggable(isEditable);
  }, []);

  const initMap = useCallback(() => {
    if (!containerRef.current || mapRef.current) return;

    const position = toLngLat(center);
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAPCN_LIGHT_STYLE,
      center: position,
      zoom: 16,
      attributionControl: false,
    });

    if (editableRef.current) {
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    const marker = new maplibregl.Marker({
      draggable: editableRef.current,
      color: '#ef4444' // red pin
    })
      .setLngLat(position)
      .addTo(map);

    marker.on('dragend', () => {
      if (!editableRef.current) return;
      const lngLat = marker.getLngLat();
      onPickRef.current?.([lngLat.lng, lngLat.lat]);
    });

    map.on('click', (event) => {
      if (!editableRef.current) return;
      const lngLat = event.lngLat;
      marker.setLngLat(lngLat);
      map.panTo(lngLat);
      onPickRef.current?.([lngLat.lng, lngLat.lat]);
    });

    mapRef.current = map;
    markerRef.current = marker;
    applyMapMode(map, marker);
  }, [applyMapMode, center]);

  useEffect(() => {
    initMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const position = toLngLat(center);
    markerRef.current.setLngLat(position);
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
