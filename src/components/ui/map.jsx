import 'maplibre-gl/dist/maplibre-gl.css';

import MapLibreGL from 'maplibre-gl';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import { getMapStyleForTheme, MAPCN_LIGHT_STYLES } from './mapConfig';

const DEFAULT_CENTER = [106.8456, -6.2088];

export const Map = forwardRef(
  (
    {
      center = DEFAULT_CENTER,
      zoom = 12,
      className,
      children,
      onPick,
      interactive = true,
      controls = true,
      theme = 'light',
      styles = MAPCN_LIGHT_STYLES,
      loading,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const pickRef = useRef(onPick);
    const initialCenterRef = useRef(center);
    const initialZoomRef = useRef(zoom);
    const mapOptionsRef = useRef(props);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const mapStyle = useMemo(
      () => getMapStyleForTheme(theme, styles),
      [theme, styles],
    );

    useImperativeHandle(ref, () => mapRef.current, []);

    useEffect(() => {
      pickRef.current = onPick;
    }, [onPick]);

    useEffect(() => {
      mapOptionsRef.current = props;
    });

    useEffect(() => {
      let cancelled = false;
      let map;
      let resizeObserver;

      try {
        if (!containerRef.current) {
          return () => {
            cancelled = true;
          };
        }

        map = new MapLibreGL.Map({
          container: containerRef.current,
          style: mapStyle,
          center: initialCenterRef.current,
          zoom: initialZoomRef.current,
          attributionControl: false,
          interactive,
          ...mapOptionsRef.current,
        });

        mapRef.current = map;

        if (controls) {
          map.addControl(
            new MapLibreGL.NavigationControl({ showCompass: false }),
            'top-right',
          );
        }

        map.addControl(
          new MapLibreGL.AttributionControl({ compact: true }),
          'bottom-right',
        );

        map.on('load', () => {
          if (!cancelled) {
            setIsLoading(false);
            map.resize();
            requestAnimationFrame(() => map.resize());
          }
        });

        map.on('error', (event) => {
          setError(event.error?.message ?? 'Map failed to load');
        });

        map.on('click', (event) => {
          pickRef.current?.([event.lngLat.lng, event.lngLat.lat]);
        });

        resizeObserver = new ResizeObserver(() => {
          map.resize();
        });
        resizeObserver.observe(containerRef.current);
      } catch (nextError) {
        queueMicrotask(() => {
          if (!cancelled) {
            setError(nextError.message);
            setIsLoading(false);
          }
        });
      }

      return () => {
        cancelled = true;
        resizeObserver?.disconnect();
        map?.remove();
        if (mapRef.current === map) {
          mapRef.current = null;
        }
      };
    }, [controls, interactive, mapStyle]);

    useEffect(() => {
      mapRef.current?.easeTo({ center, zoom, duration: 450 });
    }, [center, zoom]);

    return (
      <div
        className={cn(
          'relative h-full w-full overflow-hidden bg-[#edf2f7]',
          className,
        )}
      >
        <div ref={containerRef} className="absolute inset-0" style={{ position: 'absolute', inset: 0 }} />
        {(loading || isLoading) && !error ? <DefaultLoader /> : null}
        {error ? <MapError message={error} /> : null}
        {children}
      </div>
    );
  },
);

Map.displayName = 'Map';

function DefaultLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
      <div className="flex gap-1.5" aria-label="Memuat peta">
        <span className="size-2 animate-pulse rounded-full bg-[#64748b]" />
        <span className="size-2 animate-pulse rounded-full bg-[#64748b] [animation-delay:150ms]" />
        <span className="size-2 animate-pulse rounded-full bg-[#64748b] [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function MapError({ message }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-white/85 p-4 text-center text-label text-[#64748b]">
      <span>Gagal memuat peta: {message}</span>
    </div>
  );
}
