import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  category?: string;
  description?: string;
  isUserLocation?: boolean;
  isSosLocation?: boolean;
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [31.5204, 74.3587], // Default Lahore / central region
  zoom = 13,
  markers = [],
  onLocationSelect,
  interactive = true,
  className = 'h-80 w-full rounded-2xl overflow-hidden',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix leaflet default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      if (onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
      }
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    return () => {
      // Keep map alive or handle cleanup if unmounting
    };
  }, [center[0], center[1], zoom, interactive]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    markers.forEach((m) => {
      let iconHtml = '';
      if (m.isSosLocation) {
        iconHtml = `
          <div style="background-color: #DC2626; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 16px rgba(220,38,38,0.8); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        `;
      } else if (m.isUserLocation) {
        iconHtml = `
          <div style="background-color: #0F766E; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>
        `;
      } else {
        // Unsafe place pin by category
        const color = m.category === 'poor_lighting' ? '#D97706' : m.category === 'harassment_concern' ? '#DC2626' : '#4B5563';
        iconHtml = `
          <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
            !
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([m.latitude, m.longitude], { icon: customIcon });

      const popupContent = `
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 180px;">
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #1F2937;">${m.title}</h4>
          ${m.category ? `<p style="margin: 0 0 4px; font-size: 11px; color: #0F766E; font-weight: 600; text-transform: uppercase;">${m.category.replace('_', ' ')}</p>` : ''}
          ${m.description ? `<p style="margin: 0; font-size: 12px; color: #4B5563; line-height: 1.4;">${m.description}</p>` : ''}
          <p style="margin: 6px 0 0; font-size: 10px; color: #9CA3AF;">Coords: ${m.latitude.toFixed(4)}, ${m.longitude.toFixed(4)}</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(markersGroup);
    });

    if (markers.length === 1 && mapInstanceRef.current) {
      mapInstanceRef.current.setView([markers[0].latitude, markers[0].longitude], zoom);
    }
  }, [markers, zoom]);

  return <div ref={mapContainerRef} className={className} />;
};
