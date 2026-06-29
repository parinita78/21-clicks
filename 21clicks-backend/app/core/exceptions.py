"""
Custom exceptions for the story engine, plus a single function that wires
them up to proper HTTP responses. Routes and services raise these directly
instead of HTTPException, which keeps business logic free of HTTP concerns.
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse


class StoryEngineError(Exception):
    """Base exception for all story engine related errors."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class SessionNotFoundError(StoryEngineError):
    """Raised when a story session id does not exist."""


class InvalidStepError(StoryEngineError):
    """Raised when an operation is attempted out of the expected step order
    (e.g. picking an option before a storyline has been selected)."""


class InvalidSelectionError(StoryEngineError):
    """Raised when a user submits a storyline/option that was never offered."""


class MaxStepsReachedError(StoryEngineError):
    """Raised when trying to keep playing a story that already hit 21 decisions."""


class GroqServiceError(StoryEngineError):
    """Raised when the Groq API fails or returns output that can't be parsed."""


class DuplicateOptionsError(StoryEngineError):
    """Raised when unique options can't be generated after the retry budget."""


_STATUS_MAP = {
    SessionNotFoundError: status.HTTP_404_NOT_FOUND,
    InvalidStepError: status.HTTP_409_CONFLICT,
    InvalidSelectionError: status.HTTP_400_BAD_REQUEST,
    MaxStepsReachedError: status.HTTP_409_CONFLICT,
    GroqServiceError: status.HTTP_502_BAD_GATEWAY,
    DuplicateOptionsError: status.HTTP_502_BAD_GATEWAY,
}


def register_exception_handlers(app) -> None:
    """Attach a JSON error handler for every StoryEngineError subclass."""

    for exc_class, http_status in _STATUS_MAP.items():

        def make_handler(captured_status: int):
            async def handler(request: Request, exc: StoryEngineError):
                return JSONResponse(
                    status_code=captured_status,
                    content={"error": exc.__class__.__name__, "detail": exc.message},
                )

            return handler

        app.add_exception_handler(exc_class, make_handler(http_status))
