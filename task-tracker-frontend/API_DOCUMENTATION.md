# API Documentation

## Base URL

http://127.0.0.1:8000

---

## GET /tasks

Description:
Returns all tasks stored in the database.

Response Example:

```json
[
  {
    "id": 1,
    "title": "Learn React",
    "status": "todo",
    "priority": "high"
  }
]
```