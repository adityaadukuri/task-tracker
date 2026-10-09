from datetime import datetime
from typing import Literal

from pydantic import BaseModel
from pydantic import Field


TaskStatus = Literal[
    "pending",
    "in_progress",
    "completed"
]


class TaskCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=255
    )

    description: str | None = Field(
        default=None,
        max_length=2000
    )

    owner: str = Field(
        min_length=1,
        max_length=255
    )

    due_date: datetime

    status: TaskStatus = "pending"


class TaskUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )

    description: str | None = Field(
        default=None,
        max_length=2000
    )

    owner: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )

    due_date: datetime | None = None

    status: TaskStatus | None = None


class TaskResponse(BaseModel):
    id: int
    name: str
    description: str | None
    owner: str
    due_date: datetime
    status: TaskStatus
    alert_sent: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True