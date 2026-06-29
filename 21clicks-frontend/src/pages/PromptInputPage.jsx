import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Wand2, Lightbulb } from "lucide-react";
import { useStory } from "../context/StoryContext.jsx";
import { useStartStory } from "../hooks/useStoryApi.js";
import { useToast } from "../context/ToastContext.jsx";
import { EXAMPLE_PROMPTS } from "../config/story.js";
import Button from "../components/common/Button.jsx";
import LoadingScreen from "../components/loading/LoadingScreen.jsx";

const MIN_CHARS = 20;
const MAX_CHARS = 500;

export default function PromptInputPage() {
  const { state } = useStory();
  const navigate = useNavigate();
  const toast = useToast();
  const { startStory, loading } = useStartStory();
  const [prompt, setPrompt] = useState("");

  const { theme, category } = state;
  if (!theme || !category) {
    navigate("/themes");
    return null;
  }

  const examplePrompts = EXAMPLE_PROMPTS[theme.id] || [];
  const charCount = prompt.length;
  const isReady = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleSubmit = async () => {
    if (!isReady) return;
    try {
      await startStory(prompt);
    } catch (err) {
      toast(err.message || "Failed to generate storylines. Please try again.", "error");
    }
  };

  return (
    <>
      <LoadingScreen isLoading={loading} />

      <main className="min-h-screen px-6 py-16 flex flex-col items-center">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 mb-10 self-start max-w-3xl w-full"
        >
          <button
            onClick={() => navigate("/categories")}
            className="flex items-center gap-1 text-sm hover:text-[var(--color-text-primary)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span className="text-sm px-3 py-1 rounded-full" style={{ background: "rgba(184,106,77,0.1)", border: "1px solid rgba(184,106,77,0.3)", color: "var(--color-accent)" }}>
            {theme.label}
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{category.label}</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
            Step 3 of 4
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Begin Your Story
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "var(--color-text-secondary)" }}>
            Describe the opening scene. An inciting moment, a mysterious character, a place that shouldn't exist.
            The AI takes it from there.
          </p>
        </motion.div>

        <div className="w-full max-w-2xl">
          {/* Example prompts */}
          {examplePrompts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} style={{ color: "var(--color-accent)" }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  Spark ideas
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="text-xs px-3 py-1.5 rounded-full text-left transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {ex.length > 55 ? ex.slice(0, 55) + "…" : ex}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Textarea */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, MAX_CHARS))}
              placeholder="A scientist discovers a hidden portal beneath an abandoned temple deep in the jungle. The air smells of something ancient and electric…"
              rows={7}
              aria-label="Story opening prompt"
              className="w-full resize-none rounded-[var(--radius-card)] p-5 pb-10 text-base leading-relaxed transition-all focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${isReady ? "rgba(184,106,77,0.5)" : "rgba(255,255,255,0.1)"}`,
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                backdropFilter: "blur(12px)",
                boxShadow: isReady ? "0 0 20px rgba(184,106,77,0.15)" : "none",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            />

            {/* Character counter */}
            <div className="absolute bottom-3 right-4 flex items-center gap-2">
              <AnimatePresence>
                {charCount < MIN_CHARS && charCount > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {MIN_CHARS - charCount} more characters needed
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                className="text-xs tabular-nums"
                style={{ color: charCount > MAX_CHARS * 0.9 ? "var(--color-accent)" : "var(--color-text-secondary)" }}
              >
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 flex justify-end"
          >
            <Button
              onClick={handleSubmit}
              disabled={!isReady || loading}
              loading={loading}
              size="lg"
              icon={Wand2}
              className={isReady ? "glow-accent" : ""}
            >
              Generate Storylines
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
