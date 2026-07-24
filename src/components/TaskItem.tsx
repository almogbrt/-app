import type { FamilyMember, HomeTask } from "../types";
import { CATEGORY_ICONS, COLOR_CLASSES } from "../constants";
import { formatDueDate, isOverdue } from "../utils";

interface Props {
  task: HomeTask;
  assignee: FamilyMember | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, assignee, onToggle, onDelete }: Props) {
  const overdue = !task.done && isOverdue(task.dueDate);
  const colors = assignee ? COLOR_CLASSES[assignee.color] : null;

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
        task.done
          ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label="סמן כבוצע"
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {task.done && "✓"}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`truncate font-medium ${
              task.done
                ? "text-slate-400 line-through dark:text-slate-500"
                : "text-slate-800 dark:text-slate-100"
            }`}
          >
            {task.title}
          </span>
          <span className="text-xs text-slate-400">
            {CATEGORY_ICONS[task.category]} {task.category}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {task.dueDate && (
            <span
              className={`rounded-full px-2 py-0.5 ${
                overdue
                  ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {overdue ? "באיחור · " : ""}
              {formatDueDate(task.dueDate)}
            </span>
          )}
          {task.recurrence !== "none" && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              🔁{" "}
              {task.recurrence === "daily"
                ? "יומי"
                : task.recurrence === "weekly"
                  ? "שבועי"
                  : "חודשי"}
            </span>
          )}
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            {task.points} ⭐
          </span>
        </div>
      </div>

      {assignee && colors ? (
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm ${colors.chip}`}
          title={assignee.name}
        >
          <span>{assignee.avatar}</span>
          <span className="hidden sm:inline">{assignee.name}</span>
        </span>
      ) : (
        <span className="text-xs text-slate-300 dark:text-slate-600">ללא אחראי</span>
      )}

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 rounded-full p-1.5 text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-500/10"
        aria-label="מחיקת משימה"
        title="מחיקת משימה"
      >
        🗑
      </button>
    </div>
  );
}
