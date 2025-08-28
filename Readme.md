````markdown
# 🔥 Incidents — Mini Full-Stack App - Tony Raudales

> Report and view **incidents** with image and location (lat/lng). Frontend in **React + Vite + Tailwind** and backend in **Go (Gin)**.

---

## 🚀 Quick start

> One command to boot **frontend** and **backend** in dev:

```bash
docker compose up --build
````

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend / API: [http://localhost:3000](http://localhost:3000)

> \[!TIP]
> Running locally without Docker: `yarn dev` in `frontend/` and `go run main.go` in `backend/`.

---

## 🧩 Tech stack & tiny architecture (1–3 lines)

* **Frontend:** React + TypeScript + Vite + TailwindCSS
* **Backend:** Go (Gin), in-memory store, file uploads served from `/uploads`
* **Flow:** React talks to `GET/POST /api/incidents`; Gin handles JSON + multipart (image), stores in memory, and exposes static uploads.

```mermaid
flowchart LR
  U[👤 User] --> V[⚡ React (Vite)]
  V <--> A[🧭 API /api/incidents (Gin)]
  A --> M[(🧠 In-memory Store)]
  A --> F[/📁 /uploads (static)/]
  subgraph Dev
    V -.Docker Compose orchestrates-. A
  end
```

---

## 📚 API — quick reference

### ➕ Create incident

* **JSON**

```http
POST /api/incidents
Content-Type: application/json
```

```json
{
  "title": "Warehouse fire",
  "incident_type": "fire",
  "description": "Smoke in sector A",
  "location": { "latitude": 14.08121, "longitude": -87.18501 } // optional
}
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

## ⚙️ Environment variables

**Frontend (Vite)** — available via `import.meta.env`

* `VITE_API_BASE` → API base URL (dev default: `http://localhost:3000`)


---

## 🧠 Tradeoffs & assumptions

* **Storage:** in-memory (ephemeral) to keep the demo simple; not persistent.
* **Uploads:** local filesystem (`/uploads`); good for dev, not for large-scale prod.
* **Validation:** basic (required `title`, `incident_type`, rudimentary lat/lng checks).
  *With more time:* adopt **Yup** or **Zod** schemas (shared types, stricter runtime validation).
* **Global state:** currently minimal local component state.
  *With more time:* add **global state** (e.g., Zustand or Redux Toolkit) for cross-page sharing, caching, and optimistic updates.
* **UI components:** leveraged Tailwind UI-style components from public examples and **adapted** for speed.

---

## 🗂️ Backend folder structure

> This is the structure I typically aim for. Due to time constraints and a couple of hiccups, the current code is flatter, but this is the **preferred** layout:

```
backend/
├─ main.go
├─ incident/                # Each model in a real project would have its own folder and subfolders like this.
│  ├─ controllers/   
│  ├─ routes/               # routes for all those incident controllers
│  ├─ storage/
│  ├─ model/
├─ uploads/                 # static uploads (dev)
├─ go.mod
└─ go.work                
```

---

## ✅ What’s done vs. ➕ What I’d add with more time

**Done**

* Create/List incidents (JSON & multipart).
* Optional image upload with absolute `imageUrl`.
* Location as `{ latitude, longitude }`.
* Polished UI: validated form, dropdown, skeletons/empty state, responsive cards.
* Dev Dockerization (`docker compose up --build`).

**Next**

* **Global state** (Zustand/Redux Toolkit) + API caching & optimistic UI.
* **Validation with Yup/Zod** (shared types, schema-driven forms).
* Real DB (Postgres) + migrations; optionally **PostGIS** for geo queries.
* Object storage (S3/GCS) with **presigned uploads** + CDN.
* Filtering, search, pagination; edit/delete; sorting.
* AuthN/AuthZ (JWT/OAuth), rate limiting, structured logs & tracing.
* OpenAPI/Swagger, unit/integration tests, CI/CD.
* Map view (Leaflet/Mapbox), bulk actions.
* Improved architecture (services/repositories), proper error model and config module.


---

## 🤖 If I used AI — what for (1–3 bullets)

* Drafting logical **helpers** and boilerplate; reviewing and improving code structure.
* Generating and adapting **UI components** (Tailwind-based) for speed under time constraints.
* Writing and polishing **documentation** (this README), and suggesting validation/architecture improvements.

---

## 🛠️ Local scripts (handy)

```bash
# Frontend
cd frontend && yarn && yarn dev

# Backend
cd backend && go mod tidy && go run main.go
```
