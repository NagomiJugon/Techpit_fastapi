from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import joinedload
from typing import Optional, List
from api.sqlmodels import Exercise, Category
import api.schemas.exercise as exercise_schema
import api.cruds.category as category_crud


async def create_exercise(
    db: AsyncSession, exercise_create: exercise_schema.ExerciseCreate
) -> Exercise:
    category_id = exercise_create.category.id
    exercise = Exercise(name=exercise_create.name, category_id=category_id)
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    category = await category_crud.get_category(db, category_id=category_id)
    exercise.category = category
    return exercise


async def get_exercises(db: AsyncSession) -> List[Exercise]:
    result = await db.execute(select(Exercise).options(joinedload(Exercise.category)))
    return result.scalars().all()


async def get_exercises_with_category(db: AsyncSession, category_id) -> List[Exercise]:
    result = await db.execute(
        select(Exercise).options(joinedload(Exercise.category)).where(Exercise.category_id == category_id)
    )
    return result.scalars().all()


async def get_exercise(db: AsyncSession, exercise_id) -> Optional[Exercise]:
    result = await db.execute(
        select(Exercise).options(joinedload(Exercise.category)).where(Exercise.id == exercise_id)
    )
    return result.scalars().first()


async def update_exercise(
    db: AsyncSession, exercise_create: exercise_schema.ExerciseCreate, original: Exercise
) -> Exercise:
    original.name = exercise_create.name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original


async def delete_exercise(db: AsyncSession, original: Exercise):
    await db.delete(original)
    await db.commit()