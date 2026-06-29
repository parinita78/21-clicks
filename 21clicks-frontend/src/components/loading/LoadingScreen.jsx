import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Forging your next chapter…",
  "Exploring alternate destinies…",
  "Weaving the threads of fate…",
  "Ancient stories are awakening…",
  "Building your adventure…",
  "Consulting the oracle…",
  "Charting unknown paths…",
  "The story breathes and stirs…",
];

/**
 * Full-screen immersive loading overlay.
 * Cycles through ambient story messages every ~2.2 seconds.
 * Never a spinner — always atmosphere.
 */
export default function LoadingScreen({ isLoading = false, message = null }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          role="status"
          aria-label="Loading story content"
          style={{ background: "rgba(11,11,15,0.88)", backdropFilter: "blur(12px)" }}
        >
          {/* Ambient glow ring */}
          <div className="relative mb-10">
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(184,106,77,0.35) 0%, transparent 70%)",
                width: 160,
                height: 160,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
            {/* Orbiting dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 relative"
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full opacity-40"
                style={{ background: "var(--color-accent-hover)" }}
              />
            </motion.div>
          </div>

          {/* Cycling message */}
          <div className="h-8 overflow-hidden text-center px-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={message || msgIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45 }}
                className="text-lg"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--color-text-secondary)",
                  fontStyle: "italic",
                }}
              >
                {message || MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
