# 🔥 Incidents — Mini Full‑Stack App (by Tony Raudales)

> Report and view **incidents** with optional image and location (lat/lng). Frontend in **React + Vite + Tailwind** and backend in **Go (Gin)**.

---

## 🚀 Quick start

**Dev with Docker (recommended)**

```bash
docker compose up --build
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend / API: [http://localhost:3000](http://localhost:3000)

**Dev without Docker**

```bash
# Frontend
cd frontend && yarn && yarn dev

# Backend
cd backend && go mod tidy && go run main.go
```

> **Tip**: By default the frontend targets `http://localhost:3000` for the API. You can override with `VITE_API_BASE`.

---

## 🧩 Tech stack & tiny architecture (1–3 lines)

* **Frontend:** React + TypeScript + Vite + TailwindCSS
* **Backend:** Go (Gin), in-memory store, file uploads served from `/uploads`
* **Flow:** React calls `GET/POST /api/incidents`; Gin handles `application/json` and `multipart/form-data` (image), stores in memory, and serves static uploads.

```mermaid
flowchart LR
  U[User] --> V[React (Vite)]
  V <--> A[API /api/incidents (Gin)]
  A --> M[In-memory store]
  A --> F[/uploads (static)/]
  subgraph Dev
    V -. Docker Compose orchestrates .- A
  end
```

---

## 📚 API — quick reference

### ➕ Create incident (JSON)

```http
POST /api/incidents
Content-Type: application/json
```

```json
{
  "title": "Warehouse fire",
  "incident_type": "fire",
  "description": "Smoke in sector A",
  "location": { "latitude": 14.08121, "longitude": -87.18501 }
}
```

* `location` is **optional**. If present, the server stores it **as received** (no geocoding/rounding).

### ➕ Create incident (multipart with image)

```http
POST /api/incidents
Content-Type: multipart/form-data
```

**Fields**

* `title` *(string, required)*
* `incident_type` *(string, required)* — e.g., `fire`, `accident`
* `description` *(string, optional)*
* `location` *(string, optional)* — JSON string, e.g. `{"latitude":14.08121,"longitude":-87.18501}`
* `image` *(file, optional)* — png/jpg/jpeg

**cURL example**

```bash
curl -X POST http://localhost:3000/api/incidents \
  -F "title=Warehouse fire" \
  -F "incident_type=fire" \
  -F "description=Smoke in sector A" \
  -F 'location={"latitude":14.08121,"longitude":-87.18501}' \
  -F image=@/path/to/photo.jpg
```

### 📜 List incidents

```http
GET /api/incidents
```

```json
[
  {
    "id": "uuid",
    "title": "Warehouse fire",
    "incident_type": "fire",
    "description": "Smoke in sector A",
    "location": { "latitude": 14.08121, "longitude": -87.18501 },
    "imageUrl": "http://localhost:3000/uploads/xxxx.jpg",
    "createdAt": "2025-08-28T00:00:00Z"
  }
]
```

---

## ⚙️ Configuration

**Frontend (Vite)** — available via `import.meta.env`:

* `VITE_API_BASE` → API base URL (default dev: `http://localhost:3000`).

**Backend**

* No environment variables required for dev. Static files are served from `/uploads`.

---

## 🧠 Tradeoffs & assumptions

* **Storage:** in-memory (ephemeral) to keep the demo simple → not persistent.
* **Uploads:** local filesystem (`/uploads`) → great for dev, not for large-scale prod.
* **Validation:** basic (required `title`, `incident_type`, rudimentary lat/lng checks).

  * *Future:* adopt **Zod**/**Yup** for shared schemas & stricter runtime validation.
* **Global state:** minimal local component state today.

  * *Future:* **Zustand** or **Redux Toolkit** for cross-page state + optimistic updates.
* **CORS:** enabled for local dev (frontend ↔ backend at different ports).

---

## 🗂️ Backend folder structure (target)

> Current code is intentionally flat for speed. This is the **preferred layout** long-term:

```
backend/
├─ main.go
├─ incident/
│  ├─ controllers/
│  ├─ routes/
│  ├─ storage/
│  └─ model/
├─ uploads/                 # static uploads (dev)
├─ go.mod
└─ go.work
```

---

## ✅ What’s done vs. ➕ Next up

**Done**

* Create/List incidents (JSON & multipart).
* Optional image upload with absolute `imageUrl`.
* Location as `{ latitude, longitude }`.
* Polished UI: validated form, dropdown, skeleton/empty state, responsive cards.
* Dev Dockerization (`docker compose up --build`).

**Next**

* **Global state** (Zustand/Redux Toolkit) + API caching & optimistic UI.
* **Schema validation** (Zod/Yup) & shared types.
* Real DB (Postgres) + migrations; optionally **PostGIS** for geo queries.
* Object storage (S3/GCS) with **presigned uploads** + CDN.
* Filtering, search, pagination; edit/delete; sorting.
* AuthN/AuthZ (JWT/OAuth), rate limiting, structured logs & tracing.
* OpenAPI/Swagger, unit/integration tests, CI/CD.
* Map view (Leaflet/Mapbox), bulk actions.
* Improved architecture (services/repositories), error model & config module.

---

## 🛠️ Handy scripts

```bash
# Frontend
cd frontend && yarn && yarn dev

# Backend
cd backend && go mod tidy && go run main.go
```

---

## 🧪 Smoke test checklist

* [ ] `POST /api/incidents` (JSON) creates an incident
* [ ] `POST /api/incidents` (multipart) uploads an image and returns `imageUrl`
* [ ] `GET /api/incidents` lists items with `createdAt`
* [ ] Uploaded files are reachable under `http://localhost:3000/uploads/...`

---

## 🧾 License

MIT — do what you love. Credit appreciated.
