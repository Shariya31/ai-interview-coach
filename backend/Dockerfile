# backend/Dockerfile (dev-friendly)
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install system deps for nodemon to run smoothly (optional)
RUN apk add --no-cache dumb-init

# Copy package files and install deps (cached)
COPY package*.json ./
RUN npm ci

# Copy source files (we will mount host code at runtime for dev)
COPY . .

# Expose port used by backend
EXPOSE 4000

# Use dumb-init to forward signals to node, and run nodemon dev script
# nodemon watches mounted files for live reload
CMD ["dumb-init", "npm", "run", "dev"]
