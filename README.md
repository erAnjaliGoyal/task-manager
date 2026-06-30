# Task Manager

A small full-stack task manager built with React, FastAPI, SQLModel, Alembic, and PostgreSQL.

The app intentionally keeps scope small:

- one resource: `Task`
- no authentication
- CRUD operations
- completion toggle
- completed/pending filter

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- ORM: SQLModel
- Migrations: Alembic
- Database: PostgreSQL
- Runtime: Docker Compose

## Run With Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- PostgreSQL on `localhost:5434`
- FastAPI backend on `http://localhost:8000`
- React frontend on `http://localhost:5173`

Open the frontend:

```text
http://localhost:5173
```

## API Endpoints

```text
GET    /tasks/
POST   /tasks/
PUT    /tasks/{task_id}
DELETE /tasks/{task_id}
PATCH  /tasks/{task_id}/toggle
```

Filter tasks:

```text
GET /tasks/?completed=true
GET /tasks/?completed=false
```

## Example API Calls

List tasks:

```bash
curl http://localhost:8000/tasks/
```

Create a task:

```bash
curl -X POST http://localhost:8000/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"First task","description":"Created from curl"}'
```

Update a task:

```bash
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","description":"Updated description","completed":false}'
```

Toggle task completion:

```bash
curl -X PATCH http://localhost:8000/tasks/1/toggle
```

Delete a task:

```bash
curl -X DELETE http://localhost:8000/tasks/1
```

## Database Configuration

When running backend locally on your machine, use the host-mapped Postgres port:

```env
DATABASE_URL=postgresql://task_user:task_password@localhost:5434/task_db
```

When running backend inside Docker Compose, use the Compose service name:

```env
DATABASE_URL=postgresql://task_user:task_password@postgres:5432/task_db
```

Why:

- `localhost:5434` is for your Mac talking to the Docker Postgres container.
- `postgres:5432` is for one Docker container talking to another Docker Compose service.

## Migrations

Alembic manages database schema changes.

Apply all migrations:

```bash
cd backend
alembic upgrade head
```

Check current migration:

```bash
alembic current
```

Create a new migration after changing SQLModel models:

```bash
alembic revision --autogenerate -m "describe schema change"
```

Always review generated migration files before applying them.

## Inspect PostgreSQL

Open `psql` inside the Postgres container:

```bash
docker exec -it task_manager_db psql -U task_user -d task_db
```

Useful `psql` commands:

```sql
\dt
\d task
SELECT * FROM task;
SELECT * FROM alembic_version;
\q
```

## Reset Local Database

This deletes all local Postgres data for the project:

```bash
docker compose down -v
docker compose up --build
```

Use this only when you are okay losing local task data.

## Local Development Without Docker Backend

Start only Postgres:

```bash
docker compose up postgres
```

Run backend locally:

```bash
cd backend
source venv/bin/activate
alembic upgrade head
python -m uvicorn app.main:app --reload
```

Run frontend locally:

```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

If frontend requests fail with CORS errors, confirm backend allows:

```text
http://localhost:5173
```

If Alembic cannot connect, confirm the correct database URL:

```bash
cat backend/.env
docker ps
```

If `task` table is missing, run:

```bash
cd backend
alembic upgrade head
```
