from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from typing import List
import api.schemas.exercise as exercise_schema
import api.cruds.exercise as exercise_crud
from api.db import get_db

router = APIRouter()


@router.get("/exercises", response_model=List[exercise_schema.Exercise])
async def list_exercises(db: AsyncSession = Depends(get_db)):
    return await exercise_crud.get_exercises(db)


@router.get("/exercises/{exercise_id}", response_model=exercise_schema.Exercise)
async def get_exercise(exercise_id: int, db: AsyncSession = Depends(get_db)):
    return await exercise_crud.get_exercise(db, exercise_id=exercise_id)


@router.get("/exercises/category/{category_id}", response_model=List[exercise_schema.Exercise])
async def get_exercise(category_id: int, db: AsyncSession = Depends(get_db)):
    return await exercise_crud.get_exercises_with_category(db, category_id=category_id)


@router.post("/exercises", response_model=exercise_schema.ExerciseCreateResponse)
async def create_exercise(
    exercise_body: exercise_schema.ExerciseCreate, db: AsyncSession = Depends(get_db)
):
    return await exercise_crud.create_exercise(db, exercise_body)


@router.put("/exercises/{exercise_id}", response_model=exercise_schema.ExerciseCreate)
async def update_exercise(
    exercise_id: int, exercise_body: exercise_schema.ExerciseCreate, db: AsyncSession = Depends(get_db)
):
    exercise = await exercise_crud.get_exercise(db, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return await exercise_crud.update_exercise(db, exercise_body, original=exercise)


@router.delete("/exercises/{exercise_id}", response_model=None)
async def delete_exercise(exercise_id: int, db: AsyncSession = Depends(get_db)):
    exercise = await exercise_crud.get_exercise(db, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return await exercise_crud.delete_exercise(db, original=exercise)