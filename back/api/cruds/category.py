from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.engine import Result
from typing import Optional, List, Tuple
import api.models.category as category_model
import api.models.exercise as exercise_model
import api.schemas.category as category_schema


async def create_category(
    db: AsyncSession, category_create: category_schema.CategoryCreate
) -> category_model.Category:
    category = category_model.Category(**category_create.dict())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


async def get_categories(db: AsyncSession) -> List[category_model.Category]:
    result: Result = await (
        db.execute(
            select(
                category_model.Category.id,
                category_model.Category.name
            )
        )
    )
    return result.all()


async def get_assigned_categories(db: AsyncSession) -> List[category_model.Category]:
    result: Result = await (
        db.execute(
            select(
                category_model.Category.id,
                category_model.Category.name
            )
            .join(
                exercise_model.Exercise,
                exercise_model.Exercise.category_id == category_model.Category.id
            )
            .group_by(
                exercise_model.Exercise.category_id
            )
        )
    )
    return result.all()


async def get_category(db: AsyncSession, category_id: int) -> Optional[category_model.Category]:
    result: Result = await db.execute(
        select(category_model.Category).filter(category_model.Category.id == category_id)
    )
    category: Optional[Tuple[category_model.Category]] = result.first()
    return category[0] if category is not None else None


async def update_category(
    db: AsyncSession, category_create: category_schema.CategoryCreate, original: category_model.Category
) -> category_model.Category:
    original.name = category_create.name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original


async def delete_category(db: AsyncSession, original: category_model.Category) -> None:
    await db.delete(original)
    await db.commit()