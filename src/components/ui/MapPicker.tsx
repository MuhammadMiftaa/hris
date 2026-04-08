import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Search, X, Navigation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./FormElements";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMapsLibrary,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/const";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [manualInput, setManualInput] = useState({
    lat: latitude?.toString() || "",
    lng: longitude?.toString() || "",
  });
  const [useManual, setUseManual] = useState(false); // fallback jika API key tidak ada

  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Default center (Jakarta)
  const defaultCenter = { lat: -6.2088, lng: 106.8456 };
  const currentCenter =
    latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter;

  // Load Places library untuk Autocomplete
  const places = useMapsLibrary("places");

  // Inisialisasi Autocomplete
  useEffect(() => {
    if (!places || !searchInputRef.current || !isOpen) return;

    const autocomplete = new places.Autocomplete(searchInputRef.current, {
      types: ["geocode", "establishment"],
      componentRestrictions: { country: "id" },
    });

    autocompleteRef.current = autocomplete;

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setManualInput({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
        setSearchQuery(place.formatted_address || "");
      }
    });

    return () => listener.remove();
  }, [places, isOpen]);

  // Handle klik di peta
  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail?.latLng) {
      const { lat, lng } = e.detail.latLng;
      setManualInput({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
      });
    }
  }, []);

  // Handle drag marker (menggunakan controlled position)
  const [markerPosition, setMarkerPosition] = useState(currentCenter);

  useEffect(() => {
    if (latitude && longitude) {
      const pos = { lat: latitude, lng: longitude };
      setMarkerPosition(pos);
      setManualInput({
        lat: latitude.toFixed(6),
        lng: longitude.toFixed(6),
      });
    }
  }, [latitude, longitude]);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setManualInput({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
      setMarkerPosition({ lat, lng });
    }
  }, []);

  // Ambil lokasi saat ini
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser Anda");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setManualInput({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
        setMarkerPosition({ lat, lng });
      },
      (err) => {
        console.error(err);
        alert(
          "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses.",
        );
      },
      { enableHighAccuracy: true },
    );
  };

  // Apply koordinat
  const handleApply = () => {
    const lat = parseFloat(manualInput.lat);
    const lng = parseFloat(manualInput.lng);

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

  // Jika tidak ada API Key → pakai mode manual
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setUseManual(true);
    }
  }, []);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-(--foreground) opacity-80">
          {label}
        </label>
      )}

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
            Pilih lokasi dari peta...
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
              {/* Search + Lokasi Saya */}
              {!useManual && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted-foreground)"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari alamat atau tempat..."
                      className="w-full rounded-lg border bg-(--input) py-2.5 pl-9 pr-4 text-sm focus:border-(--ring) focus:ring-1"
                    />
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
              )}

              {useManual ? (
                // Manual Input Fallback
                <div className="space-y-4">
                  <p className="text-sm text-(--muted-foreground)">
                    Google Maps tidak tersedia. Masukkan koordinat manual:
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={manualInput.lat}
                        onChange={(e) =>
                          setManualInput((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border bg-(--input) px-4 py-2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={manualInput.lng}
                        onChange={(e) =>
                          setManualInput((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border bg-(--input) px-4 py-2.5"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetCurrentLocation}
                  >
                    Gunakan Lokasi Saya
                  </Button>
                </div>
              ) : (
                <>
                  {/* Map dengan @vis.gl/react-google-maps */}
                  <div className="h-80 w-full rounded-lg overflow-hidden border border-(--border)">
                    <APIProvider
                      apiKey={GOOGLE_MAPS_API_KEY || ""}
                    >
                      <Map
                        defaultCenter={currentCenter}
                        defaultZoom={15}
                        mapId="map-picker"
                        onClick={handleMapClick}
                        style={{ width: "100%", height: "100%" }}
                      >
                        <AdvancedMarker
                          position={markerPosition}
                          draggable
                          onDragEnd={handleMarkerDragEnd}
                        >
                          <Pin
                            background="#ea4335"
                            borderColor="#fff"
                            glyphColor="#fff"
                          />
                        </AdvancedMarker>
                      </Map>
                    </APIProvider>
                  </div>

                  {/* Tampilan koordinat (bisa diedit manual) */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={manualInput.lat}
                        onChange={(e) =>
                          setManualInput((prev) => ({
                            ...prev,
                            lat: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border bg-(--input) px-4 py-2.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={manualInput.lng}
                        onChange={(e) =>
                          setManualInput((prev) => ({
                            ...prev,
                            lng: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border bg-(--input) px-4 py-2.5 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <p className="text-xs text-(--muted-foreground)">
                Klik pada peta atau geser marker merah untuk memilih lokasi.
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
