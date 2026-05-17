# Agri-TrekOps DevOps Environment

This directory contains the production-grade DevOps setup for the Agri-TrekOps platform.

## 🛠️ Stack Components

- **Frontend**: React.js (Vite) served via Nginx.
- **Backend**: Node.js (Express) with PM2.
- **Database**: MongoDB.
- **CI/CD**: Jenkins.
- **Code Quality**: SonarQube.
- **Artifacts**: Nexus Repository Manager.
- **Reverse Proxy**: Nginx.
- **Monitoring**: Prometheus & Grafana.

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker Compose installed.
- Git.

### 2. Setup Environment
Copy the `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

### 3. Spin up the infrastructure
```bash
docker-compose up -d
```

### 4. Access Services
- **Frontend/API**: [http://localhost](http://localhost)
- **Jenkins**: [http://localhost:8080](http://localhost:8080)
- **SonarQube**: [http://localhost:9000](http://localhost:9000)
- **Nexus**: [http://localhost:8081](http://localhost:8081)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Grafana**: [http://localhost:3000](http://localhost:3000)

## 🔄 CI/CD Pipeline

The Jenkins pipeline is defined in `jenkins/Jenkinsfile`. It performs the following:
1. **Checkout**: Pulls code from GitHub.
2. **Install**: Installs dependencies for frontend/backend.
3. **Test**: Runs automated tests.
4. **Analysis**: Static code analysis via SonarQube.
5. **Build**: Builds production Docker images.
6. **Push**: Pushes images to Nexus (optional).
7. **Deploy**: Re-deploys containers using Docker Compose.
8. **Health Check**: Verifies deployment health.

## 🛡️ Security Features
- Multi-stage Docker builds for minimal image size.
- Non-root users in containers.
- Security headers in Nginx.
- Gzip compression for performance.
- Environment variable isolation.
