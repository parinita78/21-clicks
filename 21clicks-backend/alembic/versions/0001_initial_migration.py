"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-06-21

Creates the four core tables: story_sessions, story_options, story_choices,
final_stories — matching app/models/story.py exactly.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    session_status = postgresql.ENUM("in_progress", "completed", name="session_status")
    session_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "story_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("theme", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("original_prompt", sa.Text(), nullable=False),
        sa.Column("selected_storyline", sa.Text(), nullable=True),
        sa.Column("current_step", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("story_summary", sa.Text(), nullable=True),
        sa.Column("status", session_status, nullable=False, server_default="in_progress"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_story_sessions_status", "story_sessions", ["status"])

    op.create_table(
        "story_options",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "session_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("story_sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("step_number", sa.Integer(), nullable=False),
        sa.Column("option_text", sa.Text(), nullable=False),
        sa.Column("option_group", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_story_options_session_step", "story_options", ["session_id", "step_number"])

    op.create_table(
        "story_choices",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "session_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("story_sessions.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("step_number", sa.Integer(), nullable=False),
        sa.Column("selected_choice", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("session_id", "step_number", name="uq_story_choices_session_step"),
    )
    op.create_index("ix_story_choices_session_step", "story_choices", ["session_id", "step_number"])

    op.create_table(
        "final_stories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "session_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("story_sessions.id", ondelete="CASCADE"),
            nullable=False,
            unique=True,
        ),
        sa.Column("story_content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("final_stories")
    op.drop_table("story_choices")
    op.drop_table("story_options")
    op.drop_table("story_sessions")
    postgresql.ENUM(name="session_status").drop(op.get_bind(), checkfirst=True)
