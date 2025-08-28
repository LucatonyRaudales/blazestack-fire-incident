import { API_URL } from "./index.page";
import helpers from "../helpers/helpers";
import type { Incident } from "../types/types";


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

const IncidentCard = ({ incident }: { incident: Incident }) => {
    const color = helpers.typeColor(incident.incident_type);
    const when = incident.createdAt ? helpers.timeAgo(incident.createdAt) : null;
    const locText = helpers.locationLabel(incident.location);

    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
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
                        📍 {locText ? locText : "—"}
                    </span>
                    {when && <span title={new Date(incident.createdAt!).toLocaleString()}>⏱ {when}</span>}
                </div>
            </div>
        </article>
    );
}

const SkeletonGrid = () => {
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
