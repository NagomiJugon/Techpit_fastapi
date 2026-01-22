from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from datetime import date
import api.schemas.exercise_record as exercise_record_schema
import api.cruds.exercise_record as exercise_record_crud
from api.db import get_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/exercise_records", response_model=List[exercise_record_schema.ExerciseRecord])
async def list_exercise_records(
    date: Optional[date] = Query(None, description="Filter records by YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db),
):
    return await exercise_record_crud.get_exercise_records(db, date)


@router.post("/exercise_records", response_model=exercise_record_schema.ExerciseRecordCreateResponse)
async def create_exercise_record(
    exercise_record_body: exercise_record_schema.ExerciseRecordCreate, db: AsyncSession = Depends(get_db)
):
    logger.info(f"Received exercise_record_body: {exercise_record_body}")
    try:
        rec = await exercise_record_crud.create_exercise_record(db, exercise_record_body)
        return rec
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"IntegrityError: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid exercise_id or data constraint violation")


@router.get("/exercise_records/{record_id}", response_model=exercise_record_schema.ExerciseRecord)
async def get_exercise_record(
    record_id: int, db: AsyncSession = Depends(get_db)
):
    logger.info(f"Fetching exercise_record {record_id}")
    rec = await exercise_record_crud.get_exercise_record_by_id(db, record_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Exercise record not found")
    return rec


@router.put("/exercise_records/{record_id}", response_model=exercise_record_schema.ExerciseRecord)
async def update_exercise_record(
    record_id: int, exercise_record_body: exercise_record_schema.ExerciseRecordCreate, db: AsyncSession = Depends(get_db)
):
    logger.info(f"Updating exercise_record {record_id}: {exercise_record_body}")
    try:
        rec = await exercise_record_crud.update_exercise_record(db, record_id, exercise_record_body)
        if not rec:
            raise HTTPException(status_code=404, detail="Exercise record not found")
        return rec
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"IntegrityError: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid exercise_id or data constraint violation")


@router.delete("/exercise_records/{record_id}")
async def delete_exercise_record(
    record_id: int, db: AsyncSession = Depends(get_db)
):
    logger.info(f"Deleting exercise_record {record_id}")
    try:
        success = await exercise_record_crud.delete_exercise_record(db, record_id)
        if not success:
            raise HTTPException(status_code=404, detail="Exercise record not found")
        return {"message": "Exercise record deleted successfully"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail="Failed to delete exercise record")


# @router.put("exercises/{exercise_id}", response_model=exercise_schema.Exercise)
# async def update_exercise(exercise_id: int, exercise_body: exercise_schema.ExerciseCreate):
#     return exercise_schema.Exercise(id=exercise_id, **exercise_body.dict())


# @router.delete("/exercises/{exercise_id}", response_model=None)
# async def delete_exercise(exercise_id: int):
#     return