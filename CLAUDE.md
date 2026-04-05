# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaaS automotivo para concessionárias e franquias, integrado ao Chatwoot exclusivamente via **Dashboard Script** — sem nenhuma modificação no código do Chatwoot.

## Repository Structure

```
GlobalVeiculos/
├── docker-compose.yml      # Docker Swarm stack (Traefik labels)
├── .env.example
├── backend/                # NestJS API (TypeScript)
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── config/configuration.ts
│   │   ├── database/prisma.service.ts
│   │   ├── common/         # Guards, decorators
│   │   └── modules/
│   │       ├── auth/       # JWT, register, login
│   │       ├── tenants/    # Tenant CRUD + stats
│   │       ├── chatwoot/   # OnModuleInit: injeta script no Chatwoot
│   │       ├── dashboard-script/ # Serve o JS injetado no Chatwoot
│   │       ├── boards/     # Kanban boards + columns
│   │       ├── cards/      # Kanban cards + move
│   │       ├── contacts/   # CRM
│   │       ├── vehicles/   # Catálogo de veículos
│   │       ├── contracts/  # Geração de contratos
│   │       ├── webhooks/   # Recebe eventos do Chatwoot
│   │       ├── queues/     # BullMQ processor
│   │       └── health/     # /health endpoint
│   └── Dockerfile
└── frontend/               # React + Vite SPA
    ├── src/
    │   ├── App.tsx          # Router root
    │   ├── store/auth.store.ts
    │   ├── services/api.ts  # Axios client + all API calls
    │   ├── pages/           # LoginPage, RegisterPage, BoardPage, etc.
    │   └── components/
    │       ├── Layout/
    │       └── Kanban/      # DnD Kit drag-and-drop
    ├── nginx.conf
    └── Dockerfile
```

## Development Commands

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in values

# Run migrations + start dev server
npx prisma migrate dev
npm run start:dev

# Prisma
npm run prisma:generate   # after schema changes
npm run prisma:migrate    # deploy migrations in prod

# Tests
npm test
npm run test:cov
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Vite dev server on :5173 (proxies /api → :3000)
npm run build        # Production build
npm run lint
```

### Docker Swarm Deploy
```bash
# Create external volumes first (one-time)
docker volume create kanbancw-postgres
docker volume create kanbancw-redis
docker volume create kanbancw-uploads

# Deploy
docker stack deploy -c docker-compose.yml kanbancw

# Update service after image push
docker service update --image astraonline/kanbanback:0.0.7 kanbancw_backend
```

## Architecture

### Multi-Tenancy
Every entity (Board, Card, Contact, Vehicle, Contract, WebhookEvent) has a `tenantId` column. The `JwtAuthGuard` reads `tenantId` from the JWT payload and attaches it to `request.tenantId`. All service methods receive `tenantId` as the first argument and scope all queries to it.

### Chatwoot Integration Flow
1. `ChatwootService.onModuleInit()` connects to Chatwoot's PostgreSQL via `CHATWOOT_DATABASE_URL`
2. Validates the `installation_configs` table exists
3. Upserts the `dashboard_scripts` row with `<script src="https://KANBANCW_DOMAIN/dashboard-script">`
4. The script injection is idempotent — existing third-party scripts are never removed; a backup of previous content is kept in `dashboard_scripts_backup`
5. When Chatwoot loads in the browser, it executes the script
6. The script (`DashboardScriptController`) creates a toggle button + iframe panel pointing to the frontend SPA
7. The iframe URL changes automatically as users navigate between Chatwoot conversations

### Webhook Automation
- Chatwoot posts to `POST /webhooks/:tenantSlug`
- Controller enqueues a BullMQ job (3 retries, exponential backoff)
- `WebhookProcessor` handles: `conversation_created` → auto-creates card, `conversation_status_changed` → moves card to last column when resolved, `contact_created` → syncs contact

### Environment Variables (exact names — do not rename)
| Variable | Purpose |
|---|---|
| `KANBANCW_DOMAIN` | Public domain for this system |
| `CHATWOOT_DOMAIN` | Chatwoot instance domain |
| `CHATWOOT_DATABASE_URL` | Chatwoot PostgreSQL connection string |
| `DATABASE_URL` | This system's PostgreSQL |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `REDIS_HOST` / `REDIS_PORT` | BullMQ Redis |

### API Routes
All routes behind `/api` prefix except: `/health`, `/dashboard-script`, `/webhooks/:tenantSlug`, `/uploads/(.*)`.

Auth: `POST /api/auth/register`, `POST /api/auth/:tenantSlug/login`
All other routes require `Authorization: Bearer <token>`.

### Frontend Auth
Token stored in `localStorage` as `gv_token`. `useAuthStore` (Zustand) manages session. The axios interceptor automatically attaches the Bearer token and redirects to `/login` on 401.
