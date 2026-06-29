import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../config/api.js";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Groq can take a moment — generous timeout
  headers: { "Content-Type": "application/json" },
});

// Response interceptor: unwrap data; surface error message cleanly.
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// Retry helper — wraps a promise factory with up to `retries` attempts.
const withRetry = async (fn, retries = 2, delayMs = 800) => {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise((r) => setTimeout(r, delayMs));
    return withRetry(fn, retries - 1, delayMs * 1.5);
  }
};

export const storyApi = {
  /** POST /story/start — begin a new session, get 3 storylines. */
  start: (theme, category, originalPrompt) =>
    withRetry(() =>
      api.post(ENDPOINTS.START, { theme, category, original_prompt: originalPrompt })
    ),

  /** POST /story/select-storyline — lock in a storyline, get first 4 options. */
  selectStoryline: (sessionId, selectedStoryline) =>
    withRetry(() =>
      api.post(ENDPOINTS.SELECT_STORYLINE, {
        session_id: sessionId,
        selected_storyline: selectedStoryline,
      })
    ),

  /** POST /story/select-option — record a choice, get next 4 options or final story. */
  selectOption: (sessionId, selectedOption) =>
    withRetry(() =>
      api.post(ENDPOINTS.SELECT_OPTION, {
        session_id: sessionId,
        selected_option: selectedOption,
      })
    ),

  /** GET /story/session/{id} — full session state for rehydration. */
  getSession: (sessionId) =>
    withRetry(() => api.get(ENDPOINTS.SESSION(sessionId))),

  /** GET /story/final-story/{id} — completed story. */
  getFinalStory: (sessionId) =>
    withRetry(() => api.get(ENDPOINTS.FINAL_STORY(sessionId))),

  /** GET /health */
  health: () => api.get(ENDPOINTS.HEALTH),
};
