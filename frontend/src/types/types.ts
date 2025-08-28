
export type Incident = {
    id: string | number;
    title: string;
    description?: string;
    incident_type: string;
    location?: GeoJSONPoint;
    imageUrl?: string;
    createdAt?: string;  
};

export type GeoJSONPoint = {
    latitude: number;
    longitude: number
};
