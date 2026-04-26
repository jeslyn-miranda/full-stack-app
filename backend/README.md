# Study Planner — Backend (Spring Boot)

Java 17 + Spring Boot 3.2 + PostgreSQL + JWT auth.

## Prerequisites
- Java 17 (`/opt/homebrew/opt/openjdk@17`)
- Maven 3.9+
- PostgreSQL 16 running locally with a database named `studyplanner`

## Run locally
```bash
# from backend/
mvn spring-boot:run
```
App starts on `http://localhost:8080`. Schema is auto-managed by Hibernate (`ddl-auto=update`).

Override defaults via env vars:
- `DB_USER`, `DB_PASSWORD` — Postgres credentials (default: current user, no password)
- `JWT_SECRET` — HMAC-SHA256 key (>= 32 bytes). **Change this for production.**

## API

| Method | Path                  | Auth  | Body                                             |
|--------|-----------------------|-------|--------------------------------------------------|
| POST   | /api/auth/register    | No    | `{ name, email, password }`                      |
| POST   | /api/auth/login       | No    | `{ email, password }` → `{ token, ... }`         |
| GET    | /api/tasks            | Bearer| —                                                |
| POST   | /api/tasks            | Bearer| `{ title, description, status, category, dueDate, progress }` |
| PUT    | /api/tasks/{id}       | Bearer| same as POST                                     |
| PATCH  | /api/tasks/status     | Bearer| `{ id, status }`                                 |
| DELETE | /api/tasks/{id}       | Bearer| —                                                |

`status` ∈ `TODO | IN_PROGRESS | IN_REVIEW | COMPLETE`.

## Smoke test
```bash
curl -s -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","password":"password123"}'
```
