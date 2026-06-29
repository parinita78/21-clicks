import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Copy, Download, RotateCcw, Share2, Check } from "lucide-react";
import { useState } from "react";
import { useStory } from "../context/StoryContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { copyToClipboard, downloadTextFile } from "../utils/helpers.js";
import FinalStoryView from "../components/story/FinalStoryView.jsx";
import Button from "../components/common/Button.jsx";

export default function FinalStoryPage() {
  const { state, reset } = useStory();
  const navigate = useNavigate();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const { finalStory, theme, category } = state;

  if (!finalStory) {
    navigate("/themes");
    return null;
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(finalStory);
    if (ok) {
      setCopied(true);
      toast("Story copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast("Failed to copy. Please copy the text manually.", "error");
    }
  };

  const handleDownload = () => {
    const titleLine = finalStory.split("\n")[0] || "my-story";
    const filename = titleLine.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + ".txt";
    downloadTextFile(finalStory, filename);
    toast("Story downloaded!", "success");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: finalStory.split("\n")[0] || "My 21 Clicks Story",
          text: "I just completed my 21-decision story on 21 Clicks. Every choice I made built this:",
          url: window.location.href,
        });
      } catch {
        // User cancelled — not an error
      }
    } else {
      handleCopy();
    }
  };

  const handleNewStory = () => {
    reset();
    navigate("/themes");
  };

  return (
    <main className="min-h-screen px-6 py-16">
      {/* Completion banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{
            background: "rgba(184,106,77,0.12)",
            border: "1px solid rgba(184,106,77,0.4)",
          }}
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--color-accent)" }}
          >
            ✦ Your Story is Complete ✦
          </span>
        </motion.div>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          21 decisions. One story. Entirely yours.
        </p>
      </motion.div>

      {/* Story */}
      <div className="max-w-2xl mx-auto mb-16">
        <FinalStoryView storyContent={finalStory} theme={theme} category={category} />
      </div>

      {/* Action bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="sticky bottom-6 px-6"
      >
        <div
          className="max-w-lg mx-auto glass-panel rounded-2xl p-4 flex flex-wrap gap-3 justify-center"
          style={{ border: "1px solid rgba(184,106,77,0.25)" }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            icon={copied ? Check : Copy}
            className={copied ? "border-green-500 text-green-400" : ""}
          >
            {copied ? "Copied!" : "Copy Story"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            icon={Download}
          >
            Download
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            icon={Share2}
          >
            Share
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleNewStory}
            icon={RotateCcw}
            className="glow-accent"
          >
            New Story
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
