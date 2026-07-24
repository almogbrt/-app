import { useMemo } from "react";
import type { FamilyMember, HomeTask } from "../types";
import { Avatar } from "./Avatar";

interface Props {
  members: FamilyMember[];
  tasks: HomeTask[];
  rate: number;
  setRate: (rate: number) => void;
  onPayout: () => void;
  onClose: () => void;
}

export function PayoutPanel({ members, tasks, rate, setRate, onPayout, onClose }: Props) {
  const unpaidPoints = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const t of tasks) {
      if (!t.assigneeId) continue;
      const unpaid = (t.completedCount ?? 0) - (t.paidOutCount ?? 0);
      if (unpaid > 0) {
        totals[t.assigneeId] = (totals[t.assigneeId] ?? 0) + unpaid * t.points;
      }
    }
    return totals;
  }, [tasks]);

  const totalPoints = Object.values(unpaidPoints).reduce((a, b) => a + b, 0);
  const hasAnything = totalPoints > 0;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">
          💰 תשלום שבועי
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-600"
        >
          סגירה
        </button>
      </div>

      <label className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        שער המרה: ₪
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

      {members.length === 0 ? (
        <p className="text-sm text-slate-400">אין עדיין בני משפחה</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => {
            const pts = unpaidPoints[m.id] ?? 0;
            return (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl bg-white px-3 py-2 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <Avatar member={m} size="sm" />
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {pts} ⭐ = ₪{(pts * rate).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          סה"כ לתשלום: ₪{(totalPoints * rate).toFixed(2)}
        </span>
        <button
          type="button"
          disabled={!hasAnything}
          onClick={onPayout}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          בצע תשלום שבועי
        </button>
      </div>
    </div>
  );
}
