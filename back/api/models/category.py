from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    exercises: List["Exercise"] = Relationship(back_populates="category")