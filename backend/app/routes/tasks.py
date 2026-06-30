from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.database import get_session
from app.models import Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/")
def get_tasks(completed: bool | None = None, session: Session = Depends(get_session)):
    statement = select(Task)

    if completed is not None:
        statement = statement.where(Task.completed == completed)

    return session.exec(statement).all()


@router.post("/")
def create_task(task_data: TaskCreate, session: Session = Depends(get_session)):
    task = Task(
        title=task_data.title,
        description=task_data.description,
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.put("/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
):
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    session.commit()
    session.refresh(task)

    return task


def get_task_or_404(task_id: int, session: Session) -> Task:
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = get_task_or_404(task_id, session)

    session.delete(task)
    session.commit()

    return {"message": "Task deleted"}


@router.patch("/{task_id}/toggle")
def toggle_status(task_id: int, session: Session = Depends(get_session)):
    task = get_task_or_404(task_id, session)

    task.completed = not task.completed
    session.commit()
    session.refresh(task)

    return task
