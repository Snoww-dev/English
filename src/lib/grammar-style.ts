import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  ClockIcon,
  GitBranchIcon,
  HashIcon,
  LayersIcon,
  Link2Icon,
  LibraryIcon,
  MapPinIcon,
  MessageSquareIcon,
  PaletteIcon,
  RepeatIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";

// Every class string below must stay a literal (no template interpolation of
// the color name) so Tailwind's static source scanner can find and generate it.
export type CategoryStyle = {
  label: string;
  icon: LucideIcon;
  badge: string;
  dot: string;
  text: string;
  border: string;
  soft: string;
  ring: string;
};

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  label: "Ngữ pháp",
  icon: SparklesIcon,
  badge:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700/60 dark:bg-slate-500/10 dark:text-slate-300",
  dot: "bg-slate-500",
  text: "text-slate-600 dark:text-slate-400",
  border: "border-slate-400 dark:border-slate-500",
  soft: "bg-slate-50 dark:bg-slate-500/10",
  ring: "hover:border-slate-300 dark:hover:border-slate-700",
};

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  noun: {
    label: "Danh từ",
    icon: BookOpenIcon,
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/60 dark:bg-blue-500/10 dark:text-blue-300",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-400 dark:border-blue-500",
    soft: "bg-blue-50 dark:bg-blue-500/10",
    ring: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  tense: {
    label: "Thì động từ",
    icon: ClockIcon,
    badge:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-400 dark:border-rose-500",
    soft: "bg-rose-50 dark:bg-rose-500/10",
    ring: "hover:border-rose-300 dark:hover:border-rose-700",
  },
  article: {
    label: "Mạo từ",
    icon: TagIcon,
    badge:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/60 dark:bg-purple-500/10 dark:text-purple-300",
    dot: "bg-purple-500",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-400 dark:border-purple-500",
    soft: "bg-purple-50 dark:bg-purple-500/10",
    ring: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  preposition: {
    label: "Giới từ",
    icon: MapPinIcon,
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-500/10 dark:text-sky-300",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-400 dark:border-sky-500",
    soft: "bg-sky-50 dark:bg-sky-500/10",
    ring: "hover:border-sky-300 dark:hover:border-sky-700",
  },
  adjective: {
    label: "Tính từ - Trạng từ",
    icon: PaletteIcon,
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-400 dark:border-amber-500",
    soft: "bg-amber-50 dark:bg-amber-500/10",
    ring: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  quantifier: {
    label: "Từ định lượng",
    icon: HashIcon,
    badge:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800/60 dark:bg-yellow-500/10 dark:text-yellow-300",
    dot: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-400 dark:border-yellow-500",
    soft: "bg-yellow-50 dark:bg-yellow-500/10",
    ring: "hover:border-yellow-300 dark:hover:border-yellow-700",
  },
  pronoun: {
    label: "Đại từ",
    icon: UserIcon,
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-400 dark:border-emerald-500",
    soft: "bg-emerald-50 dark:bg-emerald-500/10",
    ring: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  "verb-type": {
    label: "Loại động từ",
    icon: LayersIcon,
    badge:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800/60 dark:bg-cyan-500/10 dark:text-cyan-300",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-400 dark:border-cyan-500",
    soft: "bg-cyan-50 dark:bg-cyan-500/10",
    ring: "hover:border-cyan-300 dark:hover:border-cyan-700",
  },
  modal: {
    label: "Động từ khiếm khuyết",
    icon: ShieldCheckIcon,
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-500/10 dark:text-orange-300",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-400 dark:border-orange-500",
    soft: "bg-orange-50 dark:bg-orange-500/10",
    ring: "hover:border-orange-300 dark:hover:border-orange-700",
  },
  conditional: {
    label: "Câu điều kiện",
    icon: GitBranchIcon,
    badge:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-500/10 dark:text-indigo-300",
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-400 dark:border-indigo-500",
    soft: "bg-indigo-50 dark:bg-indigo-500/10",
    ring: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
  voice: {
    label: "Thể bị động",
    icon: ArrowLeftRightIcon,
    badge:
      "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800/60 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-400 dark:border-fuchsia-500",
    soft: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
    ring: "hover:border-fuchsia-300 dark:hover:border-fuchsia-700",
  },
  speech: {
    label: "Câu tường thuật",
    icon: MessageSquareIcon,
    badge:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800/60 dark:bg-pink-500/10 dark:text-pink-300",
    dot: "bg-pink-500",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-400 dark:border-pink-500",
    soft: "bg-pink-50 dark:bg-pink-500/10",
    ring: "hover:border-pink-300 dark:hover:border-pink-700",
  },
  clause: {
    label: "Mệnh đề quan hệ",
    icon: Link2Icon,
    badge:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800/60 dark:bg-teal-500/10 dark:text-teal-300",
    dot: "bg-teal-500",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-400 dark:border-teal-500",
    soft: "bg-teal-50 dark:bg-teal-500/10",
    ring: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  "verb-pattern": {
    label: "Cấu trúc động từ",
    icon: RepeatIcon,
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-500/10 dark:text-red-300",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-400 dark:border-red-500",
    soft: "bg-red-50 dark:bg-red-500/10",
    ring: "hover:border-red-300 dark:hover:border-red-700",
  },
  vocabulary: {
    label: "Từ vựng",
    icon: LibraryIcon,
    badge:
      "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-800/60 dark:bg-lime-500/10 dark:text-lime-300",
    dot: "bg-lime-500",
    text: "text-lime-600 dark:text-lime-400",
    border: "border-lime-400 dark:border-lime-500",
    soft: "bg-lime-50 dark:bg-lime-500/10",
    ring: "hover:border-lime-300 dark:hover:border-lime-700",
  },
  "advanced-structure": {
    label: "Cấu trúc nâng cao",
    icon: SparklesIcon,
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-500/10 dark:text-violet-300",
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-400 dark:border-violet-500",
    soft: "bg-violet-50 dark:bg-violet-500/10",
    ring: "hover:border-violet-300 dark:hover:border-violet-700",
  },
};

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;
}

// Fixed display order for category groups (word class first, then
// verb-related grammar, then sentence-level structures). Unknown categories
// sort after all of these.
export const CATEGORY_ORDER = [
  "noun",
  "pronoun",
  "adjective",
  "quantifier",
  "preposition",
  "article",
  "tense",
  "verb-type",
  "modal",
  "voice",
  "verb-pattern",
  "conditional",
  "speech",
  "clause",
  "vocabulary",
  "advanced-structure",
];

export type LevelStyle = { badge: string; dot: string };

const DEFAULT_LEVEL_STYLE: LevelStyle = {
  badge:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700/60 dark:bg-slate-500/10 dark:text-slate-300",
  dot: "bg-slate-500",
};

// Beginner -> advanced heat gradient, doubles as a difficulty cue.
export const LEVEL_STYLES: Record<string, LevelStyle> = {
  A1: {
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  A2: {
    badge:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800/60 dark:bg-green-500/10 dark:text-green-300",
    dot: "bg-green-500",
  },
  B1: {
    badge:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800/60 dark:bg-yellow-500/10 dark:text-yellow-300",
    dot: "bg-yellow-500",
  },
  B2: {
    badge:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/60 dark:bg-orange-500/10 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  C1: {
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-500/10 dark:text-red-300",
    dot: "bg-red-500",
  },
  C2: {
    badge:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-500/10 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function getLevelStyle(level: string): LevelStyle {
  return LEVEL_STYLES[level] ?? DEFAULT_LEVEL_STYLE;
}

// Strips Vietnamese diacritics so heading anchors stay short, ASCII, and stable.
export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type ContentHeading = { id: string; text: string; level: 2 | 3 };

// Single source of truth for heading ids: walks the raw markdown text once
// (pure function of `markdown`) so the TOC sidebar (server) and
// MarkdownContent (client) always agree on ids without either one mutating
// shared state while React renders — that impurity is what caused a
// hydration mismatch under Strict Mode's dev double-render.
export function parseHeadings(markdown: string): ContentHeading[] {
  const headings: ContentHeading[] = [];
  const seen = new Map<string, number>();
  for (const line of markdown.split("\n")) {
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length === 2 ? 2 : 3;
    const text = match[2].replace(/[*_`]/g, "");
    const base = slugifyHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;
    headings.push({ id, text, level });
  }
  return headings;
}

// Table of contents only lists top-level sections.
export function extractH2Headings(markdown: string): ContentHeading[] {
  return parseHeadings(markdown).filter((h) => h.level === 2);
}

// Text -> id lookup for MarkdownContent's h2/h3 renderers (a plain memoized
// read, never a mutation during render).
export function buildHeadingIdLookup(markdown: string): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const heading of parseHeadings(markdown)) {
    lookup.set(heading.text, heading.id);
  }
  return lookup;
}
