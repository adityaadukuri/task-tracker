from sqlalchemy.orm import Session

from models import Task
from schemas import TaskCreate
from schemas import TaskUpdate


def create_task(
    db: Session,
    task_data: TaskCreate
):
    task = Task(
        name=task_data.name,
        description=task_data.description,
        owner=task_data.owner,
        due_date=task_data.due_date,
        status=task_data.status,
        alert_sent=False
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_tasks(
    db: Session
):
    return db.query(Task).all()


def get_task(
    db: Session,
    task_id: int
):
    return (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )


def update_task(
    db: Session,
    task_id: int,
    task_data: TaskUpdate
):
    task = get_task(db, task_id)

    if task is None:
        return None

    update_data = task_data.model_dump(
        exclude_unset=True
    )

    # Reset the alert if the due date or status changes.
    if "due_date" in update_data or "status" in update_data:
        task.alert_sent = False

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


def delete_task(
    db: Session,
    task_id: int
):
    task = get_task(db, task_id)

    if task is None:
        return None

    db.delete(task)
    db.commit()

    return task