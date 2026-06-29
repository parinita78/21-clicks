import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { THEMES } from "../config/story.js";
import { useStory, ACTIONS } from "../context/StoryContext.jsx";
import ThemeCard from "../components/cards/ThemeCard.jsx";
import Button from "../components/common/Button.jsx";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ThemeSelectionPage() {
  const { dispatch } = useStory();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleSelect = (theme) => setSelected(theme);

  const handleContinue = () => {
    if (!selected) return;
    dispatch({ type: ACTIONS.SET_THEME, payload: selected });
    navigate("/categories");
  };

  return (
    <main className="min-h-screen px-6 py-16 flex flex-col items-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-center mb-12"
      >
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: "var(--color-accent)" }}
        >
          Step 1 of 4
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          Choose Your Theme
        </h1>
        <p className="text-sm sm:text-base max-w-md" style={{ color: "var(--color-text-secondary)" }}>
          The world your story inhabits. Pick the realm that calls to you.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mb-10"
        role="list"
        aria-label="Theme options"
      >
        {THEMES.map((theme) => (
          <motion.div key={theme.id} variants={itemVariants} role="listitem">
            <ThemeCard
              theme={theme}
              selected={selected?.id === theme.id}
              onSelect={handleSelect}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handleContinue}
          disabled={!selected}
          size="lg"
          icon={ChevronRight}
          className={selected ? "glow-accent" : ""}
        >
          {selected ? `Continue with ${selected.label}` : "Select a Theme to Continue"}
        </Button>
      </motion.div>
    </main>
  );
}
