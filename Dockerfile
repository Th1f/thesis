FROM node:24-bookworm-slim
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund
COPY . .
# Build-time placeholders only. Railway injects the real values at runtime.
RUN SKIP_ENV_VALIDATION=1 DEEPSEEK_API_KEY=build-only-placeholder DATABASE_URL=postgresql://build:build@localhost:5432/build npm run build
ENV NODE_ENV=production
USER node
EXPOSE 8080
CMD ["sh", "-c", "npm run db:migrate && exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port ${PORT:-8080}"]
