import type { TaskCategory } from "../types";
import { CATEGORY_ICONS, TASK_CATEGORIES } from "../constants";

export type StatusFilter = "all" | "pending" | "done";

interface Props {
  status: StatusFilter;
  setStatus: (s: StatusFilter) => void;
  category: TaskCategory | "all";
  setCategory: (c: TaskCategory | "all") => void;
}

export function FilterBar({ status, setStatus, category, setCategory }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className="flex rounded-lg border border-slate-200 p-0.5 dark:border-slate-800">
        {(
          [
            ["all", "הכל"],
            ["pending", "פתוחות"],
            ["done", "בוצעו"],
          ] as [StatusFilter, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`rounded-md px-3 py-1.5 font-medium transition ${
              status === value
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as TaskCategory | "all")}
        className="rounded-lg border border-slate-300 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="all">כל הקטגוריות</option>
        {TASK_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORY_ICONS[c]} {c}
          </option>
        ))}
      </select>
    </div>
  );
}
