# Stage 1: Build the Vite React app
FROM node:22.13.1-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:1.27-alpine

# Copy built files to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
