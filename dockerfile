# # Backend
# FROM node:20-bookworm-slim

# WORKDIR /app

# COPY ./backend/package*.json ./

# RUN npm ci --build-from-source

# COPY ./backend/ .

# CMD ["node", "server.js"]



# # Frontend
# FROM node:20-alpine as frontend-builder

# COPY ./Frontend /app

# WORKDIR /app

# RUN npm install

# RUN npm run build




# Stage 1: Frontend build
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY ./Frontend/package*.json ./
RUN npm ci

COPY ./Frontend/ ./
RUN npm run build


# Stage 2: Backend runtime
FROM node:20-bookworm-slim AS backend

WORKDIR /app

COPY ./backend/package*.json ./
RUN npm ci --build-from-source

COPY ./backend/ ./

# Copy frontend build into backend's public folder
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000

CMD ["node", "server.js"]


