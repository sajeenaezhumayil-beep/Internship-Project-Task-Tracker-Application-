# Setup Instructions

## Prerequisites

Before running the project, install:

- Python 3.x
- Node.js
- npm

---

## Backend Setup

### 1. Install Dependencies

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv openai
```

### 2. Create Environment File

Create a file named `.env`

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

### 3. Start Backend Server

```bash
python -m uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

### 1. Open Frontend Folder

```bash
cd task-tracker-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Frontend

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## Application Usage

1. Enter a task title.
2. Click "AI Suggest" to get a recommended priority.
3. Click "Add Task" to save the task.
4. Search and filter tasks.
5. Edit or delete existing tasks.

---

## Troubleshooting

### Backend Not Starting

Check:

- Python installation
- Required packages installed
- `.env` file exists

### Frontend Not Starting

Check:

- Node.js installation
- `npm install` completed successfully

### AI Suggestion Not Working

Check:

- API key is valid
- Backend server is running
- `/suggest-priority` endpoint is accessible