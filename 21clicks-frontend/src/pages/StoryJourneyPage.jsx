import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { useStory } from "../context/StoryContext.jsx";
import { useSelectOption, useSessionRehydration } from "../hooks/useStoryApi.js";
import { useAchievements } from "../hooks/useAchievements.js";
import { useToast } from "../context/ToastContext.jsx";
import ChoiceCard from "../components/cards/ChoiceCard.jsx";
import ProgressJourney from "../components/journey/ProgressJourney.jsx";
import TimelineSidebar from "../components/journey/TimelineSidebar.jsx";
import SummaryModal from "../components/journey/SummaryModal.jsx";
import AchievementModal from "../components/journey/AchievementModal.jsx";
import LoadingScreen from "../components/loading/LoadingScreen.jsx";

export default function StoryJourneyPage() {
  const { state } = useStory();
  const navigate = useNavigate();
  const toast = useToast();
  const { selectOption, loading } = useSelectOption();
  const { rehydrate } = useSessionRehydration();
  const { achievement, dismissAchievement } = useAchievements(state.currentStep);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [lastChosenOption, setLastChosenOption] = useState(null);

  const { theme, category, selectedStoryline, storyOptions, choiceHistory, currentStep, storySummary, sessionId } = state;

  // Guard
  useEffect(() => {
    if (!sessionId) { navigate("/themes"); return; }
    if (state.status === "completed") { navigate("/final-story"); return; }
    // Re-fetch session options if we landed here via a refresh with no options
    if (storyOptions.length === 0) rehydrate();
  }, [sessionId, state.status]);

  const handleSelect = async (option) => {
    setLastChosenOption(option);
    try {
      await selectOption(option);
      setLastChosenOption(null);
    } catch (err) {
      toast(err.message || "Failed to record choice. Please try again.", "error");
      setLastChosenOption(null);
    }
  };

  // Decide which story snippet to show in the narrative panel
  const latestChoice = choiceHistory[choiceHistory.length - 1]?.choice;

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <SummaryModal
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        summary={storySummary}
        theme={theme}
        category={category}
      />
      <AchievementModal achievement={achievement} onClose={dismissAchievement} />

      <div className="min-h-screen flex flex-col">
        {/* ── Top bar ────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-30 px-6 py-4"
          style={{ background: "rgba(11,11,15,0.75)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-4">
            {/* Breadcrumb pills */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {theme && (
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(184,106,77,0.12)", border: "1px solid rgba(184,106,77,0.3)", color: "var(--color-accent)" }}>
                  {theme.label}
                </span>
              )}
              {category && (
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {category.label}
                </span>
              )}
            </div>

            {/* "Story So Far" button */}
            <button
              onClick={() => setSummaryOpen(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full glass-panel transition-all hover:border-[rgba(184,106,77,0.4)]"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label="Open story summary"
            >
              <ScrollText size={12} style={{ color: "var(--color-accent)" }} />
              Story So Far
            </button>
          </div>

          {/* Progress bar */}
          <div className="max-w-6xl mx-auto mt-4">
            <ProgressJourney currentStep={currentStep} />
          </div>
        </header>

        {/* ── Main layout ────────────────────────────────────────── */}
        <div className="flex flex-1 gap-6 max-w-6xl mx-auto w-full px-6 py-8">
          {/* Sidebar */}
          <TimelineSidebar choices={choiceHistory} />

          {/* Content column */}
          <main className="flex-1 flex flex-col gap-6 min-w-0">

            {/* Decision counter */}
            <motion.div
              key={`counter-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <span
                className="text-4xl sm:text-5xl leading-none"
                style={{ fontFamily: "var(--font-fantasy)", color: "var(--color-accent)" }}
              >
                {currentStep + 1}
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
                  Decision
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  of 21
                </p>
              </div>
            </motion.div>

            {/* Narrative panel — shows the last chosen option as story context */}
            <AnimatePresence mode="wait">
              {latestChoice && (
                <motion.div
                  key={`narrative-${currentStep}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="glass-panel rounded-[var(--radius-card)] p-5"
                  style={{ borderLeft: "3px solid rgba(184,106,77,0.5)" }}
                >
                  <p
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: "var(--color-accent)" }}
                  >
                    You chose
                  </p>
                  <p
                    className="text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-serif)", color: "var(--color-text-primary)", fontSize: "1rem" }}
                  >
                    {latestChoice}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Storyline reminder (step 0 only) */}
            {currentStep === 0 && selectedStoryline && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel rounded-[var(--radius-card)] p-5"
                style={{ borderLeft: "3px solid rgba(184,106,77,0.3)" }}
              >
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(184,106,77,0.6)" }}>
                  Your Story Begins
                </p>
                <p className="text-sm leading-relaxed italic" style={{ fontFamily: "var(--font-serif)", color: "var(--color-text-secondary)" }}>
                  {selectedStoryline}
                </p>
              </motion.div>
            )}

            {/* Choice prompt */}
            <motion.p
              key={`prompt-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              What happens next? Choose wisely.
            </motion.p>

            {/* Choice cards */}
            <AnimatePresence mode="wait">
              {storyOptions.length > 0 && !loading ? (
                <motion.div
                  key={`options-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  role="list"
                  aria-label="Story choices"
                >
                  {storyOptions.map((option, i) => (
                    <motion.div key={i} role="listitem">
                      <ChoiceCard
                        option={option}
                        index={i}
                        onSelect={handleSelect}
                        disabled={loading}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : !loading && storyOptions.length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: "var(--color-text-secondary)" }}>
                    Refreshing your choices…
                  </p>
                </div>
              ) : null}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}
