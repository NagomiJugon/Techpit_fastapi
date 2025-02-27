from typing import Optional
from datetime import date
from pydantic import BaseModel, Field
from .exercise import Exercise

class ExerciseRecordBase(BaseModel):
    exercise: Exercise
    weight: int
    rep: int

class ExerciseRecord(ExerciseRecordBase):
    id: int
    exercise_date: date = Field(default_factory=date.today)

    class Config:
        orm_mode = True

class ExerciseRecordCreate(ExerciseRecordBase):
    pass

class ExerciseRecordCreateResponse(ExerciseRecordCreate):
    id: int
    exercise_date: date = Field(default_factory=date.today)

    class Config:
        orm_mode = True

