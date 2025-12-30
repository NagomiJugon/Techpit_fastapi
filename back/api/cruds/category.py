from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import Optional, List
from api.sqlmodels import Category, Exercise
import api.schemas.category as category_schema


async def create_category(
    db: AsyncSession, category_create: category_schema.CategoryCreate
) -> Category:
    category = Category(name=category_create.name)
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


async def get_categories(db: AsyncSession) -> List[Category]:
    result = await db.execute(select(Category))
    return result.scalars().all()


async def get_assigned_categories(db: AsyncSession) -> List[Category]:
    stmt = select(Category).join(Exercise).group_by(Category.id)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_category(db: AsyncSession, category_id: int) -> Optional[Category]:
    result = await db.execute(select(Category).where(Category.id == category_id))
    return result.scalars().first()


async def update_category(
    db: AsyncSession, category_create: category_schema.CategoryCreate, original: Category
) -> Category:
    original.name = category_create.name
    db.add(original)
    await db.commit()
    await db.refresh(original)
    return original


async def delete_category(db: AsyncSession, original: Category) -> None:
    await db.delete(original)
    await db.commit()