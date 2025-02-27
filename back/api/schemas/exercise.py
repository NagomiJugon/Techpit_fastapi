from typing import Optional
from .category import Category
from pydantic import BaseModel, Field


class ExerciseBase(BaseModel):
    name: str = Field(..., description="種目名", max_length=64)
    category: Category


# CategoryCreateResponseと同じだが、使用用途が違うので別クラスとして用意しておく
class Exercise(ExerciseBase):
    id: int

    class Config:
        orm_mode = True


class ExerciseCreate(ExerciseBase):
    class Config:
        orm_mode = True


class ExerciseCreateResponse(ExerciseBase):
    id: int

    class Config:
        orm_mode = True
