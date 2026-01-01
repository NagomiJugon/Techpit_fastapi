from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import logging

logger = logging.getLogger(__name__)


class AppException(Exception):
    """アプリケーション共通例外"""
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


async def app_exception_handler(request: Request, exc: AppException):
    """AppException のハンドラー"""
    logger.warning(f"AppException: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """SQLAlchemy例外のグローバルハンドラー"""
    logger.error(f"Database error: {str(exc)}")
    
    # IntegrityError の場合はより詳細なメッセージを返す
    if isinstance(exc, IntegrityError):
        return JSONResponse(
            status_code=400,
            content={"detail": "Data constraint violation. Please check your input."},
        )
    
    # その他のデータベースエラー
    return JSONResponse(
        status_code=500,
        content={"detail": "Database error occurred"},
    )


async def general_exception_handler(request: Request, exc: Exception):
    """予期しないエラーのグローバルハンドラー"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


def register_exception_handlers(app: FastAPI):
    """例外ハンドラーを登録"""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
