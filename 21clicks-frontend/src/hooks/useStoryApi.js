import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { storyApi } from "../services/storyApi.js";
import { useStory, ACTIONS } from "../context/StoryContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

/** Generic async-operation hook. Returns { loading, error, run }. */
export function useAsync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, run };
}

/** Start a new story session. */
export function useStartStory() {
  const { state, dispatch } = useStory();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error, run } = useAsync();

  const startStory = useCallback(
    async (prompt) => {
      const data = await run(() =>
        storyApi.start(state.theme.label, state.category.label, prompt)
      );
      dispatch({ type: ACTIONS.SET_PROMPT, payload: prompt });
      dispatch({ type: ACTIONS.SET_SESSION, payload: { sessionId: data.session_id } });
      navigate("/storylines", { state: { storylines: data.storylines } });
    },
    [run, state.theme, state.category, dispatch, navigate]
  );

  const handleError = useCallback(
    (err) => toast(err || "Failed to generate storylines. Please try again.", "error"),
    [toast]
  );

  return { startStory, loading, error, handleError };
}

/** Select a storyline and get first 4 options. */
export function useSelectStoryline() {
  const { state, dispatch } = useStory();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error, run } = useAsync();

  const selectStoryline = useCallback(
    async (storyline) => {
      const data = await run(() =>
        storyApi.selectStoryline(state.sessionId, storyline)
      );
      dispatch({
        type: ACTIONS.SET_STORYLINE,
        payload: { storyline, options: data.options },
      });
      navigate("/journey");
    },
    [run, state.sessionId, dispatch, navigate]
  );

  const handleError = useCallback(
    (err) => toast(err || "Failed to start story. Please try again.", "error"),
    [toast]
  );

  return { selectStoryline, loading, error, handleError };
}

/** Record a choice, get next options or trigger final story. */
export function useSelectOption() {
  const { state, dispatch } = useStory();
  const toast = useToast();
  const navigate = useNavigate();
  const { loading, error, run } = useAsync();

  const selectOption = useCallback(
    async (option) => {
      const data = await run(() =>
        storyApi.selectOption(state.sessionId, option)
      );

      if (data.is_complete && data.final_story) {
        dispatch({ type: ACTIONS.COMPLETE_STORY, payload: data.final_story });
        navigate("/final-story");
      } else {
        dispatch({
          type: ACTIONS.RECORD_CHOICE,
          payload: {
            step: data.current_step,
            choice: option,
            options: data.options,
          },
        });
        if (data.story_summary) {
          dispatch({ type: ACTIONS.SET_SUMMARY, payload: data.story_summary });
        }
      }
      return data;
    },
    [run, state.sessionId, dispatch, navigate]
  );

  const handleError = useCallback(
    (err) => toast(err || "Failed to record choice. Please try again.", "error"),
    [toast]
  );

  return { selectOption, loading, error, handleError };
}

/** Fetch full session for rehydration. */
export function useSessionRehydration() {
  const { state, dispatch } = useStory();
  const { loading, run } = useAsync();

  const rehydrate = useCallback(async () => {
    if (!state.sessionId || state.storyOptions.length > 0) return;
    try {
      const data = await run(() => storyApi.getSession(state.sessionId));
      if (data.choices) {
        dispatch({
          type: ACTIONS.REHYDRATE,
          payload: {
            choiceHistory: data.choices.map((c) => ({
              step: c.step_number,
              choice: c.selected_choice,
            })),
            storySummary: data.story_summary,
            status: data.status,
          },
        });
      }
    } catch {
      // Silent rehydration failure — user can continue normally or start over.
    }
  }, [state.sessionId, state.storyOptions.length, run, dispatch]);

  return { rehydrate, loading };
}
