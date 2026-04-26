# Study Planner

A full-stack productivity workspace for students: a Kanban task board, a rich-text notebook system with auto-save, and a dashboard of study analytics. Built with **Spring Boot + PostgreSQL** on the back, **React + Vite** on the front, and JWT authentication end-to-end.

> **Live demo:** _[add URL once deployed — see "Deploy" section below]_

---

## Features

- **Auth** — register / login with email + password (BCrypt-hashed), stateless JWT sessions, protected routes on both client and server.
- **Kanban tasks** — four-column board (To-do · In Progress · In Review · Complete) with drag-and-drop between columns, per-task category tags, due-date badges (overdue / soon / upcoming), and a 0–100 % progress slider.
- **Notes** — Notion-style three-pane workspace: notebooks (classes) → notes → editor. TipTap rich-text editor with H1–H3, lists, blockquote, inline code, links, and bold/italic/strike. **Auto-save** debounced at 1.2 s with live `Saving… → Saved` indicator and a `beforeunload` warning while a draft is dirty.
- **Dashboard** — summary cards plus four Recharts visualisations: tasks by status, tasks by category, progress distribution, and tasks completed per week.
- **Theming** — light / dark mode toggle, persisted to `localStorage`. Aesthetic palette built around a warm beige `--accent: #d6bfa9` with pastel column accents.
- **Toast system** — non-blocking success / error / info notifications via React Context.

---

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, React Router v6, axios, @hello-pangea/dnd, Recharts, TipTap (StarterKit + Link + Placeholder) |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA, JJWT 0.12 (HS384), Hibernate 6, Lombok, Bean Validation |
| Database | PostgreSQL 16 |
| Auth | JWT (Bearer tokens) + BCrypt |
| Build | Maven (backend), npm + Vite (frontend) |

### Architecture

```
React (Vite) ──HTTP/JSON + JWT──▶ Spring Boot REST API ──JPA──▶ PostgreSQL
        │                                  │
        ├ axios interceptor injects token   ├ JwtAuthenticationFilter
        ├ RequireAuth route guard           ├ Stateless SecurityFilterChain
        └ Context: Auth / Theme / Toast     └ @RestControllerAdvice global errors
```

The backend uses a classic Controller → Service → Repository layering with DTO records for request / response shapes. All endpoints under `/api/**` (except `/api/auth/**`) require a valid `Authorization: Bearer <token>` header.

---

## Project structure

```
full-stack-app/
├── backend/                       # Spring Boot 3.2 / Java 17
│   ├── pom.xml
│   └── src/main/java/com/studyplanner/
│       ├── controller/            # AuthController, TaskController, NotebookController, NoteController
│       ├── service/               # JwtService, TaskService, NoteService, NotebookService
│       ├── repository/            # Spring Data JPA interfaces
│       ├── model/                 # @Entity classes (User, Task, Notebook, Note)
│       ├── dto/                   # Java records for I/O
│       ├── config/                # SecurityConfig, JwtAuthenticationFilter
│       └── exception/             # GlobalExceptionHandler
└── frontend/                      # React 18 + Vite
    └── src/
        ├── api/client.js          # axios instance + auth interceptor
        ├── auth/                  # AuthContext, RequireAuth
        ├── components/            # Layout, Sidebar, TaskCard, NoteEditor, …
        ├── pages/                 # Login, Register, Home, Tasks, Notes, Dashboard
        └── index.css              # Design tokens + component styles
```

---

## Run locally

### Prerequisites

- **Java 17+**
- **Maven 3.9+**
- **Node 18+**
- **PostgreSQL 14+** running locally

### 1. Database

```bash
createdb studyplanner
```

### 2. Backend

```bash
cd backend
# Optional: copy .env.example → .env and edit; or export inline:
export SPRING_DATASOURCE_USERNAME=$(whoami)
export JWT_SECRET="$(openssl rand -base64 48)"

mvn spring-boot:run
# → http://localhost:8080
```

Tables (`users`, `tasks`, `notebooks`, `notes`) are auto-created by Hibernate (`ddl-auto=update`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

In dev, Vite proxies `/api` → `http://localhost:8080`, so no `VITE_API_URL` needed.

Open http://localhost:5173, register a user, and you're in.

---

## API reference

All requests except `/api/auth/**` require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | `{name, email, password}` → `{token, user}` |
| POST | `/api/auth/login` | `{email, password}` → `{token, user}` |
| GET | `/api/tasks` | List all tasks for the user |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}/status` | Move task between Kanban columns |
| DELETE | `/api/tasks/{id}` | Delete task |
| GET | `/api/notebooks` | List notebooks (with `noteCount`) |
| POST | `/api/notebooks` | Create notebook |
| DELETE | `/api/notebooks/{id}` | Delete notebook (cascades to notes) |
| GET | `/api/notes?notebookId=` | List notes (filtered by notebook) |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/{id}` | Update note (title + HTML content) |
| DELETE | `/api/notes/{id}` | Delete note |

---

## Deploy

The app is two services + a database. The cheapest free path is **Render** (backend + Postgres) and **Vercel** (frontend).

### A. Backend on Render

1. Push this repo to GitHub.
2. On [render.com](https://render.com): **New → PostgreSQL** (free tier). Copy the *Internal Database URL* — it looks like `postgresql://user:pwd@host/db`. Convert the prefix to JDBC: `jdbc:postgresql://host/db?user=user&password=pwd` (or split into the three vars below).
3. **New → Web Service**, point it at this repo, set the root directory to `backend/`.
   - **Build command:** `mvn -B -DskipTests package`
   - **Start command:** `java -jar target/study-planner-backend-0.0.1-SNAPSHOT.jar`
4. Add environment variables:
   - `SPRING_DATASOURCE_URL` → `jdbc:postgresql://<host>/<db>`
   - `SPRING_DATASOURCE_USERNAME` → from Render
   - `SPRING_DATASOURCE_PASSWORD` → from Render
   - `JWT_SECRET` → `openssl rand -base64 48` output (≥ 32 bytes)
   - `CORS_ALLOWED_ORIGINS` → your Vercel URL once you have it (e.g. `https://study-planner.vercel.app`)
5. Deploy. The first boot takes ~2 min; Hibernate creates the tables.

### B. Frontend on Vercel

1. On [vercel.com](https://vercel.com): **Add New Project**, import this repo.
2. Set **Root Directory** to `frontend/`. Vercel autodetects Vite.
3. Under **Environment Variables**, add:
   - `VITE_API_URL` → `https://<your-render-service>.onrender.com/api`
4. Deploy. Once the URL is live, go back to Render and update `CORS_ALLOWED_ORIGINS` to include it, then redeploy the backend.

### C. Alternatives

- **Database:** [Neon](https://neon.tech) (serverless Postgres, generous free tier) instead of Render Postgres.
- **Backend:** [Railway](https://railway.app) or [Fly.io](https://fly.io) — both auto-detect Spring Boot from the `pom.xml`.
- **Frontend:** Netlify or Cloudflare Pages work identically; both pick up `VITE_API_URL`.

> ⚠️ Render's free web service spins down after 15 min of inactivity — the first request after a cold start can take ~30 s. That's fine for a portfolio demo but consider the $7/mo "Starter" tier if you want it always-on.

---

## Screenshots

_Add your own screenshots to a `docs/` folder and reference them here:_

```markdown
![Tasks board](docs/tasks.png)
![Notes editor](docs/notes.png)
![Dashboard](docs/dashboard.png)
```

---

## License

MIT — do whatever you want, attribution appreciated.
