import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { useStory } from "../context/StoryContext.jsx";
import Button from "../components/common/Button.jsx";

const STORAGE_KEYS_LIST = ["clicks21_session_id", "clicks21_theme", "clicks21_category", "clicks21_current_step", "clicks21_storyline"];

export default function LandingPage() {
  const navigate = useNavigate();
  const { reset } = useStory();

  const handleBegin = () => {
    reset();
    STORAGE_KEYS_LIST.forEach((k) => localStorage.removeItem(k));
    navigate("/themes");
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20"
      aria-label="21 Clicks landing page"
    >
      {/* Ambient glow behind hero */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(184,106,77,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
        style={{
          background: "rgba(184,106,77,0.1)",
          border: "1px solid rgba(184,106,77,0.3)",
        }}
      >
        <Sparkles size={12} style={{ color: "var(--color-accent)" }} />
        <span
          className="text-xs uppercase tracking-widest font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          AI-Powered Interactive Storytelling
        </span>
      </motion.div>

      {/* Wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-6xl sm:text-7xl lg:text-[6.5rem] leading-none mb-4 text-gradient-copper"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
      >
        21 Clicks
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="text-xl sm:text-2xl lg:text-3xl mb-5 italic"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-text-secondary)" }}
      >
        Every Choice Creates a Different Story
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-md text-sm sm:text-base leading-relaxed mb-10"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Navigate 21 decisions. Watch an AI weave your choices into a unique, 
        personalised story — one that no one else will ever read.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <Button
          onClick={handleBegin}
          size="xl"
          variant="primary"
          icon={ChevronRight}
          className="glow-accent font-display tracking-wider"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
        >
          Begin Adventure
        </Button>
      </motion.div>

      {/* Floating scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 2.5, delay: 2, repeat: Infinity }}
        className="absolute bottom-10 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-accent), transparent)",
          }}
        />
        <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(184,106,77,0.5)" }}>
          Scroll
        </span>
      </motion.div>
    </main>
  );
}
