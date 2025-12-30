from typing import Optional, List
from datetime import date
from sqlmodel import SQLModel, Field, Relationship


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    exercises: List["Exercise"] = Relationship(back_populates="category")


class Exercise(SQLModel, table=True):
    __tablename__ = "exercises"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    category: Optional[Category] = Relationship(back_populates="exercises")
    records: List["ExerciseRecord"] = Relationship(back_populates="exercise")


class ExerciseRecord(SQLModel, table=True):
    __tablename__ = "exercise_records"
    id: Optional[int] = Field(default=None, primary_key=True)
    exercise_id: Optional[int] = Field(default=None, foreign_key="exercises.id")
    weight: Optional[int]
    rep: Optional[int]
    exercise_date: date = Field(default_factory=date.today)

    exercise: Optional[Exercise] = Relationship(back_populates="records")
