# AI Task Tracker

## Project Description

AI Task Tracker is a full-stack web application built using React and FastAPI. It allows users to manage tasks and receive AI-based priority suggestions.

## Features

* Add Tasks
* Edit Tasks
* Delete Tasks
* Search Tasks
* Filter Tasks
* AI Priority Suggestion
* SQLite Database Storage

## Technologies Used

### Frontend

* React
* Axios

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Python

## Folder Structure

backend/
├── main.py
├── models.py
├── database.py
├── tasks.db

frontend/
├── src/
│   ├── App.jsx
│   ├── api/
│   │   └── taskApi.js

## Installation

### Backend

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv openai
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd task-tracker-frontend
npm install
npm run dev
```

## API Endpoints

GET /tasks

POST /tasks

PUT /tasks/{id}

DELETE /tasks/{id}

POST /suggest-priority

## API Documentation

FastAPI automatically generates interactive API documentation.

### Swagger UI

http://127.0.0.1:8000/docs

### ReDoc

http://127.0.0.1:8000/redoc

## Future Enhancements

* User Authentication
* Task Categories
* AI Task Summarization
* Email Reminders
