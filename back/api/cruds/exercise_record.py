import pprint
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy import select # type: ignore
from sqlalchemy.orm import joinedload
from sqlalchemy.engine import Result # type: ignore
from typing import Optional, List, Tuple
import api.models.exercise_record as exercise_record_model
import api.schemas.exercise_record as exercise_record_schema


async def create_exercise_record(
        db: AsyncSession, exercise_record_create: exercise_record_schema.ExerciseRecordCreate
):
    pprint(exercise_record_create)
# ) -> exercise_record_model.ExerciseRecord:
    # exercise_record = exercise_record_model.ExerciseRecord(
    #     **exercise_record_create.dict())
    # db.add(exercise_record)
    # await db.commit()
    # await db.refresh(exercise_record)
    # return exercise_record