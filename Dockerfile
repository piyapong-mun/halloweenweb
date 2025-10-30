# Stage 1: Install dependencies
FROM node:20-bullseye AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build the Next.js app
FROM node:20-bullseye AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build --eslint-disable

# Stage 3: Run the app
#
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the built output and required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
