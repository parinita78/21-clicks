import { motion } from "framer-motion";
import { BookOpen, Clock, AlignLeft, Layers, Tag } from "lucide-react";
import { readingTime, wordCount } from "../../utils/helpers.js";

function StatPill({ icon: Icon, label }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
      style={{
        background: "rgba(184,106,77,0.1)",
        border: "1px solid rgba(184,106,77,0.25)",
        color: "var(--color-text-secondary)",
      }}
    >
      <Icon size={11} style={{ color: "var(--color-accent)" }} />
      {label}
    </div>
  );
}

export default function FinalStoryView({ storyContent, theme, category }) {
  // Split title from body on the first double newline
  const [titleLine, ...bodyLines] = storyContent.split("\n");
  const body = bodyLines.join("\n").trim();
  const mins = readingTime(body);
  const words = wordCount(body);

  // Paragraph-by-paragraph reveal on scroll
  const paragraphs = body.split(/\n\n+/).filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl text-center mb-6 leading-tight"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
      >
        {titleLine}
      </motion.h1>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-2 justify-center mb-8"
      >
        <StatPill icon={Clock} label={`${mins} min read`} />
        <StatPill icon={AlignLeft} label={`${words} words`} />
        {theme && <StatPill icon={Layers} label={theme.label} />}
        {category && <StatPill icon={Tag} label={category.label} />}
        <StatPill icon={BookOpen} label="21 Decisions" />
      </motion.div>

      {/* Copper rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="h-px mb-10 origin-left"
        style={{ background: "linear-gradient(to right, var(--color-accent), transparent)" }}
      />

      {/* Story body — each paragraph reveals as it enters the viewport */}
      <div className="space-y-5">
        {paragraphs.map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i < 3 ? i * 0.1 : 0 }}
            className="leading-8 text-base sm:text-lg"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-text-primary)",
              fontSize: "1.1rem",
            }}
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* End mark */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center mt-12 mb-4"
      >
        <span
          className="text-lg"
          style={{ fontFamily: "var(--font-fantasy)", color: "rgba(184,106,77,0.5)" }}
        >
          ✦ End of Story ✦
        </span>
      </motion.div>
    </motion.article>
  );
}
