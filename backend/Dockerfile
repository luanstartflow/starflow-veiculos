# ── Stage 1: install production deps ──────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ── Stage 2: full build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

# ── Stage 3: production image ──────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Production node_modules (no devDeps)
COPY --from=deps /app/node_modules ./node_modules

# Prisma CLI binary (devDep, needed only for migrate deploy at startup)
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

# Prisma generated client (engine binaries)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Compiled application

# Migration files
COPY prisma ./prisma/

RUN mkdir -p /app/uploads

EXPOSE 3000

# Run migrations then start the app
CMD ["sh", "-c", "node node_modules/prisma/bin/prisma.js migrate deploy && node dist/main.js"]
