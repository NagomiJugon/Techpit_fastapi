from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from .exercise import ExerciseResponse
from .category import Category


class ExerciseRecordBase(SQLModel):
    weight: int = Field(..., description="重量(kg)")
    rep: int = Field(..., description="回数")


class ExerciseRecordCreate(ExerciseRecordBase):
    """リクエスト用: exercise_idのみ必要"""
    exercise_id: int = Field(..., description="種目ID")


class ExerciseInRecordResponse(SQLModel):
    """ExerciseRecordのレスポンスに含まれるExercise情報"""
    id: int
    name: str
    category_id: int
    category: Category
    
    model_config = {"from_attributes": True}


class ExerciseRecordResponse(ExerciseRecordBase):
    """レスポンス用: 完全なexerciseオブジェクトを含む"""
    id: int
    exercise_id: int
    exercise: ExerciseInRecordResponse
    exercise_date: date = Field(default_factory=date.today)

    model_config = {"from_attributes": True}


# 後方互換性のためのエイリアス
ExerciseRecord = ExerciseRecordResponse
ExerciseRecordCreateResponse = ExerciseRecordResponse

