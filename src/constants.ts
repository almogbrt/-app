import type { MemberColor, TaskCategory } from "./types";

export const MEMBER_COLORS: MemberColor[] = [
  "rose",
  "amber",
  "emerald",
  "sky",
  "violet",
  "orange",
];

export const COLOR_CLASSES: Record<
  MemberColor,
  { bg: string; text: string; ring: string; dot: string; chip: string }
> = {
  rose: {
    bg: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-400",
    dot: "bg-rose-500",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-400",
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  sky: {
    bg: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-400",
    dot: "bg-sky-500",
    chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  violet: {
    bg: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-400",
    dot: "bg-violet-500",
    chip: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    ring: "ring-orange-400",
    dot: "bg-orange-500",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
};

export const TASK_CATEGORIES: TaskCategory[] = [
  "ניקיון",
  "כביסה",
  "מטבח",
  "קניות",
  "חיות מחמד",
  "אחר",
];

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  ניקיון: "🧹",
  כביסה: "🧺",
  מטבח: "🍽️",
  קניות: "🛒",
  "חיות מחמד": "🐾",
  אחר: "📌",
};

export const RECURRENCE_LABELS: Record<string, string> = {
  none: "חד פעמי",
  daily: "יומי",
  weekly: "שבועי",
  monthly: "חודשי",
};
