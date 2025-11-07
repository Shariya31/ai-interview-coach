# Transcript Service

### Purpose
Provides AI-driven transcript of user interview responses.

### Planned Endpoints
- `POST /transcript` and returns feedback:
  ```json
  {
    "clarity": "Good",
    "relevance": "Moderate",
    "structure": "Needs improvement",
    "suggestions": "Try adding examples and keeping concise answers."
  }