from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import joinedload
from typing import List, Optional
from datetime import date
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
    
    # 関連データをロードして返す
    stmt = select(ExerciseRecord).where(ExerciseRecord.id == rec.id).options(
        joinedload(ExerciseRecord.exercise).joinedload(Exercise.category)
    )
    result = await db.execute(stmt)
    rec_with_relations = result.scalars().first()
    return rec_with_relations


async def get_exercise_records(db: AsyncSession, target_date: Optional[date] = None) -> List[ExerciseRecord]:
    """指定された日付のレコードを返す。`target_date` が None の場合は本日分を返す。"""
    if target_date is None:
        target_date = date.today()

    stmt = select(ExerciseRecord).where(ExerciseRecord.exercise_date == target_date).options(
        joinedload(ExerciseRecord.exercise).joinedload(Exercise.category)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_exercise_record_by_id(db: AsyncSession, record_id: int) -> Optional[ExerciseRecord]:
    """指定されたIDのエクササイズレコードを取得"""
    stmt = select(ExerciseRecord).where(ExerciseRecord.id == record_id).options(
        joinedload(ExerciseRecord.exercise).joinedload(Exercise.category)
    )
    result = await db.execute(stmt)
    return result.scalars().first()


async def update_exercise_record(
    db: AsyncSession, record_id: int, exercise_record_update: exercise_record_schema.ExerciseRecordCreate
) -> Optional[ExerciseRecord]:
    """エクササイズレコードを更新"""
    stmt = select(ExerciseRecord).where(ExerciseRecord.id == record_id)
    result = await db.execute(stmt)
    rec = result.scalars().first()
    
    if not rec:
        return None
    
    rec.exercise_id = exercise_record_update.exercise_id
    rec.weight = exercise_record_update.weight
    rec.rep = exercise_record_update.rep
    
    await db.commit()
    await db.refresh(rec)
    
    # 関連データをロードして返す
    stmt = select(ExerciseRecord).where(ExerciseRecord.id == rec.id).options(
        joinedload(ExerciseRecord.exercise).joinedload(Exercise.category)
    )
    result = await db.execute(stmt)
    rec_with_relations = result.scalars().first()
    return rec_with_relations


async def delete_exercise_record(db: AsyncSession, record_id: int) -> bool:
    """エクササイズレコードを削除"""
    stmt = select(ExerciseRecord).where(ExerciseRecord.id == record_id)
    result = await db.execute(stmt)
    rec = result.scalars().first()
    
    if not rec:
        return False
    
    await db.delete(rec)
    await db.commit()
    return True