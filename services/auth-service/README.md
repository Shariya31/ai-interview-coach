# Auth Service

### Purpose
Provides auth for the user.

### Planned Endpoints
- `POST /signup` – accepts `{name, email, passowrd }` and returns feedback:
  ```json
- `POST /login` – accepts `{ email, password }` and returns feedback:
  ```json
  {
    "clarity": "Good",
    "relevance": "Moderate",
    "structure": "Needs improvement",
    "suggestions": "Try adding examples and keeping concise answers."
  }