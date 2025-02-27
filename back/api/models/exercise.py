from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from api.models.category import Category

from api.db import Base


class Exercise(Base):
    __tablename__ = 'exercises'

    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    category_id = Column(Integer, ForeignKey('categories.id'))
    category = relationship("Category", backref="exercises")