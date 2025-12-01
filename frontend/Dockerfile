# frontend/Dockerfile (dev-friendly for Vite)
FROM node:20-alpine

WORKDIR /app

# Install tini/dumb-init to handle signals (optional)
RUN apk add --no-cache dumb-init

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source (we will mount host code when running for dev)
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server (we'll pass env at runtime)
CMD ["dumb-init", "npm", "run", "dev"]
