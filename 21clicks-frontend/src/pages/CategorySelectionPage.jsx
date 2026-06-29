import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "../config/story.js";
import { useStory, ACTIONS } from "../context/StoryContext.jsx";
import CategoryCard from "../components/cards/CategoryCard.jsx";
import Button from "../components/common/Button.jsx";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function CategorySelectionPage() {
  const { state, dispatch } = useStory();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const theme = state.theme;
  if (!theme) {
    navigate("/themes");
    return null;
  }

  const categories = CATEGORIES[theme.id] || [];

  const handleContinue = () => {
    if (!selected) return;
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: selected });
    navigate("/prompt");
  };

  return (
    <main className="min-h-screen px-6 py-16 flex flex-col items-center">
      {/* Back + breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 mb-10 self-start max-w-5xl w-full"
      >
        <button
          onClick={() => navigate("/themes")}
          className="flex items-center gap-1 text-sm transition-colors hover:text-[var(--color-text-primary)]"
          style={{ color: "var(--color-text-secondary)" }}
          aria-label="Back to theme selection"
        >
          <ChevronLeft size={14} />
          Back
        </button>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span
          className="text-sm px-3 py-1 rounded-full"
          style={{
            background: "rgba(184,106,77,0.12)",
            border: "1px solid rgba(184,106,77,0.3)",
            color: "var(--color-accent)",
          }}
        >
          {theme.label}
        </span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--color-accent)" }}>
          Step 2 of 4
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          Choose Your Category
        </h1>
        <p className="text-sm max-w-md" style={{ color: "var(--color-text-secondary)" }}>
          Narrow your story world. Every category opens different doors.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mb-10"
        role="list"
        aria-label="Category options"
      >
        {categories.map((cat) => (
          <motion.div key={cat.id} variants={itemVariants} role="listitem">
            <CategoryCard
              category={cat}
              selected={selected?.id === cat.id}
              onSelect={setSelected}
            />
          </motion.div>
        ))}
      </motion.div>

      <Button
        onClick={handleContinue}
        disabled={!selected}
        size="lg"
        icon={ChevronRight}
        className={selected ? "glow-accent" : ""}
      >
        {selected ? `Continue with "${selected.label}"` : "Select a Category to Continue"}
      </Button>
    </main>
  );
}
