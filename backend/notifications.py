from datetime import datetime, timedelta

from database import SessionLocal
from models import Task


def check_due_tasks():
    db = SessionLocal()

    try:
        now = datetime.now()
        six_hours_later = now + timedelta(hours=6)

        print(
            f"Scheduler check: {now} -> checking tasks due before {six_hours_later}",
            flush=True
        )

        tasks = (
            db.query(Task)
            .filter(
                Task.status != "completed",
                Task.alert_sent == False,
                Task.due_date >= now,
                Task.due_date <= six_hours_later
            )
            .all()
        )

        print(
            f"Scheduler found {len(tasks)} unalerted due task(s)",
            flush=True
        )

        for task in tasks:
            print(
                f"ALERT: Task '{task.name}' is due at {task.due_date}",
                flush=True
            )

            task.alert_sent = True

        db.commit()

    finally:
        db.close()