from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import get_db

import schemas
import crud

from apscheduler.schedulers.background import BackgroundScheduler
from notifications import check_due_tasks


# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI(
    title="Task Tracker API",
    description="REST API for managing tasks",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# --------------------------------------------------
# DUE-DATE ALERT SCHEDULER
# --------------------------------------------------

scheduler = BackgroundScheduler()

scheduler.add_job(
    check_due_tasks,
    "interval",
    minutes=5
)

scheduler.start()
print("Due-date scheduler started. Checking every 5 minutes.", flush=True)

# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Task Tracker API is running"
    }


# --------------------------------------------------
# CREATE TASK
# --------------------------------------------------

@app.post(
    "/tasks",
    response_model=schemas.TaskResponse
)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):
    return crud.create_task(db, task)


# --------------------------------------------------
# GET ALL TASKS
# --------------------------------------------------

@app.get(
    "/tasks",
    response_model=list[schemas.TaskResponse]
)
def get_tasks(
    db: Session = Depends(get_db)
):
    return crud.get_tasks(db)


# --------------------------------------------------
# GET ONE TASK
# --------------------------------------------------

@app.get(
    "/tasks/{task_id}",
    response_model=schemas.TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = crud.get_task(db, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# --------------------------------------------------
# UPDATE TASK
# --------------------------------------------------

@app.put(
    "/tasks/{task_id}",
    response_model=schemas.TaskResponse
)
def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    db: Session = Depends(get_db)
):
    task = crud.update_task(
        db,
        task_id,
        task_data
    )

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# --------------------------------------------------
# DELETE TASK
# --------------------------------------------------

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    task = crud.delete_task(
        db,
        task_id
    )

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {
        "message": "Task deleted successfully"
    }