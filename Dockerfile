FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY prisma ./prisma/
COPY src ./src/
COPY tsconfig.json ./

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist/

# Environment
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/app.js"]
