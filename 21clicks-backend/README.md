# 21 Clicks — Backend

AI-powered interactive storytelling backend. A user makes 21 decisions; the
backend uses Groq to generate the storylines and branching options at each
step, then weaves all 21 choices into one personalized final story.

No model is trained or fine-tuned. Continuity comes from a **Stateful Story
Engine**: every AI call is grounded in context pulled fresh from PostgreSQL
(theme, category, chosen storyline, a rolling summary, and recent choices).

---

## 1. Project structure

```
21clicks-backend/
├── app/
│   ├── main.py                 # FastAPI app, CORS, startup hook
│   ├── core/
│   │   ├── config.py            # env-driven settings
│   │   └── exceptions.py        # custom exceptions + HTTP error mapping
│   ├── database/
│   │   └── session.py           # async engine, session factory, get_db
│   ├── models/
│   │   └── story.py             # SQLAlchemy ORM models
│   ├── schemas/
│   │   └── story.py             # Pydantic request/response/AI-output schemas
│   ├── prompts/
│   │   └── templates.py         # prompt engineering for all 4 AI tasks
│   ├── services/
│   │   ├── groq_service.py      # Groq API client, JSON mode, retries
│   │   ├── repetition.py        # DB-aware anti-repetition checks
│   │   └── story_engine.py      # core orchestration logic
│   ├── api/
│   │   └── routes.py            # all FastAPI endpoints
│   └── utils/
│       └── helpers.py           # text normalization, fuzzy-match helpers
├── alembic/                     # database migrations
│   └── versions/0001_initial_migration.py
├── scripts/
│   └── init_db.py               # quick `create_all` for local dev
├── requirements.txt
├── .env.example
└── run.py
```

## 2. Prerequisites

- Python 3.11+
- PostgreSQL 14+ running locally or remotely
- A Groq API key (https://console.groq.com)

## 3. Setup

```bash
# 1. Clone / unzip the project, then enter it
cd 21clicks-backend

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# then edit .env: set GROQ_API_KEY and your DATABASE_URL / DATABASE_URL_SYNC

# 5. Create the database (if it doesn't exist yet)
createdb clicks21          # or use psql / pgAdmin

# 6. Create the tables — pick ONE of the following:

# Option A: quick dev setup
python scripts/init_db.py

# Option B: tracked migrations (recommended once you start changing the schema)
alembic upgrade head
```

> If `AUTO_CREATE_TABLES=true` in `.env`, the app will also create any
> missing tables automatically on startup — handy for the first run, but
> Option A/B above is more explicit and demo-friendly.

## 4. Running the server

```bash
python run.py
# or
uvicorn app.main:app --reload
```

The API is live at `http://localhost:8000`. Interactive Swagger docs are at
`http://localhost:8000/docs` (ReDoc at `/redoc`) — use these to try every
endpoint by hand during a demo or viva.

## 5. Story memory design (for the viva)

- **Story memory** lives entirely in PostgreSQL: `story_sessions` tracks
  state, `story_options` logs every option ever generated (storylines
  included, at `step_number=0`), `story_choices` logs what the user actually
  picked, `final_stories` holds the finished narrative.
- **Rolling summary**: instead of replaying all 21 choices on every prompt,
  every 3 decisions the engine asks Groq for a fresh 100-150 word summary
  (`story_summary` on the session) that folds in the previous summary plus
  the latest 3 choices. Every future prompt sends `theme + category +
  original_prompt + storyline + story_summary + last 3 choices` instead of
  the full history — bounded token usage no matter how long the story gets.
- **Anti-repetition**: `app/services/repetition.py` pulls every option and
  choice ever seen in a session and checks new batches against them (exact
  match after normalization, plus fuzzy similarity via `difflib`). If a
  duplicate slips through, `story_engine.py` regenerates (up to 3 attempts)
  before giving up with a clear error.
- **No training, no fine-tuning**: every "intelligence" the app shows comes
  from prompt engineering in `app/prompts/templates.py` plus the state
  described above — this is the entire point of the academic constraint.

## 6. API reference

### `GET /health`
```json
{ "status": "ok", "app": "21 Clicks Backend", "version": "1.0.0" }
```

### `POST /story/start`
Request:
```json
{
  "theme": "Adventure",
  "category": "Time Travel Tales",
  "original_prompt": "A scientist discovers a hidden portal beneath an abandoned temple."
}
```
Response:
```json
{
  "session_id": "b3f1c2a0-1234-4abc-9def-0987654321ab",
  "theme": "Adventure",
  "category": "Time Travel Tales",
  "storylines": [
    "Storyline 1 text...",
    "Storyline 2 text...",
    "Storyline 3 text..."
  ]
}
```

### `POST /story/select-storyline`
Request:
```json
{
  "session_id": "b3f1c2a0-1234-4abc-9def-0987654321ab",
  "selected_storyline": "Storyline 1 text..."
}
```
Response:
```json
{
  "session_id": "b3f1c2a0-1234-4abc-9def-0987654321ab",
  "current_step": 0,
  "options": ["Option 1...", "Option 2...", "Option 3...", "Option 4..."]
}
```

### `POST /story/select-option`
Request:
```json
{
  "session_id": "b3f1c2a0-1234-4abc-9def-0987654321ab",
  "selected_option": "Option 1..."
}
```
Response while the story continues (`current_step` < 21):
```json
{
  "session_id": "b3f1c2a0-1234-4abc-9def-0987654321ab",
  "current_step": 1,
  "status": "in_progress",
  "is_complete": false,
  "options": ["Next option 1...", "Next option 2...", "Next option 3...", "Next option 4..."],
  "final_story": null
}
```
Response after the 21st decision:
```json
{
  "session_id": "b3f1c2a0-1234-4abc-9def-0987654321ab",
  "current_step": 21,
  "status": "completed",
  "is_complete": true,
  "options": null,
  "final_story": "Title\n\nFull story text..."
}
```

### `GET /story/session/{session_id}`
Returns full session state: theme, category, prompt, storyline, current
step, status, rolling summary, and the complete choice history.

### `GET /story/final-story/{session_id}`
Returns the completed final story. Returns `409` if the session hasn't
reached 21 decisions yet.

## 7. Error handling

All errors return a consistent JSON shape:
```json
{ "error": "SessionNotFoundError", "detail": "No story session found with id ..." }
```

| Exception | HTTP status | When |
|---|---|---|
| `SessionNotFoundError` | 404 | Unknown `session_id` |
| `InvalidSelectionError` | 400 | Submitted text doesn't match any offered option/storyline |
| `InvalidStepError` | 409 | Step taken out of order (e.g. selecting an option before a storyline) |
| `MaxStepsReachedError` | 409 | Trying to keep playing after the 21st decision |
| `GroqServiceError` | 502 | Groq API failed or returned unparsable output after retries |
| `DuplicateOptionsError` | 502 | Couldn't generate 4 unique options after retries |

## 8. What's intentionally NOT used

Per the project constraints, this backend does not use Redis, Celery,
Kafka, a vector database, model fine-tuning, or custom model training.
"Memory" is plain PostgreSQL rows plus prompt engineering — simple enough
to fully explain in a viva, and easy enough to extend afterward.
