"""
Prompt templates for the 21 Clicks story engine.

Every builder returns a (system_prompt, user_prompt) tuple. The system
prompt fixes the AI's role and output contract; the user prompt carries the
actual story context pulled from the database. All templates demand a
single JSON object and nothing else, which keeps parsing in
groq_service.py simple and reliable, and is what makes the "stateful story
engine without model training" approach work — continuity comes entirely
from what we feed back in here, not from any memory inside the model.
"""

from typing import Optional


def build_storyline_prompt(theme: str, category: str, original_prompt: str) -> tuple[str, str]:
    system_prompt = (
        "You are a creative story architect for an interactive fiction app called 21 Clicks. "
        "You design branching story openings. You always respond with a single valid JSON object "
        "and nothing else — no markdown, no commentary, no preamble."
    )
    user_prompt = f"""
Theme: {theme}
Category: {category}
User's opening prompt: "{original_prompt}"

Generate exactly 3 distinct storyline directions that could grow out of this opening.
Each storyline must:
- Be 2-3 sentences long.
- Take the premise in a clearly different direction from the other two (different tone, conflict, or focus).
- Fit the theme and category given above.
- Set up a story with room for many future decisions (this story will eventually involve 21 choices).

Respond with this exact JSON shape and nothing else:
{{"storylines": ["...", "...", "..."]}}
""".strip()
    return system_prompt, user_prompt


def build_option_prompt(
    theme: str,
    category: str,
    storyline: str,
    story_summary: Optional[str],
    recent_choices: list[str],
    current_step: int,
    excluded_options: list[str],
    attempt: int = 1,
) -> tuple[str, str]:
    system_prompt = (
        "You are the narrative engine for 21 Clicks, an interactive story built from 21 user decisions. "
        "You continue an existing story by proposing new branching options. You always respond with a "
        "single valid JSON object and nothing else — no markdown, no commentary, no preamble."
    )

    context_lines = [f"Theme: {theme}", f"Category: {category}", f"Chosen storyline: {storyline}"]
    if story_summary:
        context_lines.append(f"Story so far (summary): {story_summary}")
    if recent_choices:
        context_lines.append(f"Most recent decisions, in order: {' -> '.join(recent_choices)}")
    context_lines.append(f"This is decision {current_step} of 21.")
    context_block = "\n".join(context_lines)

    avoid_block = ""
    if excluded_options:
        avoid_list = "\n".join(f"- {opt}" for opt in excluded_options)
        avoid_block = (
            f"\nDo not repeat, paraphrase, or closely resemble any of these earlier options or choices:\n{avoid_list}\n"
        )

    retry_note = ""
    if attempt > 1:
        retry_note = (
            "\nYour previous attempt produced options that duplicated earlier story content. "
            "Generate genuinely different options this time.\n"
        )

    user_prompt = f"""
{context_block}
{avoid_block}{retry_note}
Generate exactly 4 options that continue the story from this point.
Each option must:
- Be 30 to 35 words long.
- Continue logically from the story so far, with no contradictions.
- Lead the story in a meaningfully different direction from the other 3 options.
- Read as natural, engaging story prose (not a menu label).

Respond with this exact JSON shape and nothing else:
{{"options": ["...", "...", "...", "..."]}}
""".strip()
    return system_prompt, user_prompt


def build_summary_prompt(
    theme: str,
    category: str,
    original_prompt: str,
    storyline: str,
    previous_summary: Optional[str],
    recent_choices: list[str],
) -> tuple[str, str]:
    system_prompt = (
        "You are a continuity editor for an interactive story. You compress story progress into a short, "
        "information-dense summary that another writer can use as their only context for what happened. "
        "You always respond with a single valid JSON object and nothing else."
    )

    if previous_summary:
        history_block = f"Previous summary: {previous_summary}"
    else:
        history_block = f'Original prompt: "{original_prompt}"\nChosen storyline: {storyline}'

    choices_block = "\n".join(f"- {c}" for c in recent_choices)

    user_prompt = f"""
Theme: {theme}
Category: {category}
{history_block}

Most recent decisions to fold into the summary:
{choices_block}

Write an updated summary of the entire story so far, 100 to 150 words, preserving every major
event and decision so the story can continue later without losing continuity.

Respond with this exact JSON shape and nothing else:
{{"summary": "..."}}
""".strip()
    return system_prompt, user_prompt


def build_final_story_prompt(
    theme: str,
    category: str,
    original_prompt: str,
    storyline: Optional[str],
    story_summary: Optional[str],
    all_choices: list[str],
) -> tuple[str, str]:
    system_prompt = (
        "You are a skilled storyteller closing out a 21-decision interactive story. You weave every major "
        "choice into one coherent, satisfying narrative. You always respond with a single valid JSON object "
        "and nothing else."
    )

    choices_block = "\n".join(f"{i + 1}. {c}" for i, c in enumerate(all_choices))
    summary_block = f"Story summary so far: {story_summary}\n" if story_summary else ""

    user_prompt = f"""
Theme: {theme}
Category: {category}
Original prompt: "{original_prompt}"
Chosen storyline: {storyline}
{summary_block}
All 21 decisions made by the user, in order:
{choices_block}

Write the complete final story. It must:
- Have a clear beginning, middle, and ending.
- Reflect the theme and category throughout.
- Weave in the major turns implied by the user's decisions, in order, so it reads as one story they
  personally shaped rather than a list of events.
- End with a meaningful, satisfying conclusion.
- Be flowing prose, roughly 500-800 words.

Respond with this exact JSON shape and nothing else:
{{"title": "...", "story": "..."}}
""".strip()
    return system_prompt, user_prompt
