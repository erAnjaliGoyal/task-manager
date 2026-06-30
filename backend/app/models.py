from pydantic import field_validator
from sqlmodel import Field, SQLModel


TITLE_MAX_LENGTH = 100
DESCRIPTION_MAX_LENGTH = 500


def normalize_optional_text(value: str | None) -> str | None:
    if value is None:
        return None

    stripped_value = value.strip()
    return stripped_value or None


def validate_title(value: str) -> str:
    stripped_value = value.strip()

    if not stripped_value:
        raise ValueError("Title cannot be empty")

    if len(stripped_value) > TITLE_MAX_LENGTH:
        raise ValueError(f"Title cannot exceed {TITLE_MAX_LENGTH} characters")

    return stripped_value


def validate_description(value: str | None) -> str | None:
    normalized_value = normalize_optional_text(value)

    if normalized_value and len(normalized_value) > DESCRIPTION_MAX_LENGTH:
        raise ValueError(
            f"Description cannot exceed {DESCRIPTION_MAX_LENGTH} characters"
        )

    return normalized_value


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str | None = None
    completed: bool = False


class TaskCreate(SQLModel):
    title: str
    description: str | None = None

    @field_validator("title")
    @classmethod
    def validate_task_title(cls, value: str) -> str:
        return validate_title(value)

    @field_validator("description")
    @classmethod
    def validate_task_description(cls, value: str | None) -> str | None:
        return validate_description(value)


class TaskUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def validate_task_title(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return validate_title(value)

    @field_validator("description")
    @classmethod
    def validate_task_description(cls, value: str | None) -> str | None:
        return validate_description(value)
