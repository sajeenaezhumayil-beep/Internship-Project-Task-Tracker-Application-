from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from enum import Enum
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from models import Task
from typing import Literal
from dotenv import load_dotenv
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------- ENUMS ----------------

class StatusEnum(str, Enum):
    todo = "todo"
    completed = "completed"

class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

# ---------------- MODELS ----------------

class TaskCreate(BaseModel):
    title: str
    status: StatusEnum
    priority: PriorityEnum
    description: str = ""
    due_date:str =""

class TaskUpdate(BaseModel):
    title: str
    status: StatusEnum
    priority: PriorityEnum
    description: str = ""
    due_date: str = ""

class PriorityRequest(BaseModel):
    title: str

class PriorityResponse(BaseModel):
    priority: Literal["low", "medium", "high"]
    reason: str

# ---------------- TASK APIs ----------------

@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    return tasks


@app.post("/tasks")
def add_task(task_data: TaskCreate):
    db = SessionLocal()

    new_task = Task(

    title=task_data.title,

    status=task_data.status,

    priority=task_data.priority,

    description=task_data.description,

    due_date=task_data.due_date

)

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task Not Found")

    db.delete(task)
    db.commit()

    return {"message": "Deleted"}


@app.put("/tasks/{task_id}")
def update_task(task_id: int, task_data: TaskUpdate):
    db = SessionLocal()

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task Not Found")

    task.title = task_data.title
    task.status = task_data.status
    task.priority = task_data.priority
    task.description = task_data.description
    task.due_date=task_data.due_date

    db.commit()
    db.refresh(task)

    return task


# ---------------- AI PRIORITY SUGGESTION ----------------

@app.post(
    "/suggest-priority",
    response_model=PriorityResponse
)
def suggest_priority(data: PriorityRequest):

    text = data.title.lower()

    # HIGH PRIORITY
    if any(word in text for word in [
        "urgent", "tomorrow", "deadline", "exam", "today"
    ]):
        return {
            "priority": "high",
            "reason": "Task is urgent or has a strict deadline"
        }

    # MEDIUM PRIORITY
    elif any(word in text for word in [
        "assignment", "meeting", "project", "next week", "next month"
    ]):
        return {
            "priority": "medium",
            "reason": "Task is important but not immediately urgent"
        }

    # LOW PRIORITY
    return {
        "priority": "low",
        "reason": "Task is not time sensitive and can be done later"
    }