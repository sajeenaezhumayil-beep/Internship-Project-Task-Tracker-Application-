from database import SessionLocal
from models import Task

db = SessionLocal()

tasks = db.query(Task).all()

print(tasks)