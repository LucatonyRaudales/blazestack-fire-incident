import { useEffect, useState } from "react";
import Button from "./components/button";
import Input from "./components/input";
import Dropdown from "./components/dropdown";
import IncidentListPage, { type Incident } from "./list";
import helpers from "./helpers/helpers";

type IncidentType = "FIRE" | "ELECTRICAL" | "HAZMAT";

const INCIDENT_TYPES: { label: string; value: IncidentType }[] = [
  { label: "FIRE", value: "FIRE" },
  { label: "ELECTRICAL", value: "ELECTRICAL" },
  { label: "HAZMAT", value: "HAZMAT" },
];

export const API_URL = "http://localhost:3000";



export default function App() {
  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidentType, setIncidentType] = useState<IncidentType | "">("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ui state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


  // incident list
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchIncidents() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL + "/api/incidents");
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setIncidents(Array.isArray(data) ? data : data.items ?? []);
    } catch (e: any) {
      setError(e.message || "Could not load incidents.");
    } finally {
      setLoading(false);
    }
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const v = helpers.validate({ title, incidentType, lat, lng });
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const locObj = helpers.buildLocation({ lat, lng });
    const locationStr = locObj ? JSON.stringify(locObj) : "";

    setSubmitting(true);
    try {
      let res: Response;

      if (imageFile) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("incident_type", incidentType);
        if (description.trim()) fd.append("description", description.trim());
        if (locationStr) fd.append("location", locationStr);
        fd.append("image", imageFile);

        res = await fetch(`${API_URL}/api/incidents`, {
          method: "POST",
          body: fd,
        });
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim() || undefined,
          incident_type: incidentType,
          location: locationStr || undefined,
        };

        res = await fetch(`${API_URL}/api/incidents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      setMessage("Incident created successfully.");
      setTitle("");
      setDescription("");
      setIncidentType("");
      setLat("");
      setLng("");
      setImageFile(null);
      setErrors({});
    } catch (err: any) {
      setMessage(err.message || "Error creating incident.");
    } finally {
      fetchIncidents();
      setSubmitting(false);
    }
  }




  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="h-screen w-screen">
      <div className=" flex items-center justify-center bg-white p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="title"
                placeholder="Enter the title"
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}

              <Input
                label="description"
                placeholder="Enter the description (optional)"
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
              />

              {/* Dropdown de incident_type */}
              <Dropdown
                label="Incident Type"
                options={INCIDENT_TYPES} // si tu Dropdown espera otro formato, mapea a {label, value}
                value={incidentType}
                onChange={(v: IncidentType) => setIncidentType(v)}
              />
              {errors.incident_type && <p className="text-xs text-red-600">{errors.incident_type}</p>}

              <h4 className="pt-2 text-center text-sm font-medium text-gray-700">
                Enter the location (optional)
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="longitude"
                  placeholder="Enter the longitude"
                  value={lng}
                  onChange={(e: any) => setLng(e.target.value)}
                />
                <Input
                  label="latitude"
                  placeholder="Enter the latitude"
                  value={lat}
                  onChange={(e: any) => setLat(e.target.value)}
                />
              </div>
              {errors.location && <p className="text-xs text-red-600">{errors.location}</p>}

              {/* Imagen opcional */}
              <div className="mt-2">
                <label className="mb-1 block text-sm font-medium text-neutral-800">
                  image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
                />
                {imageFile && (
                  <p className="mt-1 text-xs text-neutral-500">
                    Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Create Incident"}
                </Button>
              </div>

              {message && (
                <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm">
                  {message}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      <div><IncidentListPage incidents={incidents} loading={loading} error={error} /></div>
    </div>
  );
}
