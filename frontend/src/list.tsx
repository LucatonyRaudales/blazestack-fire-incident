/**
 * 94% of this code was made by AI. the time finished up
 */

import { API_URL } from "./App";
import type { GeoJSONPoint } from "./helpers/helpers";



export type Incident = {
    id: string | number;
    title: string;
    description?: string;
    incident_type: string; // e.g., "fire" | "medical" | "police"
    location?: GeoJSONPoint;
    imageUrl?: string;    // adjust to your backend field name if different
    created_at?: string;   // ISO string (optional)
};

export default function IncidentListPage({ incidents, loading, error }: IncidentListPageProps) {

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="mx-auto max-w-6xl">
                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <SkeletonGrid />
                ) : incidents.length === 0 ? (
                    <h4>Empty List :/</h4>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {incidents.map((it) => (
                            <IncidentCard key={it.id} incident={it} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


type IncidentListPageProps = {
    incidents: Incident[],
    loading: boolean,
    error: string | null
}

/* ------------------------- UI subcomponents ------------------------- */

function IncidentCard({ incident }: { incident: Incident }) {
    const color = typeColor(incident.incident_type);
    const when = incident.created_at ? timeAgo(incident.created_at) : null;
    const locText = locationLabel(incident.location);

    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
            {/* Image / placeholder */}
            {incident.imageUrl ? (
                <img
                    src={API_URL + incident.imageUrl}
                    alt={incident.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="h-40 w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
            )}

            <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-base font-semibold text-neutral-900">
                        {incident.title}
                    </h3>
                    <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: color.bg }}
                        title={incident.incident_type}
                    >
                        {incident.incident_type}
                    </span>
                </div>

                {incident.description && (
                    <p className="line-clamp-3 text-sm text-neutral-600">{incident.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="truncate">
                        {locText ? `📍 ${locText}` : "—"}
                    </span>
                    {when && <span title={new Date(incident.created_at!).toLocaleString()}>⏱ {when}</span>}
                </div>
            </div>
        </article>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                >
                    <div className="h-40 w-full bg-neutral-200" />
                    <div className="space-y-3 p-4">
                        <div className="h-4 w-3/4 rounded bg-neutral-200" />
                        <div className="h-3 w-full rounded bg-neutral-200" />
                        <div className="h-3 w-2/3 rounded bg-neutral-200" />
                        <div className="flex justify-between">
                            <div className="h-3 w-1/3 rounded bg-neutral-200" />
                            <div className="h-3 w-16 rounded bg-neutral-200" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}



/* ------------------------------ helpers ----------------------------- */

function typeColor(t: string): { bg: string } {
    const key = t.toLowerCase();
    if (key === "fire") return { bg: "#ef4444" };     // red-500
    if (key === "medical") return { bg: "#10b981" };  // emerald-500
    if (key === "police") return { bg: "#6366f1" };   // indigo-500
    return { bg: "#6b7280" }; // gray-500 (default)
}

function timeAgo(iso: string): string {
    const now = new Date().getTime();
    const then = new Date(iso).getTime();
    const diff = Math.max(0, now - then);

    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return `${s}s ago`;
}

function locationLabel(loc?: GeoJSONPoint): string | null {
    if (!loc) return null;
    if (loc.address) return loc.address;

    const { latitude, longitude } = loc
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }
    return null;
}
