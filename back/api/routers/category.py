from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import api.schemas.category as category_schema
import api.cruds.category as category_crud
from api.db import get_db

router = APIRouter()


@router.get("/categories", response_model=List[category_schema.Category])
async def list_categories(db: AsyncSession = Depends(get_db)):
    return await category_crud.get_categories(db)


@router.get("/categories/assigned", response_model=List[category_schema.Category])
async def list_assigned_categories(db: AsyncSession = Depends(get_db)):
    return await category_crud.get_assigned_categories(db)


@router.get("/categories/{category_id}", response_model=Optional[category_schema.Category])
async def get_category(category_id: int, db: AsyncSession = Depends(get_db)):
    return await category_crud.get_category(db, category_id)


@router.post("/categories", response_model=category_schema.CategoryCreateResponse)
async def create_category(
    category_body: category_schema.CategoryCreate, db: AsyncSession = Depends(get_db)
):
    return await category_crud.create_category(db, category_body)


@router.put("/categories/{category_id}", response_model=category_schema.CategoryCreateResponse)
async def update_category(
    category_id: int, category_body: category_schema.CategoryCreate, db: AsyncSession = Depends(get_db)
):
    category = await category_crud.get_category(db, category_id=category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return await category_crud.update_category(db, category_body, original=category)


@router.delete("/categories/{category_id}", response_model=None)
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)):
    category = await category_crud.get_category(db, category_id=category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return await category_crud.delete_category(db, original=category)
