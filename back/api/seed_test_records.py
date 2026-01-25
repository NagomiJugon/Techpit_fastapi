"""
テストデータ生成スクリプト

使用方法:
docker compose exec demo-app python -c "from api.seed_test_records import seed_test_records; import asyncio; asyncio.run(seed_test_records())"
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from api.db import async_engine
from api.models.category import Category  # リレーション解決のため必要
from api.models.exercise import Exercise
from api.models.exercise_record import ExerciseRecord
from datetime import datetime, timedelta
import random


async def seed_test_records():
    """200件のテストデータを生成（週4日、1日4種目）"""
    
    async with AsyncSession(async_engine) as session:
        # 全てのエクササイズを取得
        stmt = select(Exercise)
        result = await session.execute(stmt)
        exercises = result.scalars().all()
        
        if len(exercises) == 0:
            print("エクササイズが存在しません。先に seed_initial_data.py を実行してください。")
            return
        
        print(f"利用可能なエクササイズ: {len(exercises)}件")
        
        # 200件のテストデータを作成
        # 1日4種目 × 50日分（約3ヶ月、週4日ペース）
        target_records = 200
        records_per_day = 4
        
        # 今日から過去に遡ってデータを作成
        today = datetime.now().date()
        created_count = 0
        
        # 週4日のトレーニングパターン（月、水、金、土）
        training_days = [0, 2, 4, 5]  # 0=月曜日, 2=水曜日, 4=金曜日, 5=土曜日
        
        days_back = 0
        while created_count < target_records:
            current_date = today - timedelta(days=days_back)
            day_of_week = current_date.weekday()
            
            # 週4日のパターンに合致する日のみトレーニング記録を作成
            if day_of_week in training_days:
                # この日に行うエクササイズをランダムに4つ選択
                daily_exercises = random.sample(list(exercises), min(records_per_day, len(exercises)))
                
                for exercise in daily_exercises:
                    # 重量: 20kg〜100kg（5kg刻み）
                    weight = random.randrange(20, 105, 5)
                    
                    # 回数: 5〜15回
                    rep = random.randint(5, 15)
                    
                    # セット: 3〜5セット
                    set_count = random.randint(3, 5)
                    
                    record = ExerciseRecord(
                        exercise_id=exercise.id,
                        exercise_date=current_date,
                        weight=weight,
                        rep=rep,
                        set=set_count
                    )
                    
                    session.add(record)
                    created_count += 1
                    
                    if created_count >= target_records:
                        break
            
            days_back += 1
            
            # 無限ループ防止（最大1年前まで）
            if days_back > 365:
                break
        
        await session.commit()
        print(f"\nテストデータ作成完了: {created_count}件の記録を作成しました")
        print(f"期間: {today - timedelta(days=days_back)} 〜 {today}")
