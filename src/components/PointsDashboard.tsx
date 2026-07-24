import type { FamilyMember } from "../types";
import { COLOR_CLASSES } from "../constants";
import { Avatar } from "./Avatar";

interface Props {
  members: FamilyMember[];
  pointsByMember: Record<string, number>;
}

export function PointsDashboard({ members, pointsByMember }: Props) {
  if (members.length === 0) return null;

  const ranked = [...members].sort(
    (a, b) => (pointsByMember[b.id] ?? 0) - (pointsByMember[a.id] ?? 0),
  );
  const maxPoints = Math.max(1, ...ranked.map((m) => pointsByMember[m.id] ?? 0));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">
          🏆 לוח הנקודות השבועי
        </h2>
        <span className="text-xs text-slate-400">מתאפס כל יום ראשון</span>
      </div>
      <div className="space-y-2">
        {ranked.map((m, i) => {
          const pts = pointsByMember[m.id] ?? 0;
          const colors = COLOR_CLASSES[m.color];
          const width = Math.round((pts / maxPoints) * 100);
          return (
            <div key={m.id} className="flex items-center gap-3">
              <span className="w-4 flex-shrink-0 text-center text-xs font-semibold text-slate-400">
                {i + 1}
              </span>
              <Avatar member={m} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                    {m.name}
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {pts} ⭐
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full ${colors.bg}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
