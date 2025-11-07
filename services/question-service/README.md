# Evaluation Service

### Purpose
Provides AI-driven questions of user interview responses.

### Planned Endpoints
- `GET /questions`  and returns questions:
  ```json
  {
    "clarity": "Good",
    "relevance": "Moderate",
    "structure": "Needs improvement",
    "suggestions": "Try adding examples and keeping concise answers."
  }