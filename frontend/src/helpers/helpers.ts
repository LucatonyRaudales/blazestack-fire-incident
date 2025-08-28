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
        const latNum = Number(lat);
        const lngNum = Number(lng);
        if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return undefined;
        return { type: "Point", latitude: latNum, longitude: lngNum };
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
export type GeoJSONPoint = {
    type: "Point";
    latitude:  number;
    longitude: number
    address?: string;
};


export default helpers