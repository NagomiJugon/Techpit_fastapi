from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field
from .category import Category


class ExerciseBase(SQLModel):
    name: str = Field(..., description="種目名", max_length=64)


class ExerciseCreate(ExerciseBase):
    category_id: int = Field(..., description="カテゴリーID")

    model_config = {"from_attributes": True}


class ExerciseResponse(ExerciseBase):
    id: int
    category_id: int

    model_config = {"from_attributes": True, "json_schema_extra": {"example": {"id": 0, "name": "", "category_id": 0}}}


# 後方互換性のためのエイリアス
Exercise = ExerciseResponse
ExerciseCreateResponse = ExerciseResponse
