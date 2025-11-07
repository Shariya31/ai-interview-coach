# Architecture Overview

## Overview
AI Interview Coach follows a modular architecture built around micro-frontends and microservices.  
This design allows independent development, scaling, and deployment of each component.

## Frontend (Micro-Frontends)
- `mfe-shell`: host container for other MFEs.  
- `mfe-interview`: handles interview simulation (questions, recording, answers).  
- `mfe-dashboard`: displays analytics and feedback results.

## Backend (Microservices)
- `auth-service`: authentication and user sessions  
- `question-service`: generates questions via AI models  
- `transcription-service`: handles audio transcription (speech-to-text)  
- `evaluation-service`: evaluates answers using OpenAI API  
- `analytics-service`: aggregates and visualizes performance metrics  

All services will communicate through an **API Gateway** layer.  
Persistent data will be stored in MongoDB; caching will use Redis.

## Data Flow Example
1. User starts interview in `mfe-interview`.  
2. Question fetched from `question-service`.  
3. User speaks → audio sent to `transcription-service`.  
4. Transcript sent to `evaluation-service` → feedback generated.  
5. Result stored and displayed in `mfe-dashboard`.

## Infrastructure
- Docker + docker-compose for containerization  
- GitHub Actions for CI/CD  
- Environment variables managed via `.env` (never committed)
