from typing import Optional
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(..., description="カテゴリー名", max_length=64)


# CategoryCreateResponseと同じだが、使用用途が違うので別クラスとして用意しておく
class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class CategoryCreate(CategoryBase):
    pass


class CategoryCreateResponse(CategoryCreate):
    id: int

    class Config:
        from_attributes = True