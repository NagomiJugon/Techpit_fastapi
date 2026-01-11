from fastapi import FastAPI
from api.routers import exercise, exercise_record, category, routine, health
from fastapi.middleware.cors import CORSMiddleware
from api.db import init_db
from api.core.config import settings
from api.core.exceptions import register_exception_handlers


app = FastAPI(
    title="Broccoli API",
    description="フィットネス管理アプリケーション API",
    version="0.1.0",
    openapi_url="/openapi.json",
)

# 例外ハンドラーを登録
register_exception_handlers(app)

# CORS設定を環境変数から読み込み
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

app.include_router(exercise.router)
app.include_router(exercise_record.router)
app.include_router(category.router)
app.include_router(routine.router)
app.include_router(health.router)


@app.on_event("startup")
async def on_startup():
    await init_db()