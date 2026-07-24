import type { FamilyMember, HomeTask } from "../types";
import { CATEGORY_ICONS } from "../constants";

interface Props {
  tasks: HomeTask[];
  members: FamilyMember[];
  onUpdatePoints: (id: string, points: number) => void;
  onUpdateAssignee: (id: string, assigneeId: string | null) => void;
  rate: number;
  setRate: (rate: number) => void;
  onClose: () => void;
}

export function ManagementPanel({
  tasks,
  members,
  onUpdatePoints,
  onUpdateAssignee,
  rate,
  setRate,
  onClose,
}: Props) {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">
          ⚙️ ניהול נקודות ושיוך
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-600"
        >
          סגירה
        </button>
      </div>

      <label className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        שווי נקודה: ₪
        <input
          type="number"
          min={0}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value) || 0)}
          className="w-20 rounded-lg border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
        />
        לנקודה
      </label>

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-400">אין עדיין משימות</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 dark:bg-slate-900"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {CATEGORY_ICONS[t.category]} {t.title}
              </span>

              <select
                value={t.assigneeId ?? ""}
                onChange={(e) => onUpdateAssignee(t.id, e.target.value || null)}
                className="flex-shrink-0 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">ללא אחראי</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatar} {m.name}
                  </option>
                ))}
              </select>

              <label className="flex flex-shrink-0 items-center gap-1 text-sm text-slate-500">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={t.points}
                  onChange={(e) => onUpdatePoints(t.id, Number(e.target.value) || 1)}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center dark:border-slate-700 dark:bg-slate-800"
                />
                ⭐
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
