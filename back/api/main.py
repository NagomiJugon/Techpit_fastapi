from fastapi import FastAPI
from api.routers import exercise, exercise_record, category, routine, health
from fastapi.middleware.cors import CORSMiddleware
from api.db import init_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可（開発環境ではこれでも問題ない）
    allow_credentials=True,
    allow_methods=["*"],  # 全てのHTTPメソッドを許可
    allow_headers=["*"],  # 全てのヘッダーを許可
)

app.include_router(exercise.router)
app.include_router(exercise_record.router)
app.include_router(category.router)
app.include_router(routine.router)
app.include_router(health.router)


@app.on_event("startup")
async def on_startup():
    await init_db()