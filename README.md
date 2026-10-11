# Personal Task Manager

A full-stack task management application built with React, TypeScript, and Node.js.

## Tech Stack

- **Client:** React 18 + TypeScript + Tailwind CSS + Vite
- **Server:** Node.js + Express + TypeScript
- **Database:** SQLite (via Prisma ORM, WAL mode)
- **Auth:** JWT access/refresh tokens (httpOnly cookies)
- **Validation:** Zod (shared between client and server)

## Project Structure

```
├── shared/          # Shared types and Zod validators
├── server/          # Express API server
├── client/          # React frontend
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example server/.env
# Edit server/.env with your configuration
```

### Database Setup

```bash
npm run db:push     # Push schema to SQLite
npm run db:seed     # Seed with sample data (optional)
```

### Development

```bash
# Run both server and client
npm run dev

# Or run individually
npm run dev:server  # Server on http://localhost:3001
npm run dev:client  # Client on http://localhost:5173
```

### Production Build

```bash
npm run build
```

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

### Auth
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET  /api/v1/auth/me` - Get current user

### Tasks
- `GET    /api/v1/tasks` - List tasks (with filtering & pagination)
- `POST   /api/v1/tasks` - Create task
- `GET    /api/v1/tasks/:id` - Get task by ID
- `PATCH  /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

### Projects
- `GET    /api/v1/projects` - List projects
- `POST   /api/v1/projects` - Create project
- `GET    /api/v1/projects/:id` - Get project by ID
- `PATCH  /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

## Response Format

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

## License

MIT
