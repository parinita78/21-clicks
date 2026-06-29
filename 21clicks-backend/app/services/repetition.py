"""
Database-aware side of the anti-repetition system. Pulls every option ever
shown and every choice ever made in a session, then leans on the pure text
helpers in app/utils/helpers.py to decide whether a freshly generated batch
is acceptable.
"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.story import StoryChoice, StoryOption
from app.utils.helpers import find_duplicates, has_internal_duplicates


async def get_used_texts(db: AsyncSession, session_id: uuid.UUID) -> list[str]:
    """
    Every piece of text the user has already seen or chosen in this session:
    all previously generated options (storylines included) plus every
    selected choice. New option batches are checked against this pool.
    """
    option_rows = await db.execute(select(StoryOption.option_text).where(StoryOption.session_id == session_id))
    choice_rows = await db.execute(select(StoryChoice.selected_choice).where(StoryChoice.session_id == session_id))

    options = [row[0] for row in option_rows.all()]
    choices = [row[0] for row in choice_rows.all()]
    return options + choices


def validate_uniqueness(new_options: list[str], used_texts: list[str]) -> bool:
    """True if the new batch has no duplicates against history and none against itself."""
    if has_internal_duplicates(new_options):
        return False
    if find_duplicates(new_options, used_texts):
        return False
    return True
