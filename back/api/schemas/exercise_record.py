from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from .exercise import ExerciseResponse


class ExerciseRecordBase(SQLModel):
    weight: int = Field(..., description="重量(kg)")
    rep: int = Field(..., description="回数")


class ExerciseRecordCreate(ExerciseRecordBase):
    exercise_id: int = Field(..., description="種目ID")


class ExerciseRecordResponse(ExerciseRecordBase):
    id: int
    exercise_id: int
    exercise_date: date = Field(default_factory=date.today)

    model_config = {"from_attributes": True}


# 後方互換性のためのエイリアス
ExerciseRecord = ExerciseRecordResponse
ExerciseRecordCreateResponse = ExerciseRecordResponse

