"""
Standalone script to create all tables directly from the SQLAlchemy models.

Quickest way to get a working database for a demo:
    python scripts/init_db.py

For a more "real" workflow that tracks schema changes over time, use
Alembic instead:
    alembic upgrade head
"""

import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.database.session import init_models  # noqa: E402


async def main() -> None:
    print("Creating database tables...")
    await init_models()
    print("Done. Tables created: story_sessions, story_options, story_choices, final_stories.")


if __name__ == "__main__":
    asyncio.run(main())
