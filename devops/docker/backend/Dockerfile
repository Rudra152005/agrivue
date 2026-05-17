FROM node:22-alpine

# Set environment to production
ENV NODE_ENV=production

WORKDIR /app

# Install PM2 globally
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set registry http://registry.npmjs.org/ && \
    npm install -g pm2

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy source code
COPY . .

# Use non-root user for security
USER node

# Expose backend port
EXPOSE 5000

# Start the application with PM2
CMD ["pm2-runtime", "server.js"]
