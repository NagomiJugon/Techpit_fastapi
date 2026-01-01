from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import joinedload
from typing import List, Optional
from api.models.exercise_record import ExerciseRecord
from api.models.exercise import Exercise
from api.models.category import Category
import api.schemas.exercise_record as exercise_record_schema


async def create_exercise_record(
    db: AsyncSession, exercise_record_create: exercise_record_schema.ExerciseRecordCreate
) -> ExerciseRecord:
    rec = ExerciseRecord(
        exercise_id=exercise_record_create.exercise_id,
        weight=exercise_record_create.weight,
        rep=exercise_record_create.rep,
    )
    db.add(rec)
    await db.commit()
    await db.refresh(rec)
    return rec


async def get_exercise_records(db: AsyncSession) -> List[ExerciseRecord]:
    stmt = select(ExerciseRecord).options(joinedload(ExerciseRecord.exercise).joinedload(Exercise.category))
    result = await db.execute(stmt)
    return result.scalars().all()