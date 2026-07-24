import { useRef, useState } from "react";
import type { FamilyMember, HomeTask, Pet } from "../types";
import { CATEGORY_ICONS, COLOR_CLASSES, PET_ICONS } from "../constants";
import { compressImageFile, formatDueDate, isOverdue } from "../utils";
import { Avatar } from "./Avatar";

interface Props {
  task: HomeTask;
  assignee: FamilyMember | null;
  pet: Pet | null;
  onComplete: (id: string, photo: string) => void;
  onUncomplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  assignee,
  pet,
  onComplete,
  onUncomplete,
  onDelete,
}: Props) {
  const overdue = !task.done && isOverdue(task.dueDate);
  const colors = assignee ? COLOR_CLASSES[assignee.color] : null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function handleCheckClick() {
    if (task.done) {
      onUncomplete(task.id);
      return;
    }
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const photo = await compressImageFile(file);
      onComplete(task.id, photo);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
        task.done
          ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleCheckClick}
        disabled={uploading}
        aria-label={task.done ? "בטל סימון" : "העלאת תמונה וסימון כבוצע"}
        title={task.done ? "בטל סימון" : "יש לצלם/להעלות תמונה כדי לקבל נקודות"}
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition disabled:opacity-50 ${
          task.done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {uploading ? "⏳" : task.done ? "✓" : ""}
      </button>

      {task.proofPhoto && (
        <button
          type="button"
          onClick={() => window.open(task.proofPhoto ?? undefined, "_blank")}
          title="תמונת ביצוע אחרונה"
          className="flex-shrink-0"
        >
          <img
            src={task.proofPhoto}
            alt="הוכחת ביצוע"
            className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
        </button>
      )}

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
          {(task.completedCount ?? 0) > 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              בוצע {task.completedCount} פעמים
            </span>
          )}
          {pet && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {PET_ICONS[pet.species]} {pet.name}
            </span>
          )}
        </div>
      </div>

      {assignee && colors ? (
        <span
          className={`flex items-center gap-1.5 rounded-full py-1 pl-2 pr-1 text-sm ${colors.chip}`}
          title={assignee.name}
        >
          <Avatar member={assignee} size="sm" />
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
