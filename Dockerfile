# ---- Stage 1: build ----
# Full dependency set (incl. dev) to generate the Prisma client and build Next.js.
FROM node:26-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci

# Copy the whole context: .dockerignore decides what stays out, and this stage
# never ships (only the build output is copied into the runner).
COPY . .

# prebuild runs `prisma generate` first.
RUN npm run build

# ---- Stage 2: production dependencies ----
# Dev dependencies (vitest, testing-library, ...) are never installed here.
# The prisma CLI is a regular dependency so `prisma migrate deploy` works from the
# final image at the exact version pinned in package-lock.json.
FROM node:26-alpine AS prod-deps

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci --omit=dev

# ---- Stage 3: runtime ----
FROM node:26-alpine AS runner

# Prisma's migration (schema) engine, used by `migrate deploy`, needs openssl at runtime
RUN apk upgrade --no-cache && apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# Nothing at runtime needs npm: the app starts via node and migrations run from
# the locked prisma CLI in node_modules. Removing it drops npm's bundled deps
# from the image.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=prod-deps /app/node_modules ./node_modules
# Migrations and the CLI config `prisma migrate deploy` reads (Prisma 7). The client
# itself is generated in the builder and bundled into .next.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start"]
