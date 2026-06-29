"""
FastAPI application factory / entrypoint.

Run locally with: python run.py
Or directly with: uvicorn app.main:app --reload
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.database.session import init_models

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="21 Clicks Backend",
    description="AI-powered interactive storytelling engine — 21 decisions, one personalized story.",
    version="1.0.0",
)

# Frontend is a separate app/origin, so CORS is wide open for this academic build.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)
app.include_router(router)


@app.on_event("startup")
async def on_startup() -> None:
    if settings.auto_create_tables:
        await init_models()
