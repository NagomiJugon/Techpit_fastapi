from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import TypeVar, Callable, Any
from api.db import get_db

T = TypeVar("T")


async def check_resource_exists(
    db: AsyncSession,
    crud_func: Callable[[AsyncSession, int], Any],
    resource_id: int,
    resource_name: str = "Resource"
) -> Any:
    """リソースの存在確認を行うヘルパー関数"""
    resource = await crud_func(db, resource_id)
    if resource is None:
        raise HTTPException(status_code=404, detail=f"{resource_name} not found")
    return resource
