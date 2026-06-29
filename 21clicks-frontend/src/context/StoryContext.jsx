import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "../config/api.js";

// ── State shape ──────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  sessionId: null,
  theme: null,        // { id, label, ... }
  category: null,     // { id, label, ... }
  originalPrompt: "",
  selectedStoryline: null,
  currentStep: 0,
  storyOptions: [],   // current set of 4 choice options
  choiceHistory: [],  // [{ step, choice }, ...]
  storySummary: null,
  finalStory: null,
  status: "idle",     // idle | in_progress | completed
};

// ── Actions ───────────────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_THEME: "SET_THEME",
  SET_CATEGORY: "SET_CATEGORY",
  SET_PROMPT: "SET_PROMPT",
  SET_SESSION: "SET_SESSION",
  SET_STORYLINE: "SET_STORYLINE",
  SET_OPTIONS: "SET_OPTIONS",
  RECORD_CHOICE: "RECORD_CHOICE",
  SET_SUMMARY: "SET_SUMMARY",
  COMPLETE_STORY: "COMPLETE_STORY",
  REHYDRATE: "REHYDRATE",
  RESET: "RESET",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_THEME:
      return { ...state, theme: payload, category: null };
    case ACTIONS.SET_CATEGORY:
      return { ...state, category: payload };
    case ACTIONS.SET_PROMPT:
      return { ...state, originalPrompt: payload };
    case ACTIONS.SET_SESSION:
      return {
        ...state,
        sessionId: payload.sessionId,
        status: "in_progress",
      };
    case ACTIONS.SET_STORYLINE:
      return {
        ...state,
        selectedStoryline: payload.storyline,
        storyOptions: payload.options,
        currentStep: 0,
      };
    case ACTIONS.SET_OPTIONS:
      return { ...state, storyOptions: payload };
    case ACTIONS.RECORD_CHOICE:
      return {
        ...state,
        currentStep: payload.step,
        choiceHistory: [...state.choiceHistory, { step: payload.step, choice: payload.choice }],
        storyOptions: payload.options || [],
      };
    case ACTIONS.SET_SUMMARY:
      return { ...state, storySummary: payload };
    case ACTIONS.COMPLETE_STORY:
      return {
        ...state,
        status: "completed",
        finalStory: payload,
        storyOptions: [],
        currentStep: 21,
      };
    case ACTIONS.REHYDRATE:
      return { ...state, ...payload };
    case ACTIONS.RESET:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const StoryContext = createContext(null);

export function StoryProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Persist minimal state on every change
  useEffect(() => {
    if (state.sessionId) {
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, state.sessionId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(state.currentStep));
      if (state.theme) localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(state.theme));
      if (state.category) localStorage.setItem(STORAGE_KEYS.CATEGORY, JSON.stringify(state.category));
      if (state.selectedStoryline) localStorage.setItem(STORAGE_KEYS.STORYLINE, state.selectedStoryline);
    }
  }, [state.sessionId, state.currentStep, state.theme, state.category, state.selectedStoryline]);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) return;
    const step = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_STEP) || "0", 10);
    const rawTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const rawCat = localStorage.getItem(STORAGE_KEYS.CATEGORY);
    const storyline = localStorage.getItem(STORAGE_KEYS.STORYLINE);

    dispatch({
      type: ACTIONS.REHYDRATE,
      payload: {
        sessionId,
        currentStep: step,
        status: step === 21 ? "completed" : "in_progress",
        theme: rawTheme ? JSON.parse(rawTheme) : null,
        category: rawCat ? JSON.parse(rawCat) : null,
        selectedStoryline: storyline || null,
      },
    });
  }, []);

  const reset = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    dispatch({ type: ACTIONS.RESET });
  }, []);

  return (
    <StoryContext.Provider value={{ state, dispatch, reset }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within StoryProvider");
  return ctx;
}
