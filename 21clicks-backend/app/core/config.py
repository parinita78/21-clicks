"""
Central application configuration.

All values are loaded from environment variables (or a local .env file).
Nothing here should be hardcoded for production use — see .env.example
for the full list of variables this project expects.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database -----------------------------------------------------
    database_url: str = "postgresql+asyncpg://postgres:YourPassword@localhost:5432/clicks21"
    database_url_sync: str = "postgresql+psycopg2://postgres:YourPassword@localhost:5432/clicks21"

    # --- Groq -----------------------------------------------------------
    groq_api_key: str = "your_groq_api_key_here"
    groq_model: str = "llama-3.3-70b-versatile"
    groq_temperature: float = 0.7
    groq_max_tokens: int = 1500
    groq_max_retries: int = 3

    # --- App --------------------------------------------------------------
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    auto_create_tables: bool = True  # convenience for first run / demos

    # --- Story engine constants --------------------------------------------
    total_decisions: int = 21
    options_per_step: int = 4
    storylines_count: int = 3
    summary_interval: int = 3  # refresh the rolling summary every N decisions

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
