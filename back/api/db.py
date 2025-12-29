from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlmodel import SQLModel
import asyncio
import logging
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)

ASYNC_DB_URL = "mysql+aiomysql://root@db:3306/demo?charset=utf8"

async_engine = create_async_engine(ASYNC_DB_URL, echo=True)
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession, expire_on_commit=False
)


async def get_db():
    async with async_session() as session:
        yield session


# Provide a SQLAlchemy declarative Base for existing models that import `Base` from `api.db`.
# This keeps backwards compatibility while we migrate models to SQLModel.
Base = declarative_base()


async def init_db(max_retries: int = 10, base_delay: float = 1.0):
    """Try to initialize DB tables, retrying with exponential backoff until the DB is ready.

    Args:
        max_retries: Maximum number of attempts before giving up.
        base_delay: Initial delay in seconds between retries (doubles each retry).
    """
    attempt = 0
    last_exc = None
    while attempt < max_retries:
        try:
            async with async_engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
            logger.info("Database initialized (SQLModel metadata created)")
            return
        except SQLAlchemyError as e:
            last_exc = e
            attempt += 1
            delay = base_delay * (2 ** (attempt - 1))
            logger.warning("Database not ready, attempt %d/%d: %s. Retrying in %.1fs",
                           attempt, max_retries, str(e), delay)
            await asyncio.sleep(delay)
        except Exception as e:
            last_exc = e
            attempt += 1
            delay = base_delay * (2 ** (attempt - 1))
            logger.warning("Unexpected error initializing DB, attempt %d/%d: %s. Retrying in %.1fs",
                           attempt, max_retries, str(e), delay)
            await asyncio.sleep(delay)

    logger.error("Failed to initialize database after %d attempts", max_retries)
    raise RuntimeError("Could not initialize database") from last_exc