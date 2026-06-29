"""
Async SQLAlchemy engine/session setup. This is the only place the app talks
to asyncpg directly — everything else goes through the `get_db` dependency.
"""

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""


engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
    future=True,
    connect_args={"ssl": False},
)
connect_args={"ssl": False},
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db():
    """FastAPI dependency that yields one DB session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_models() -> None:
    """
    Create all tables directly from the ORM metadata. Handy for local dev
    and class demos. For anything resembling production, use the Alembic
    migration in alembic/versions/ instead (see scripts/init_db.py vs
    `alembic upgrade head` in the README).
    """
    # Import models so they're registered on Base.metadata before create_all.
    from app.models import story  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
