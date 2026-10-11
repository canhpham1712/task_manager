# ---- Install dependencies (hoisted to root) ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/
RUN npm install

# ---- Build shared library ----
FROM node:20-alpine AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.base.json ./
COPY shared/ ./shared/
RUN cd shared && npx tsc

# ---- Build server ----
FROM node:20-alpine AS server-builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.base.json ./
COPY shared/ ./shared/
COPY server/ ./server/
COPY --from=shared-builder /app/shared/dist ./shared/dist
RUN cd server && npx prisma generate && npx tsc

# ---- Build client ----
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.base.json ./
COPY shared/ ./shared/
COPY client/ ./client/
COPY --from=shared-builder /app/shared/dist ./shared/dist
RUN cd client && npx vite build

# ---- Production runtime ----
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=server-builder /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared ./shared
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/prisma ./server/prisma
COPY --from=server-builder /app/server/package.json ./server/
COPY --from=client-builder /app/client/dist ./client/dist
COPY package.json tsconfig.base.json ./

ENV NODE_ENV=production
EXPOSE 3001

WORKDIR /app/server
CMD ["sh", "-c", "npx prisma db push --skip-generate; node dist/index.js"]
