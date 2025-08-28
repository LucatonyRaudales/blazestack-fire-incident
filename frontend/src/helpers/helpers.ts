import type { GeoJSONPoint } from "../types/types";

const helpers = {
    validate: ({ title, incidentType, lat, lng }: ValidateInput) => {
        const e: Record<string, string> = {};
        if (!title.trim()) e.title = "Title is required.";
        if (!incidentType) e.incident_type = "Incident type is required.";
        const hasLat = lat.trim() !== "";
        const hasLng = lng.trim() !== "";
        if (hasLat !== hasLng) {
            e.location = "If you set latitude or longitude, you must fill both.";
        } else if (hasLat && hasLng) {
            const latNum = Number(lat);
            const lngNum = Number(lng);
            if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) {
                e.location = "Latitude must be a number between -90 and 90.";
            }
            if (!Number.isFinite(lngNum) || lngNum < -180 || lngNum > 180) {
                e.location = (e.location ? e.location + " " : "") + "Longitude must be a number between -180 and 180.";
            }
        }
        return e;
    },
    buildLocation: ({ lat, lng }: BuildLocationInput): GeoJSONPoint | undefined => {
        if (!lat || !lng) return undefined;
        console.log("lat", lat, "lng", lng)
        const latNum = Number(lat);
        const lngNum = Number(lng);
        if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return undefined;
        return { latitude: latNum, longitude: lngNum };
    },
    timeAgo: (iso: string): string => {
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
    },
    typeColor: (t: string): { bg: string } => {
        const key = t.toLowerCase();
        if (key === "fire") return { bg: "#ef4444" };
        if (key === "electrical") return { bg: "#10b981" };
        if (key === "hazmat") return { bg: "#6366f1" };
        return { bg: "#6b7280" };
    },
    locationLabel: (loc?: GeoJSONPoint): string | null => {
        if (!loc) return null;

        const { latitude, longitude } = loc
        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
            return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        }
        return null;
    }



}

type ValidateInput = {
    title: string,
    incidentType: string,
    lat: string,
    lng: string
}

type BuildLocationInput = {
    lat?: string,
    lng?: string
}


export default helpers