export type SubjectMode = "quiz" | "flashcards" | "lesson" | "problems" | "essay" | "coding";

export interface Subject {
  id: string;
  name: string;
  emoji: string;
  color: string;
  icon?: string;
  iconColor?: string;
  topics: Topic[];
  modes?: SubjectMode[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    emoji: "📐",
    color: "from-blue-600 to-blue-400",
    icon: "calculate",
    iconColor: "#3B82F6",
    modes: ["problems"],
    topics: [
      { id: "algebra", name: "Algebra", description: "Linear equations, quadratic equations, factoring, inequalities, and systems of equations — with concrete numerical examples" },
      { id: "geometry", name: "Geometry", description: "Area, perimeter, volume, Pythagorean theorem, angles in triangles, circles, and properties of common shapes" },
      { id: "trigonometry", name: "Trigonometry", description: "SOH-CAH-TOA, sine/cosine/tangent in right triangles, unit circle values (30°, 45°, 60°, 90°), and basic identities" },
      { id: "calculus", name: "Calculus", description: "Limits, derivatives using power/chain/product rules, basic integrals, and finding area under a curve — with worked examples" },
      { id: "statistics", name: "Statistics & Probability", description: "Mean, median, mode, variance, basic probability rules, combinations (nCr), permutations (nPr), and simple distributions" },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    emoji: "⚛️",
    color: "from-purple-600 to-purple-400",
    icon: "science",
    iconColor: "#8B5CF6",
    modes: ["problems"],
    topics: [
      { id: "mechanics", name: "Mechanics", description: "Forces, motion, energy" },
      { id: "electricity", name: "Electricity", description: "Charge, current, resistance" },
      { id: "optics", name: "Optics", description: "Light, lenses, mirrors" },
      { id: "thermodynamics", name: "Thermodynamics", description: "Heat, gases, entropy" },
      { id: "atomic-physics", name: "Atomic Physics", description: "Atom, nucleus, radioactivity" },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    emoji: "🧪",
    color: "from-green-600 to-green-400",
    icon: "biotech",
    iconColor: "#10B981",
    modes: ["quiz", "flashcards", "lesson", "problems"],
    topics: [
      { id: "fundamentals", name: "Fundamentals", description: "Atoms, molecules, elements" },
      { id: "organic", name: "Organic Chemistry", description: "Hydrocarbons, functional groups" },
      { id: "inorganic", name: "Inorganic Chemistry", description: "Metals, oxides, acids, bases" },
      { id: "stoichiometry", name: "Stoichiometry", description: "Moles, reactions, yields" },
      { id: "electrochemistry", name: "Electrochemistry", description: "Electrolysis, galvanic cells" },
    ],
  },
  {
    id: "history",
    name: "History",
    emoji: "📜",
    color: "from-amber-600 to-amber-400",
    icon: "history_edu",
    iconColor: "#F59E0B",
    topics: [
      { id: "ancient", name: "Ancient History", description: "Antiquity, Rome, Greece, Egypt" },
      { id: "medieval", name: "Medieval History", description: "Feudalism, crusades, Byzantium" },
      { id: "modern", name: "Modern History", description: "Revolutions, colonization, Enlightenment" },
      { id: "world-war-2", name: "World War II", description: "Causes, events, consequences" },
      { id: "20th-century", name: "20th Century", description: "Cold War, decolonization, globalization" },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    emoji: "🧬",
    color: "from-emerald-600 to-emerald-400",
    icon: "genetics",
    iconColor: "#059669",
    modes: ["quiz", "flashcards", "lesson", "problems"],
    topics: [
      { id: "cell", name: "Cell Biology", description: "Structure, organelles, division" },
      { id: "genetics", name: "Genetics", description: "DNA, genes, inheritance" },
      { id: "evolution", name: "Evolution", description: "Darwin, natural selection" },
      { id: "ecology", name: "Ecology", description: "Ecosystems, food chains" },
      { id: "anatomy", name: "Human Anatomy", description: "Organs, organ systems" },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    emoji: "🌍",
    color: "from-cyan-600 to-cyan-400",
    icon: "public",
    iconColor: "#06B6D4",
    topics: [
      { id: "physical", name: "Physical Geography", description: "Relief, climate, water" },
      { id: "europe", name: "Europe", description: "Countries, relief, population" },
      { id: "world", name: "World Geography", description: "Continents, oceans, climate zones" },
      { id: "human", name: "Human Geography", description: "Population, economy, urbanization" },
    ],
  },
  {
    id: "english",
    name: "English",
    emoji: "🇬🇧",
    color: "from-indigo-600 to-indigo-400",
    icon: "menu_book",
    iconColor: "#6366F1",
    modes: ["quiz", "flashcards", "lesson", "essay"],
    topics: [
      { id: "grammar", name: "Grammar", description: "Tenses, conditionals, modal verbs" },
      { id: "vocabulary", name: "Vocabulary", description: "Word building, idioms, phrasal verbs" },
      { id: "reading", name: "Reading", description: "Comprehension, text types" },
      { id: "writing", name: "Writing", description: "Essays, letters, reports" },
    ],
  },
  {
    id: "computer-science",
    name: "Computer Science",
    emoji: "💻",
    color: "from-slate-600 to-slate-400",
    icon: "computer",
    iconColor: "#F97316",
    modes: ["quiz", "flashcards", "lesson", "coding"],
    topics: [
      { id: "programming", name: "Programming", description: "Algorithms, Python, C++" },
      { id: "databases", name: "Databases", description: "SQL, relational model" },
      { id: "networking", name: "Networking", description: "Internet, protocols, security" },
      { id: "os", name: "Operating Systems", description: "Processes, file system, memory" },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getTopic(subjectId: string, topicId: string): Topic | undefined {
  return getSubject(subjectId)?.topics.find((t) => t.id === topicId);
}
