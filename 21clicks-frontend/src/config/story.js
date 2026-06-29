import { ASSETS } from "./assets.js";

export const THEMES = [
  {
    id: "adventure",
    label: "Adventure",
    description:
      "Journey into uncharted territories. Survival, exploration, and time itself await.",
    image: ASSETS.themes.adventure,
    icon: "Compass",
    accentAngle: "135deg",
  },
  {
    id: "cultural",
    label: "Cultural",
    description:
      "Ancient myths, folklore, and the timeless wisdom woven into heritage tales.",
    image: ASSETS.themes.cultural,
    icon: "Scroll",
    accentAngle: "145deg",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    description:
      "From spine-chilling horror to galaxies far away — pure storytelling pleasure.",
    image: ASSETS.themes.entertainment,
    icon: "Sparkles",
    accentAngle: "125deg",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    description:
      "Curiosity as a compass. Science, mystery, and facts transformed into adventure.",
    image: ASSETS.themes.knowledge,
    icon: "FlaskConical",
    accentAngle: "150deg",
  },
];

export const CATEGORIES = {
  adventure: [
    {
      id: "exploration",
      label: "Exploration",
      description: "Venture into unknown lands and uncover what lies beyond the horizon.",
      image: ASSETS.categories.exploration,
      icon: "Map",
    },
    {
      id: "survival",
      label: "Survival",
      description: "Your wits against the wild. Every decision keeps you alive — or doesn't.",
      image: ASSETS.categories.survival,
      icon: "Flame",
    },
    {
      id: "mystery-quest",
      label: "Mystery Quests",
      description: "Clues scattered across the unknown. Solve the mystery before it solves you.",
      image: ASSETS.categories.mysteryQuest,
      icon: "Search",
    },
    {
      id: "time-travel",
      label: "Time Travel Tales",
      description: "Past, present, future — time is yours to navigate and reshape.",
      image: ASSETS.categories.timeTravelTales,
      icon: "Clock",
    },
  ],
  cultural: [
    {
      id: "folklore",
      label: "Folklore",
      description: "Stories passed through generations, alive with creatures and ancient truths.",
      image: ASSETS.categories.folklore,
      icon: "BookOpen",
    },
    {
      id: "traditional",
      label: "Traditional",
      description: "Rituals, ceremonies, and customs that shaped civilisations across time.",
      image: ASSETS.categories.traditional,
      icon: "Landmark",
    },
    {
      id: "mythology",
      label: "Mythology",
      description: "Walk with gods, monsters, and heroes from the world's great mythologies.",
      image: ASSETS.categories.mythology,
      icon: "Crown",
    },
    {
      id: "heritage-tales",
      label: "Heritage Tales",
      description: "The stories that define who we are — culture, identity, and belonging.",
      image: ASSETS.categories.heritageTales,
      icon: "Home",
    },
  ],
  entertainment: [
    {
      id: "horror",
      label: "Horror",
      description: "Something is watching. Your choices determine whether you escape.",
      image: ASSETS.categories.horror,
      icon: "Moon",
    },
    {
      id: "sci-fi",
      label: "Sci-Fi",
      description: "Technology, space, and futures imagined at the edge of human knowledge.",
      image: ASSETS.categories.sciFi,
      icon: "Rocket",
    },
    {
      id: "thriller",
      label: "Thriller",
      description: "High stakes. No second chances. Every second counts.",
      image: ASSETS.categories.thriller,
      icon: "Zap",
    },
    {
      id: "fantasy",
      label: "Fantasy",
      description: "Magic, realms, and creatures born from imagination untethered.",
      image: ASSETS.categories.fantasy,
      icon: "Wand2",
    },
  ],
  knowledge: [
    {
      id: "mystery",
      label: "Mystery",
      description: "Questions that haunt the curious mind, wrapped in narrative tension.",
      image: ASSETS.categories.mystery,
      icon: "HelpCircle",
    },
    {
      id: "science",
      label: "Science",
      description: "The universe's stranger-than-fiction truths — turned into your story.",
      image: ASSETS.categories.science,
      icon: "Atom",
    },
    {
      id: "curiosities",
      label: "Curiosities",
      description: "The delightfully strange corners of the world, waiting to be explored.",
      image: ASSETS.categories.curiosities,
      icon: "Lightbulb",
    },
    {
      id: "facts-into-stories",
      label: "Facts Into Stories",
      description: "Real knowledge, extraordinary narrative. Truth as the ultimate adventure.",
      image: ASSETS.categories.factsIntoStories,
      icon: "Library",
    },
  ],
};

export const EXAMPLE_PROMPTS = {
  adventure: [
    "A cartographer discovers that the blank edges of ancient maps are not unmapped — they are deliberately hidden.",
    "A lone diver finds a submerged city that shouldn't exist, still lit from within.",
    "A scientist discovers a hidden portal beneath an abandoned temple deep in the Amazon.",
  ],
  cultural: [
    "An elder's final story carries a secret that the village has protected for five hundred years.",
    "A musician finds that the song their grandmother taught them opens a door between worlds.",
    "A traveller realises the festival they stumbled upon only happens once every century.",
  ],
  entertainment: [
    "The last lighthouse keeper receives a distress call from a ship that sank sixty years ago.",
    "A crew wakes from hypersleep to find their destination planet already inhabited — by themselves.",
    "A detective is hired to solve a murder where the only suspect is the victim.",
  ],
  knowledge: [
    "A physicist's equation predicts an event that shouldn't be possible — and then it happens.",
    "An archivist uncovers a pattern in history that suggests civilisations fall on a precise schedule.",
    "A botanist discovers a plant that grows only where humans have kept secrets buried.",
  ],
};

export const MILESTONES = [
  { step: 5, title: "Explorer", subtitle: "Path Discovered", icon: "Compass" },
  { step: 10, title: "Wayfarer", subtitle: "Halfway Through", icon: "Map" },
  { step: 15, title: "Sage", subtitle: "Path of Wisdom", icon: "Scroll" },
  { step: 20, title: "Master Storyteller", subtitle: "One Decision Remains", icon: "Crown" },
];
