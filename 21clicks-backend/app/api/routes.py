"""
HTTP layer. Routes stay thin — they validate input via Pydantic, call into
the story engine, and shape the response. All story logic lives in
app/services/story_engine.py.
"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.story import (
    ChoiceItem,
    FinalStoryResponse,
    HealthResponse,
    OptionStepResponse,
    SelectOptionRequest,
    SelectStorylineRequest,
    SessionDetailResponse,
    StoryStartRequest,
    StoryStartResponse,
    StorylineSelectedResponse,
)
from app.services import story_engine

router = APIRouter()


@router.post("/story/start", response_model=StoryStartResponse, tags=["Story"])
async def start_story(payload: StoryStartRequest, db: AsyncSession = Depends(get_db)):
    """Create a new story session and generate the first 3 storyline directions."""
    session, storylines = await story_engine.start_session(
        db, payload.theme, payload.category, payload.original_prompt
    )
    return StoryStartResponse(
        session_id=session.id, theme=session.theme, category=session.category, storylines=storylines
    )


@router.post("/story/select-storyline", response_model=StorylineSelectedResponse, tags=["Story"])
async def select_storyline(payload: SelectStorylineRequest, db: AsyncSession = Depends(get_db)):
    """Lock in the chosen storyline and generate the first 4 continuation options."""
    session, options = await story_engine.select_storyline(db, payload.session_id, payload.selected_storyline)
    return StorylineSelectedResponse(session_id=session.id, current_step=session.current_step, options=options)


@router.post("/story/select-option", response_model=OptionStepResponse, tags=["Story"])
async def select_option(payload: SelectOptionRequest, db: AsyncSession = Depends(get_db)):
    """
    Record a decision. Returns the next 4 options, or — once 21 decisions
    have been made — the completed final story instead.
    """
    session, options, final_story = await story_engine.select_option(db, payload.session_id, payload.selected_option)
    return OptionStepResponse(
        session_id=session.id,
        current_step=session.current_step,
        status=session.status,
        is_complete=final_story is not None,
        options=options,
        final_story=final_story,
    )


@router.get("/story/session/{session_id}", response_model=SessionDetailResponse, tags=["Story"])
async def get_session(session_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return full session state: progress, story summary, and choice history."""
    session = await story_engine.get_session(db, session_id)
    choices = [ChoiceItem(step_number=c.step_number, selected_choice=c.selected_choice) for c in session.choices]
    return SessionDetailResponse(
        id=session.id,
        theme=session.theme,
        category=session.category,
        original_prompt=session.original_prompt,
        selected_storyline=session.selected_storyline,
        current_step=session.current_step,
        status=session.status,
        story_summary=session.story_summary,
        choices=choices,
        created_at=session.created_at,
    )


@router.get("/story/final-story/{session_id}", response_model=FinalStoryResponse, tags=["Story"])
async def get_final_story(session_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return the completed final story for a finished session."""
    final_story = await story_engine.get_final_story(db, session_id)
    return FinalStoryResponse(
        session_id=final_story.session_id,
        story_content=final_story.story_content,
        created_at=final_story.created_at,
    )


@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    return HealthResponse(status="ok", app="21 Clicks Backend", version="1.0.0")
