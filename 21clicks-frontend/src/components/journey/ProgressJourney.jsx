import { motion } from "framer-motion";
import { clamp } from "../../utils/helpers.js";
import { MILESTONES } from "../../config/story.js";

const TOTAL = 21;
const MILESTONE_STEPS = new Set(MILESTONES.map((m) => m.step));

/**
 * Custom SVG journey path — a glowing horizontal progress trail with
 * milestone dot indicators. Not a <progress> bar.
 */
export default function ProgressJourney({ currentStep }) {
  const progress = clamp(currentStep / TOTAL, 0, 1);

  return (
    <div className="w-full" aria-label={`Decision ${currentStep} of ${TOTAL}`} role="progressbar"
      aria-valuenow={currentStep} aria-valuemin={0} aria-valuemax={TOTAL}>

      {/* Counter */}
      <div className="flex items-baseline justify-between mb-3">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Journey
        </span>
        <span
          className="text-sm font-bold"
          style={{ fontFamily: "var(--font-fantasy)", color: "var(--color-accent)" }}
        >
          {currentStep} <span style={{ color: "var(--color-text-secondary)" }}>/ {TOTAL}</span>
        </span>
      </div>

      {/* SVG track */}
      <div className="relative h-8">
        <svg
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Background track */}
          <line
            x1="8" y1="12" x2="392" y2="12"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Filled progress line */}
          <motion.line
            x1="8" y1="12"
            x2="392" y2="12"
            stroke="url(#progressGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ pathLength: progress }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            strokeDasharray="1"
            strokeDashoffset="0"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B86A4D" />
              <stop offset="100%" stopColor="#D98A6A" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Milestone dots */}
          {MILESTONES.map((m) => {
            const x = 8 + ((m.step / TOTAL) * 384);
            const reached = currentStep >= m.step;
            return (
              <g key={m.step} filter={reached ? "url(#glow)" : undefined}>
                <circle
                  cx={x} cy="12" r="5"
                  fill={reached ? "#B86A4D" : "rgba(255,255,255,0.12)"}
                  stroke={reached ? "#D98A6A" : "rgba(255,255,255,0.15)"}
                  strokeWidth="1.5"
                />
                {reached && (
                  <motion.circle
                    cx={x} cy="12" r="8"
                    fill="none"
                    stroke="rgba(184,106,77,0.4)"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </g>
            );
          })}

          {/* Current step glowing dot */}
          {currentStep > 0 && currentStep < TOTAL && (
            <motion.circle
              cx={8 + ((currentStep / TOTAL) * 384)}
              cy="12"
              r="4"
              fill="#D98A6A"
              filter="url(#glow)"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>

        {/* Milestone labels below track */}
        <div className="absolute top-6 left-0 right-0 flex" aria-hidden="true">
          {MILESTONES.map((m) => {
            const pct = (m.step / TOTAL) * 100;
            const reached = currentStep >= m.step;
            return (
              <span
                key={m.step}
                className="absolute text-[9px] uppercase tracking-wider -translate-x-1/2 transition-colors duration-300"
                style={{
                  left: `${pct}%`,
                  color: reached ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
                }}
              >
                {m.step}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
