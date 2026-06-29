/**
 * Centralized asset configuration for 21 Clicks.
 *
 * Drop your files into the matching public/assets/ folder and they
 * will be picked up automatically — no code changes needed.
 *
 * All paths are relative to /public so Vite serves them as static assets.
 */

export const ASSETS = {
  backgroundVideo: "/assets/video/background.mp4",
  backgroundVideoPoster: "/assets/video/poster.jpg",

  logo: "/assets/logo.png",

  themes: {
    adventure: "/assets/themes/adventure.png",
    cultural: "/assets/themes/cultural.png",
    entertainment: "/assets/themes/entertainment.png",
    knowledge: "/assets/themes/knowledge.png",
  },

  categories: {
    // Adventure
    exploration: "/assets/categories/exploration.png",
    survival: "/assets/categories/survival.png",
    mysteryQuest: "/assets/categories/mysteryQuest.png",
    timeTravelTales: "/assets/categories/timeTravelTales.png",
    // Cultural
    folklore: "/assets/categories/folklore.png",
    traditional: "/assets/categories/traditional.png",
    mythology: "/assets/categories/mythology.png",
    heritageTales: "/assets/categories/heritageTales.png",
    // Entertainment
    horror: "/assets/categories/horror.png",
    sciFi: "/assets/categories/sciFi.png",
    thriller: "/assets/categories/thriller.png",
    fantasy: "/assets/categories/fantasy.png",
    // Knowledge
    mystery: "/assets/categories/mystery.png",
    science: "/assets/categories/science.png",
    curiosities: "/assets/categories/curiosities.png",
    factsIntoStories: "/assets/categories/factsIntoStories.png",
  },
};
