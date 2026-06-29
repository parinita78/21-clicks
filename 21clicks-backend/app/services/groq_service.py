"""
Thin async wrapper around the Groq chat completions API.

Responsibilities:
- Hold the single AsyncGroq client used by the whole app.
- Always request JSON-mode output and hand back a parsed dict.
- Retry on transient network/API errors and on malformed JSON, up to
  settings.groq_max_retries attempts, then raise GroqServiceError.

This is intentionally the *only* file that imports the groq package, so the
provider could be swapped later without touching the story engine.
"""

import json
import logging
import re
from typing import Optional

from groq import APIConnectionError, APIError, AsyncGroq, RateLimitError

from app.core.config import settings
from app.core.exceptions import GroqServiceError

logger = logging.getLogger("groq_service")

_client = AsyncGroq(api_key=settings.groq_api_key)


def _extract_json(raw_text: str) -> dict:
    """
    Parse a JSON object out of the model's raw text. Groq's JSON mode
    normally returns a clean object, but this guards against stray
    markdown fences or extra text around it.
    """
    text = raw_text.strip()
    text = re.sub(r"^```(json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


async def call_groq_json(system_prompt: str, user_prompt: str, max_retries: Optional[int] = None) -> dict:
    """
    Call Groq's chat completion endpoint in JSON mode and return a parsed dict.
    Retries on transient errors or malformed JSON before giving up.
    """
    retries = max_retries if max_retries is not None else settings.groq_max_retries
    last_error: Optional[Exception] = None

    for attempt in range(1, retries + 1):
        try:
            response = await _client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=settings.groq_temperature,
                max_tokens=settings.groq_max_tokens,
                response_format={"type": "json_object"},
            )
            raw_content = response.choices[0].message.content
            return _extract_json(raw_content)

        except (APIConnectionError, RateLimitError) as exc:
            last_error = exc
            logger.warning("Groq transient error on attempt %s/%s: %s", attempt, retries, exc)
        except APIError as exc:
            last_error = exc
            logger.warning("Groq API error on attempt %s/%s: %s", attempt, retries, exc)
        except (json.JSONDecodeError, ValueError) as exc:
            last_error = exc
            logger.warning("Groq returned unparsable JSON on attempt %s/%s: %s", attempt, retries, exc)

    raise GroqServiceError(f"Groq request failed after {retries} attempts: {last_error}")
