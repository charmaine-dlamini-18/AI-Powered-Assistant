import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import type { Report } from "@/lib/mock-data";

// Fix default icon URLs (Vite/bundler-friendly)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Approximate coordinates for Mvutshini / Port Shepstone area
const CENTER: [number, number] = [-30.7412, 30.4523];

// Deterministic offset from report id so pins are stable
function coordsFor(id: string, i: number): [number, number] {
  const n = parseInt(id.replace(/\D/g, ""), 10) || i;
  const dLat = (((n * 37) % 100) - 50) / 1000; // ~±0.05°
  const dLng = (((n * 53) % 100) - 50) / 1000;
  return [CENTER[0] + dLat, CENTER[1] + dLng];
}

const statusFill = (status: string) => {
  if (status === "Resolved") return "#2E8B57";
  if (status === "In Progress" || status === "Assigned") return "#F4A62A";
  return "#1E4D8C";
};

export default function CommunityMap({ reports }: { reports: Report[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Force leaflet to recalc size after mount
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={containerRef} className="h-[520px] w-full">
      <MapContainer
        center={CENTER}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((r, i) => {
          const pos = coordsFor(r.id, i);
          return (
            <div key={r.id}>
              <CircleMarker
                center={pos}
                radius={14}
                pathOptions={{
                  color: statusFill(r.status),
                  fillColor: statusFill(r.status),
                  fillOpacity: 0.35,
                  weight: 2,
                }}
              />
              <Marker position={pos}>
                <Popup>
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-gray-500">{r.id}</div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-xs text-gray-600">
                      {r.location} · {r.ward}
                    </div>
                    <div className="text-xs">
                      Status: <strong>{r.status}</strong> · {r.urgency}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
