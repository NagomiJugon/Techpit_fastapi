from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select # type: ignore
from sqlalchemy.orm import joinedload
from sqlalchemy.engine import Result # type: ignore
from typing import Optional, List, Tuple
import api.models.exercise as exercise_model
import api.models.category as category_model
import api.schemas.exercise as exercise_schema
import api.cruds.category as category_crud


async def create_exercise(
    db: AsyncSession, exercise_create: exercise_schema.ExerciseCreate
) -> exercise_model.Exercise:
    category_id = exercise_create.category.id
    exercise = exercise_model.Exercise(
        name = exercise_create.name,
        category_id = category_id
    )
    db.add(exercise)
    await db.commit()
    await db.refresh(exercise)
    category = await category_crud.get_category(db, category_id=category_id)
    exercise.category = category
    return exercise


async def get_exercises(db: AsyncSession) -> List[exercise_model.Exercise]:
    result: Result = await (
        db.execute(
            select(
                # exercise_model.Exercise.id,
                # exercise_model.Exercise.name,
                # exercise_model.Exercise.category_id
                exercise_model.Exercise
            ).options(
                joinedload(exercise_model.Exercise.category)
            )
        )
    )
    return result.scalars().all()


async def get_exercises_with_category(db: AsyncSession, category_id) -> List[exercise_model.Exercise]:
    result: Result = await (
        db.execute(
            select(
                # exercise_model.Exercise.id,
                # exercise_model.Exercise.name,
                # exercise_model.Exercise.category_id
                exercise_model.Exercise
            ).options(
                joinedload(exercise_model.Exercise.category)
            ).filter(exercise_model.Exercise.category_id == category_id)
        )
    )
    return result.scalars().all()


async def get_exercise(db: AsyncSession, exercise_id) -> Optional[exercise_model.Exercise]:
    result: Result = await db.execute(
        select(
            exercise_model.Exercise
        ).options(
            joinedload(exercise_model.Exercise.category)
        ).filter(exercise_model.Exercise.id == exercise_id)
    )
    exercise: Optional[Tuple[exercise_model.Exercise]] = result.first()
    return exercise[0] if exercise is not None else None


async def update_exercise(
    db: AsyncSession, exercise_create: exercise_schema.ExerciseCreate, original: exercise_model.Exercise
) -> exercise_model.Exercise:
    original.name = exercise_create.name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original


async def delete_exercise(db: AsyncSession, original: exercise_model.Exercise):
    await db.delete(original)
    await db.commit()