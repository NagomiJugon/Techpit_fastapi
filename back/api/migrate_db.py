from sqlalchemy import create_engine
from sqlmodel import SQLModel

DB_URL = "mysql+pymysql://root@db:3306/demo?charset=utf8"
engine = create_engine(DB_URL, echo=True)


def reset_database():
    """Drop and recreate all tables declared with SQLModel."""
    SQLModel.metadata.drop_all(bind=engine)
    SQLModel.metadata.create_all(bind=engine)


if __name__ == "__main__":
    reset_database()