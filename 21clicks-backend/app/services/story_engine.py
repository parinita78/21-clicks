"""
The Stateful Story Engine.

This module is the heart of 21 Clicks: it never trains or fine-tunes a
model. Instead, every call to Groq is grounded in context pulled fresh from
PostgreSQL — theme, category, chosen storyline, a rolling summary, and the
last few choices. That's what "simulates intelligent story memory" without
needing a vector database or any model customization.

Step numbering:
- Step 0 is reserved for the 3 initial storylines (not one of the 21 user
  decisions).
- Steps 1-21 are the 21 decisions. `current_step` on a session is the
  number of decisions completed so far (0 to 21).
"""

import logging
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import (
    DuplicateOptionsError,
    InvalidSelectionError,
    InvalidStepError,
    MaxStepsReachedError,
    SessionNotFoundError,
)
from app.models.story import FinalStory, SessionStatus, StoryChoice, StoryOption, StorySession
from app.prompts.templates import (
    build_final_story_prompt,
    build_option_prompt,
    build_storyline_prompt,
    build_summary_prompt,
)
from app.schemas.story import AIFinalStoryOutput, AIOptionsOutput, AIStorylinesOutput, AISummaryOutput
from app.services.groq_service import call_groq_json
from app.services.repetition import get_used_texts, validate_uniqueness
from app.utils.helpers import normalize_text

logger = logging.getLogger("story_engine")

MAX_GENERATION_ATTEMPTS = 3


async def _get_session_or_404(db: AsyncSession, session_id: uuid.UUID) -> StorySession:
    session = await db.get(StorySession, session_id)
    if session is None:
        raise SessionNotFoundError(f"No story session found with id {session_id}")
    return session


async def _persist_options(db: AsyncSession, session_id: uuid.UUID, step_number: int, options: list[str]) -> None:
    for text in options:
        db.add(
            StoryOption(session_id=session_id, step_number=step_number, option_text=text, option_group=step_number)
        )
    await db.flush()


async def _generate_unique_options(
    db: AsyncSession,
    theme: str,
    category: str,
    storyline: str,
    story_summary: Optional[str],
    recent_choices: list[str],
    current_step: int,
    session_id: uuid.UUID,
) -> list[str]:
    """
    Ask Groq for 4 options and regenerate (bounded retries) if any of them
    duplicate something already shown or chosen in this session.
    """
    used_texts = await get_used_texts(db, session_id)
    excluded_sample = used_texts[-12:]  # keep the prompt short; recent history matters most

    last_options: list[str] = []
    for attempt in range(1, MAX_GENERATION_ATTEMPTS + 1):
        system_prompt, user_prompt = build_option_prompt(
            theme=theme,
            category=category,
            storyline=storyline,
            story_summary=story_summary,
            recent_choices=recent_choices,
            current_step=current_step,
            excluded_options=excluded_sample,
            attempt=attempt,
        )
        raw = await call_groq_json(system_prompt, user_prompt)
        parsed = AIOptionsOutput.model_validate(raw)
        last_options = parsed.options

        if validate_uniqueness(last_options, used_texts):
            return last_options

        logger.warning(
            "Duplicate options for session %s step %s on attempt %s; regenerating.",
            session_id,
            current_step,
            attempt,
        )

    raise DuplicateOptionsError(f"Could not generate 4 unique options after {MAX_GENERATION_ATTEMPTS} attempts.")


async def _maybe_refresh_summary(db: AsyncSession, session: StorySession) -> None:
    """Every `summary_interval` decisions, compress the story so far into a short rolling summary."""
    if session.current_step == 0 or session.current_step % settings.summary_interval != 0:
        return

    choice_rows = await db.execute(
        select(StoryChoice.selected_choice).where(StoryChoice.session_id == session.id).order_by(StoryChoice.step_number)
    )
    all_choices = [row[0] for row in choice_rows.all()]
    recent_choices = all_choices[-settings.summary_interval :]

    system_prompt, user_prompt = build_summary_prompt(
        theme=session.theme,
        category=session.category,
        original_prompt=session.original_prompt,
        storyline=session.selected_storyline or "",
        previous_summary=session.story_summary,
        recent_choices=recent_choices,
    )
    raw = await call_groq_json(system_prompt, user_prompt)
    parsed = AISummaryOutput.model_validate(raw)
    session.story_summary = parsed.summary


