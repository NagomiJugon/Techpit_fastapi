from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class Exercise(SQLModel, table=True):
    __tablename__ = "exercises"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    category: Optional["Category"] = Relationship(back_populates="exercises")
    records: List["ExerciseRecord"] = Relationship(back_populates="exercise")