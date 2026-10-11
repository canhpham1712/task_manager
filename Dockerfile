# Render-friendly single-stage Docker build
FROM node:20-alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency manifests
COPY package.json tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install all dependencies
RUN npm install

# Copy source files
COPY shared/ ./shared/
COPY server/ ./server/
COPY client/ ./client/

# Build shared library
RUN cd shared && npx tsc

# Generate Prisma client and build server
RUN cd server && npx prisma generate && npx tsc

# Build client
RUN cd client && npx vite build

ENV NODE_ENV=production
EXPOSE 3001

WORKDIR /app/server
CMD ["sh", "-c", "npx prisma db push --skip-generate; node dist/index.js"]
