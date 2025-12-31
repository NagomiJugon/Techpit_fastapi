from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from .exercise import Exercise


class ExerciseRecordBase(SQLModel):
    exercise: Exercise
    weight: int
    rep: int


class ExerciseRecord(ExerciseRecordBase):
    id: int
    exercise_date: date = Field(default_factory=date.today)

    model_config = {"from_attributes": True}


class ExerciseRecordCreate(ExerciseRecordBase):
    pass


class ExerciseRecordCreateResponse(ExerciseRecordCreate):
    id: int
    exercise_date: date = Field(default_factory=date.today)

    model_config = {"from_attributes": True}

