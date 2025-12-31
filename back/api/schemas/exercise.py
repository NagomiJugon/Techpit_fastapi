from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from .category import Category


class ExerciseBase(SQLModel):
    name: str = Field(..., description="種目名", max_length=64)
    category: Category


class Exercise(ExerciseBase):
    id: int

    model_config = {"from_attributes": True}


class ExerciseCreate(ExerciseBase):
    model_config = {"from_attributes": True}


class ExerciseCreateResponse(ExerciseBase):
    id: int

    model_config = {"from_attributes": True}
