FROM node:20-alpine AS builder

WORKDIR /app

# Copy prisma schema first (needed for postinstall)
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY src ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Copy prisma schema first (needed for postinstall)  
COPY prisma ./prisma/

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist/

# Environment - Railway will override PORT
ENV NODE_ENV=production

# Use npm start to run prisma db push + node
CMD ["npm", "start"]
