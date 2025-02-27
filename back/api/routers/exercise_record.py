from fastapi import APIRouter, Depends #type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from typing import List
import api.schemas.exercise as exercise_schema
import api.schemas.exercise_record as exercise_record_schema
import api.schemas.category as category_schema
import api.cruds.exercise_record as exercise_record_crud
from datetime import date
from api.db import get_db

router = APIRouter()


@router.get("/exercise_records", response_model=List[exercise_record_schema.ExerciseRecord])
async def list_exercise_records():
    return [
        exercise_record_schema.ExerciseRecord(
            id=1, 
            exercise=exercise_schema.Exercise(
                id=1,
                name="chest pres",
                category=category_schema.Category(id=1, name="chest")
            ),
            weight=30,
            rep=10,
            exercise_date=date(2025, 2, 15)
        ),
        exercise_record_schema.ExerciseRecord(
            id=2, 
            exercise=exercise_schema.Exercise(
                id=1,
                name="chest pres",
                category=category_schema.Category(id=1, name="chest")
            ),
            weight=30,
            rep=10,
            exercise_date=date(2025, 2, 16)
        ),
        exercise_record_schema.ExerciseRecord(
            id=3, 
            exercise=exercise_schema.Exercise(
                id=1,
                name="chest pres",
                category=category_schema.Category(id=1, name="chest")
            ),
            weight=30,
            rep=10,
            exercise_date=date(2025, 2, 17)
        ),
    ]

    # return [
    #     exercise_record_schema.ExerciseRecord(id=1, exercise=exercise_schema.Exercise(id=1,name="chest pres", category=category_schema.Category(id=1, name="chest")),weight=30,reps=10,exercise_date=date.today)
    # ]

@router.post("/exercise_records", response_model=exercise_record_schema.ExerciseRecordCreateResponse)
async def create_exercise_record(
    exercise_record_body: exercise_record_schema.ExerciseRecordCreate, db: AsyncSession = Depends(get_db)
):
    # return await exercise_record_crud.create_exercise_record(db, exercise_record_body)
    return exercise_record_schema.ExerciseRecordCreateResponse(id=1, **exercise_record_body.dict(), exercise_date=date(2025,2, 18))


# @router.put("exercises/{exercise_id}", response_model=exercise_schema.Exercise)
# async def update_exercise(exercise_id: int, exercise_body: exercise_schema.ExerciseCreate):
#     return exercise_schema.Exercise(id=exercise_id, **exercise_body.dict())


# @router.delete("/exercises/{exercise_id}", response_model=None)
# async def delete_exercise(exercise_id: int):
#     return