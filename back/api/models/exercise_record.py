from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field, Relationship


class ExerciseRecord(SQLModel, table=True):
    __tablename__ = "exercise_records"
    id: Optional[int] = Field(default=None, primary_key=True)
    exercise_id: Optional[int] = Field(default=None, foreign_key="exercises.id")
    weight: Optional[int]
    rep: Optional[int]
    exercise_date: date = Field(default_factory=date.today)

    exercise: Optional["Exercise"] = Relationship(back_populates="records")