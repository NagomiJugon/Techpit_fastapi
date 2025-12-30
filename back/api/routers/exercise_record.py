from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List
import api.schemas.exercise_record as exercise_record_schema
import api.cruds.exercise_record as exercise_record_crud
from api.db import get_db

router = APIRouter()


@router.get("/exercise_records", response_model=List[exercise_record_schema.ExerciseRecord])
async def list_exercise_records(db: AsyncSession = Depends(get_db)):
    return await exercise_record_crud.get_exercise_records(db)


@router.post("/exercise_records", response_model=exercise_record_schema.ExerciseRecordCreateResponse)
async def create_exercise_record(
    exercise_record_body: exercise_record_schema.ExerciseRecordCreate, db: AsyncSession = Depends(get_db)
):
    try:
        rec = await exercise_record_crud.create_exercise_record(db, exercise_record_body)
        return rec
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Invalid exercise_id or data constraint violation")


# @router.put("exercises/{exercise_id}", response_model=exercise_schema.Exercise)
# async def update_exercise(exercise_id: int, exercise_body: exercise_schema.ExerciseCreate):
#     return exercise_schema.Exercise(id=exercise_id, **exercise_body.dict())


# @router.delete("/exercises/{exercise_id}", response_model=None)
# async def delete_exercise(exercise_id: int):
#     return