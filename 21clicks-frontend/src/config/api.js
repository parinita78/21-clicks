export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const ENDPOINTS = {
  START: "/story/start",
  SELECT_STORYLINE: "/story/select-storyline",
  SELECT_OPTION: "/story/select-option",
  SESSION: (id) => `/story/session/${id}`,
  FINAL_STORY: (id) => `/story/final-story/${id}`,
  HEALTH: "/health",
};

export const STORAGE_KEYS = {
  SESSION_ID: "clicks21_session_id",
  THEME: "clicks21_theme",
  CATEGORY: "clicks21_category",
  CURRENT_STEP: "clicks21_current_step",
  STORYLINE: "clicks21_storyline",
};
