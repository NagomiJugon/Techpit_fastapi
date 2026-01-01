import os
from typing import List


class Settings:
    """アプリケーション設定"""
    
    # CORS設定
    # デフォルトは開発環境用の複数ポートをサポート
    CORS_ORIGINS: List[str] = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:3000,http://localhost:3001,http://localhost:5173"
    ).split(",")
    CORS_ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # データベース設定
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+aiomysql://root@db:3306/demo?charset=utf8")


settings = Settings()
