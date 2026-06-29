import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useStory } from "../context/StoryContext.jsx";
import { useSelectStoryline } from "../hooks/useStoryApi.js";
import { useToast } from "../context/ToastContext.jsx";
import StorylineCard from "../components/cards/StorylineCard.jsx";
import LoadingScreen from "../components/loading/LoadingScreen.jsx";

export default function StorylineSelectionPage() {
  const { state } = useStory();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { selectStoryline, loading } = useSelectStoryline();

  const storylines = location.state?.storylines || [];
  const { theme, category } = state;

  if (!theme || !category || !storylines.length) {
    navigate("/themes");
    return null;
  }

  const handleSelect = async (storyline) => {
    try {
      await selectStoryline(storyline);
    } catch (err) {
      toast(err.message || "Failed to select storyline. Please try again.", "error");
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
          className="flex items-center gap-3 mb-10 self-start max-w-5xl w-full"
        >
          <button
            onClick={() => navigate("/prompt")}
            className="flex items-center gap-1 text-sm hover:text-[var(--color-text-primary)]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <ChevronLeft size={14} /> Back
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
            Step 4 of 4 — Choose Your Path
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            Three Paths Await
          </h1>
          <p className="text-sm max-w-lg" style={{ color: "var(--color-text-secondary)" }}>
            The AI has opened three doors. Walk through one — and your 21-decision journey begins.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {storylines.map((story, i) => (
            <StorylineCard
              key={i}
              storyline={story}
              index={i}
              onSelect={handleSelect}
              loading={loading}
            />
          ))}
        </div>
      </main>
    </>
  );
}
