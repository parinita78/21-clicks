import { useState, useEffect, useRef } from "react";
import { MILESTONES } from "../config/story.js";

/**
 * Watches currentStep and fires a one-time achievement popup at each
 * milestone (5, 10, 15, 20). Uses a ref to track which milestones have
 * already been shown so it never fires twice for the same step.
 */
export function useAchievements(currentStep) {
  const [achievement, setAchievement] = useState(null);
  const shownRef = useRef(new Set());

  useEffect(() => {
    const milestone = MILESTONES.find((m) => m.step === currentStep);
    if (milestone && !shownRef.current.has(milestone.step)) {
      shownRef.current.add(milestone.step);
      setAchievement(milestone);
    }
  }, [currentStep]);

  const dismissAchievement = () => setAchievement(null);

  return { achievement, dismissAchievement };
}
