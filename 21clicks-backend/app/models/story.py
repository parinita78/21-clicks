"""
SQLAlchemy models for the 21 Clicks story memory system.

Four tables:
- story_sessions: one row per playthrough; the source of truth for state.
- story_options:  every option the AI ever generated (storylines included,
                   stored at step_number=0), used for anti-repetition checks.
- story_choices:  the option the user actually picked at each step.
- final_stories:  the completed story generated after the 21st decision.
"""

import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class SessionStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class StorySession(Base):
    __tablename__ = "story_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    theme: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    original_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    selected_storyline: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    current_step: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    story_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[SessionStatus] = mapped_column(
        SAEnum(SessionStatus, name="session_status"), nullable=False, default=SessionStatus.IN_PROGRESS
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    options: Mapped[list["StoryOption"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", order_by="StoryOption.step_number"
    )
    choices: Mapped[list["StoryChoice"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", order_by="StoryChoice.step_number"
    )
    final_story: Mapped[Optional["FinalStory"]] = relationship(
        back_populates="session", cascade="all, delete-orphan", uselist=False
    )

    __table_args__ = (Index("ix_story_sessions_status", "status"),)


class StoryOption(Base):
    __tablename__ = "story_options"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("story_sessions.id", ondelete="CASCADE"), nullable=False
    )
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    option_text: Mapped[str] = mapped_column(Text, nullable=False)
    # option_group identifies which generated batch this row belongs to.
    # It mirrors step_number (step 0 = the 3 initial storylines, steps
    # 1-21 = the 4 options offered at each decision).
    option_group: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    session: Mapped["StorySession"] = relationship(back_populates="options")

    __table_args__ = (Index("ix_story_options_session_step", "session_id", "step_number"),)


class StoryChoice(Base):
    __tablename__ = "story_choices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("story_sessions.id", ondelete="CASCADE"), nullable=False
    )
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    selected_choice: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    session: Mapped["StorySession"] = relationship(back_populates="choices")

    __table_args__ = (
        UniqueConstraint("session_id", "step_number", name="uq_story_choices_session_step"),
        Index("ix_story_choices_session_step", "session_id", "step_number"),
    )


class FinalStory(Base):
    __tablename__ = "final_stories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("story_sessions.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    story_content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    session: Mapped["StorySession"] = relationship(back_populates="final_story")
