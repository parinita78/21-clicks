import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-8xl mb-4"
          style={{ fontFamily: "var(--font-fantasy)", color: "rgba(184,106,77,0.3)" }}
        >
          404
        </p>
        <h1
          className="text-3xl mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          This Path Doesn't Exist
        </h1>
        <p className="mb-8 max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
          The story you're looking for has wandered into the unknown.
        </p>
        <Button onClick={() => navigate("/")} icon={Home} size="lg">
          Return Home
        </Button>
      </motion.div>
    </main>
  );
}
