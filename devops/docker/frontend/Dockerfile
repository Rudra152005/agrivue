# Build Stage
FROM node:22-alpine AS build

WORKDIR /app

# Set network timeout and registry to prevent hang
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies (do NOT set NODE_ENV=production yet so devDependencies are installed)
COPY package*.json ./
RUN npm ci --legacy-peer-deps && \
    npm install react-is --legacy-peer-deps

# Copy source code
COPY . .

# Set environment to production for the build
ENV NODE_ENV=production

# Build the app using the production-safe config
RUN npx vite build --config vite.config.prod.ts

# Production Stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
