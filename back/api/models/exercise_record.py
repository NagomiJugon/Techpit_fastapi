from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from api.models.exercise import Exercise

from api.db import Base


class ExerciseRecord(Base):
    __tablename__ = 'exercise_records'

    id = Column(Integer, primary_key=True)
    exercise_id = Column(Integer, ForeignKey('exercises.id'))
    weight = Column(Integer)
    rep = Column(Integer)
    exercise_date = Column(Date, default=date.today)

    exercise = relationship("Exercise", backref="exercises")