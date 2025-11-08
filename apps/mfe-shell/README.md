# MFE Shell (AI Interview Coach)

This is the main micro-frontend container app for AI Interview Coach.  
It serves as the entry point and shell that dynamically loads other micro-frontends (e.g., Interview, Dashboard).

## 🚀 Tech Stack
- React (Vite)
- Tailwind CSS
- Docker (for deployment)

## 🧩 Setup

### Local Development
```bash
cd apps/mfe-shell
npm install
npm run dev

Runs on: http://localhost:5173

docker build -t mfe-shell .
docker run -p 8080:80 mfe-shell

Runs on: http://localhost:8080