async def _generate_final_story(db: AsyncSession, session: StorySession) -> str:
    choice_rows = await db.execute(
        select(StoryChoice.selected_choice).where(StoryChoice.session_id == session.id).order_by(StoryChoice.step_number)
    )
    all_choices = [row[0] for row in choice_rows.all()]

    system_prompt, user_prompt = build_final_story_prompt(
        theme=session.theme,
        category=session.category,
        original_prompt=session.original_prompt,
        storyline=session.selected_storyline,
        story_summary=session.story_summary,
        all_choices=all_choices,
    )
    raw = await call_groq_json(system_prompt, user_prompt)
    parsed = AIFinalStoryOutput.model_validate(raw)

    full_text = f"{parsed.title}\n\n{parsed.story}"
    db.add(FinalStory(session_id=session.id, story_content=full_text))
    await db.flush()
    return full_text


# ---------------------------------------------------------------------------
# Public API used by the routes
# ---------------------------------------------------------------------------


async def start_session(db: AsyncSession, theme: str, category: str, original_prompt: str):
    session = StorySession(theme=theme, category=category, original_prompt=original_prompt)
    db.add(session)
    await db.flush()  # assigns session.id

    system_prompt, user_prompt = build_storyline_prompt(theme, category, original_prompt)
    raw = await call_groq_json(system_prompt, user_prompt)
    parsed = AIStorylinesOutput.model_validate(raw)

    await _persist_options(db, session.id, step_number=0, options=parsed.storylines)
    await db.commit()
    await db.refresh(session)
    return session, parsed.storylines


async def select_storyline(db: AsyncSession, session_id: uuid.UUID, selected_storyline: str):
    session = await _get_session_or_404(db, session_id)

    if session.selected_storyline is not None:
        raise InvalidStepError("A storyline has already been selected for this session.")

    offered = await db.execute(
        select(StoryOption.option_text).where(StoryOption.session_id == session_id, StoryOption.step_number == 0)
    )
    offered_texts = [row[0] for row in offered.all()]
    if not any(normalize_text(selected_storyline) == normalize_text(t) for t in offered_texts):
        raise InvalidSelectionError("Selected storyline does not match any storyline that was offered.")

    session.selected_storyline = selected_storyline
    await db.flush()

    options = await _generate_unique_options(
        db,
        session.theme,
        session.category,
        selected_storyline,
        session.story_summary,
        recent_choices=[],
        current_step=1,
        session_id=session.id,
    )
    await _persist_options(db, session.id, step_number=1, options=options)
    await db.commit()
    await db.refresh(session)
    return session, options


async def select_option(db: AsyncSession, session_id: uuid.UUID, selected_option: str):
    session = await _get_session_or_404(db, session_id)

    if session.selected_storyline is None:
        raise InvalidStepError("Select a storyline before making story decisions.")
    if session.status == SessionStatus.COMPLETED:
        raise MaxStepsReachedError("This story has already reached its 21st decision and is complete.")

    target_step = session.current_step + 1
    offered = await db.execute(
        select(StoryOption.option_text).where(
            StoryOption.session_id == session_id, StoryOption.step_number == target_step
        )
    )
    offered_texts = [row[0] for row in offered.all()]
    if not any(normalize_text(selected_option) == normalize_text(t) for t in offered_texts):
        raise InvalidSelectionError("Selected option does not match any option that was offered for this step.")

    db.add(StoryChoice(session_id=session_id, step_number=target_step, selected_choice=selected_option))
    session.current_step = target_step
    await db.flush()

    await _maybe_refresh_summary(db, session)

    if session.current_step >= settings.total_decisions:
        final_story = await _generate_final_story(db, session)
        session.status = SessionStatus.COMPLETED
        await db.commit()
        await db.refresh(session)
        return session, None, final_story

    choice_rows = await db.execute(
        select(StoryChoice.selected_choice)
        .where(StoryChoice.session_id == session_id)
        .order_by(StoryChoice.step_number.desc())
        .limit(3)
    )
    recent_choices = [row[0] for row in choice_rows.all()][::-1]

    next_step = session.current_step + 1
    options = await _generate_unique_options(
        db,
        session.theme,
        session.category,
        session.selected_storyline,
        session.story_summary,
        recent_choices,
        current_step=next_step,
        session_id=session.id,
    )
    await _persist_options(db, session.id, step_number=next_step, options=options)
    await db.commit()
    await db.refresh(session)
    return session, options, None


async def get_session(db: AsyncSession, session_id: uuid.UUID) -> StorySession:
    return await _get_session_or_404(db, session_id)


async def get_final_story(db: AsyncSession, session_id: uuid.UUID) -> FinalStory:
    session = await _get_session_or_404(db, session_id)
    if session.status != SessionStatus.COMPLETED:
        raise InvalidStepError("This story has not been completed yet (21 decisions required).")

    result = await db.execute(select(FinalStory).where(FinalStory.session_id == session_id))
    final_story = result.scalar_one_or_none()
    if final_story is None:
        raise SessionNotFoundError("Final story record not found for this session.")
    return final_story
