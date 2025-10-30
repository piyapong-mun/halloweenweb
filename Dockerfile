# ===========================
# 1️⃣ Stage 1: Build Stage
# ===========================
FROM node:20-alpine AS builder

# ตั้ง working directory
WORKDIR /app

# Copy package.json และ lockfile ก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci

# Copy Prisma schema และ generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code ทั้งหมด
COPY . .

# Build Next.js app
RUN npm run build


# ===========================
# 2️⃣ Stage 2: Production Stage
# ===========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json เพื่อใช้เฉพาะ production dependencies
COPY package*.json ./

# ติดตั้งเฉพาะ production dependencies
RUN npm ci --only=production

# Copy Prisma client ที่ generate แล้วจาก builder
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "run", "start"]
