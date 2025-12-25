# AI Interview Platform – Architecture

## Frontend
- React + Tailwind
- Feature-based folder structure
- Communicates only with API Gateway

## Backend (Microservices)
- api-gateway
- auth-service
- interview-service
- ai-service
- voice-service (later)

## Communication
- REST-based synchronous calls
- JWT authentication via auth-service
- API Gateway as single entry point

## Infrastructure
- MongoDB (Docker container)
- Redis (Docker container, later)
- Docker Compose for orchestration
