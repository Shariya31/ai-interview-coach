# Evaluation Service

### Purpose
Provides AI-driven evaluation of user interview responses.

### Planned Endpoints
- `POST /evaluate` – accepts `{ question, transcript }` and returns feedback:
  ```json
  {
    "clarity": "Good",
    "relevance": "Moderate",
    "structure": "Needs improvement",
    "suggestions": "Try adding examples and keeping concise answers."
  }
