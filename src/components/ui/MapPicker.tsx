import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, X, Navigation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./FormElements";

// ─── Leaflet imports ───────────────────────────────────────────────────────────
// react-leaflet must be installed: npm i react-leaflet leaflet @types/leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icon broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom pink marker matching brand colors
const pinkIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #9d167c, #d10071);
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(209,0,113,0.5);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Fly map to given coordinates */
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { animate: true, duration: 0.8 });
  }, [center, map]);
  return null;
}

/** Listen for map click events */
function ClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Nominatim geocoder (OpenStreetMap) ────────────────────────────────────────

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

async function searchAddress(query: string): Promise<NominatimResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("countrycodes", "id");
  url.searchParams.set("limit", "5");

  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "id", "User-Agent": "WafaHRIS/1.0" },
  });
  if (!res.ok) throw new Error("Nominatim request failed");
  return res.json();
}

// ─── MapPicker component ──────────────────────────────────────────────────────

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  label?: string;
  error?: string;
  className?: string;
}

export function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  label,
  error,
  className,
}: MapPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null,
  );
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Manual coord inputs
  const [manualLat, setManualLat] = useState(latitude?.toFixed(6) ?? "");
  const [manualLng, setManualLng] = useState(longitude?.toFixed(6) ?? "");

  // Default center: Jakarta
  const defaultCenter: [number, number] = [-6.2088, 106.8456];
  const initialCenter: [number, number] =
    latitude && longitude ? [latitude, longitude] : defaultCenter;

  // Sync manual inputs when marker moves
  const updateMarker = useCallback((lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setManualLat(lat.toFixed(6));
    setManualLng(lng.toFixed(6));
  }, []);

  // Map click
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      updateMarker(lat, lng);
    },
    [updateMarker],
  );

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchAddress(searchQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Select search result
  const handleSelectResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    updateMarker(lat, lng);
    setFlyTo([lat, lng]);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  // Close search results when clicking outside
  useEffect(() => {
    if (searchResults.length === 0) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchResults]);

  // Current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser Anda");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        updateMarker(coords.latitude, coords.longitude);
        setFlyTo([coords.latitude, coords.longitude]);
      },
      () => alert("Gagal mendapatkan lokasi. Pastikan GPS aktif."),
      { enableHighAccuracy: true },
    );
  };

  // Apply coords
  const handleApply = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Koordinat tidak valid");
      return;
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Koordinat di luar rentang yang valid");
      return;
    }
    onLocationChange(lat, lng);
    setIsOpen(false);
  };

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-left transition-colors",
          "border-(--border) hover:border-(--ring)",
          "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
          error && "border-(--destructive)",
        )}
      >
        <MapPin size={16} className="shrink-0 text-(--muted-foreground)" />
        {latitude !== null && longitude !== null ? (
          <span className="text-(--foreground) font-mono text-xs">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        ) : (
          <span className="text-(--muted-foreground)">
            Pilih lokasi dari peta…
          </span>
        )}
      </button>

      {error && <p className="text-xs text-(--destructive)">{error}</p>}

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-(--border) bg-(--card)"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-(--border) px-5 py-3">
              <h3 className="text-sm font-bold text-(--foreground)">
                Pilih Lokasi
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-(--muted-foreground) hover:text-(--foreground)"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Search bar */}
              <div className="flex gap-2">
                <div ref={searchContainerRef} className="relative flex-1">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground) z-10"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari alamat atau tempat…"
                    className="w-full rounded-lg border bg-(--input) py-2.5 pl-9 pr-4 text-sm focus:border-(--ring) focus:ring-1 border-(--border) relative z-10"
                  />
                  {searching && (
                    <Loader2
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-(--muted-foreground) z-10"
                    />
                  )}

                  {/* Search results popup - absolute positioned */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-(--border) bg-(--card) shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                      {searchResults.map((result, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-(--muted) transition-colors border-b border-(--border) last:border-0"
                        >
                          <MapPin
                            size={14}
                            className="shrink-0 mt-0.5 text-(--primary)"
                          />
                          <span className="text-(--foreground) line-clamp-2">
                            {result.display_name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                >
                  <Navigation size={16} />
                  <span className="hidden sm:inline ml-1">Lokasi Saya</span>
                </Button>
              </div>

              {/* Map */}
              <div className="h-80 w-full rounded-xl overflow-hidden border border-(--border) relative z-0">
                <MapContainer
                  center={initialCenter}
                  zoom={markerPos ? 16 : 12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <ClickHandler onMapClick={handleMapClick} />
                  <MapController center={flyTo} />
                  {markerPos && (
                    <Marker
                      position={markerPos}
                      icon={pinkIcon}
                      draggable
                      eventHandlers={{
                        dragend(e: L.DragEndEvent) {
                          const { lat, lng } = (
                            e.target as L.Marker
                          ).getLatLng();
                          updateMarker(lat, lng);
                        },
                      }}
                    />
                  )}
                </MapContainer>
              </div>

              {/* Coordinate inputs */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm mb-1 text-(--foreground) opacity-80">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => {
                      setManualLat(e.target.value);
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v >= -90 && v <= 90) {
                        const lng = parseFloat(manualLng);
                        if (!isNaN(lng)) {
                          setMarkerPos([v, lng]);
                          setFlyTo([v, lng]);
                        }
                      }
                    }}
                    className="w-full rounded-lg border bg-(--input) px-4 py-2.5 font-mono text-sm border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-(--foreground) opacity-80">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={manualLng}
                    onChange={(e) => {
                      setManualLng(e.target.value);
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v >= -180 && v <= 180) {
                        const lat = parseFloat(manualLat);
                        if (!isNaN(lat)) {
                          setMarkerPos([lat, v]);
                          setFlyTo([lat, v]);
                        }
                      }
                    }}
                    className="w-full rounded-lg border bg-(--input) px-4 py-2.5 font-mono text-sm border-(--border) focus:border-(--ring) focus:outline-none focus:ring-1"
                  />
                </div>
              </div>

              <p className="text-xs text-(--muted-foreground)">
                Klik pada peta atau geser marker untuk memilih lokasi. Data peta
                © OpenStreetMap contributors.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-(--border) px-5 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleApply}
              >
                Terapkan Lokasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
