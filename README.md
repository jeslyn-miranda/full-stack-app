# 🌸✨Study Planner✨🌸

A full-stack productivity workspace for students: a Kanban task board, a rich-text notebook system with auto-save, and a dashboard of study analytics. Built with **Spring Boot + PostgreSQL** on the back, **React + Vite** on the front, and JWT authentication end-to-end.

> **Live demo:** [study-planner-beta-one.vercel.app](https://study-planner-beta-one.vercel.app)

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

The backend uses a classic Controller → Service → Repository layering with DTO records for request / response shapes. 

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

## Screenshots
<img width="1301" height="691" alt="image" src="https://github.com/user-attachments/assets/89942203-b409-4a2d-b8f8-4498228f93df" />
<img width="1316" height="695" alt="image" src="https://github.com/user-attachments/assets/56c34a83-1521-459a-a03c-7fcd3eafc637" />
<img width="1340" height="705" alt="image" src="https://github.com/user-attachments/assets/2fa4a165-7691-4fa4-9db5-a56dd7fbc32c" />




