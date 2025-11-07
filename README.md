# AI Interview Coach

AI Interview Coach is an AI-powered platform that helps users practice technical and behavioral interviews in a realistic environment.  
It uses AI to generate personalized questions, record and analyze spoken answers, and provide structured feedback.

---

## 🧩 Architecture Overview
This project follows a **monorepo structure** with **micro-frontends** (React) and **microservices** (Node.js + Express):

- **Frontend (apps/)**  
  - `mfe-shell` – the main host container for all MFEs  
  - `mfe-interview` – handles live interview simulations  
  - `mfe-dashboard` – shows feedback, stats, and progress

- **Backend (services/)**  
  - `auth-service` – user authentication and token management  
  - `question-service` – question generation using AI  
  - `transcription-service` – converts voice to text  
  - `evaluation-service` – analyzes answers and provides feedback  
  - `analytics-service` – tracks user performance and improvement

- **Infra/** – docker-compose, deployment, CI/CD
- **docs/** – documentation, design decisions

---

## 🗺 Roadmap
**Phase 1:** Setup monorepo skeleton and documentation  
**Phase 2:** Build core microservices and connect MFEs  
**Phase 3:** Integrate AI models and add CI/CD pipelines  
**Phase 4:** Dockerize and deploy to cloud

---

## ⚙️ Workspaces
Uses **npm workspaces** to manage multiple services and apps efficiently.

---

## 🚀 Getting Started (for later)
Instructions will be added once services and apps are implemented.
