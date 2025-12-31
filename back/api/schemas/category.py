from typing import Optional
from sqlmodel import SQLModel, Field


class CategoryBase(SQLModel):
    name: str = Field(..., description="カテゴリー名", max_length=64)


class Category(CategoryBase):
    id: int

    model_config = {"from_attributes": True}


class CategoryCreate(CategoryBase):
    pass


class CategoryCreateResponse(CategoryCreate):
    id: int

    model_config = {"from_attributes": True}