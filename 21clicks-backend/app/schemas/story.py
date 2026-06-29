"""
Pydantic schemas.

Split into three groups:
1. Request schemas  — validate incoming API payloads.
2. Response schemas  — shape what the API returns.
3. AI output schemas — validate the JSON that comes back from Groq before
   it's trusted anywhere else in the app.
"""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.models.story import SessionStatus

# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------


class StoryStartRequest(BaseModel):
    theme: str = Field(..., min_length=1, max_length=100, examples=["Adventure"])
    category: str = Field(..., min_length=1, max_length=100, examples=["Time Travel Tales"])
    original_prompt: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        examples=["A scientist discovers a hidden portal beneath an abandoned temple."],
    )


class SelectStorylineRequest(BaseModel):
    session_id: uuid.UUID
    selected_storyline: str = Field(..., min_length=1)


class SelectOptionRequest(BaseModel):
    session_id: uuid.UUID
    selected_option: str = Field(..., min_length=1)


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------


class StoryStartResponse(BaseModel):
    session_id: uuid.UUID
    theme: str
    category: str
    storylines: list[str]


class StorylineSelectedResponse(BaseModel):
    session_id: uuid.UUID
    current_step: int
    options: list[str]


class OptionStepResponse(BaseModel):
    session_id: uuid.UUID
    current_step: int
    status: SessionStatus
    is_complete: bool
    options: Optional[list[str]] = None
    final_story: Optional[str] = None


class ChoiceItem(BaseModel):
    step_number: int
    selected_choice: str


class SessionDetailResponse(BaseModel):
    id: uuid.UUID
    theme: str
    category: str
    original_prompt: str
    selected_storyline: Optional[str]
    current_step: int
    status: SessionStatus
    story_summary: Optional[str]
    choices: list[ChoiceItem]
    created_at: datetime


class FinalStoryResponse(BaseModel):
    session_id: uuid.UUID
    story_content: str
    created_at: datetime


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str


# ---------------------------------------------------------------------------
# AI output validation schemas (Groq JSON responses get parsed into these)
# ---------------------------------------------------------------------------


class AIStorylinesOutput(BaseModel):
    storylines: list[str]

    @field_validator("storylines")
    @classmethod
    def must_have_exactly_three(cls, v: list[str]) -> list[str]:
        if len(v) != 3:
            raise ValueError(f"Expected exactly 3 storylines, got {len(v)}")
        return v


class AIOptionsOutput(BaseModel):
    options: list[str]

    @field_validator("options")
    @classmethod
    def must_have_exactly_four(cls, v: list[str]) -> list[str]:
        if len(v) != 4:
            raise ValueError(f"Expected exactly 4 options, got {len(v)}")
        return v


class AISummaryOutput(BaseModel):
    summary: str


class AIFinalStoryOutput(BaseModel):
    title: str
    story: str
