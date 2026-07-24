import type { FamilyMember, HomeTask } from "../types";
import { COLOR_CLASSES } from "../constants";
import { Avatar } from "./Avatar";

interface Props {
  member: FamilyMember;
  tasks: HomeTask[];
  points: number;
}

export function ProfileCard({ member, tasks, points }: Props) {
  const colors = COLOR_CLASSES[member.color];
  const open = tasks.filter((t) => !t.done).length;
  const done = tasks.filter((t) => t.done).length;

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900`}
    >
      <Avatar member={member} size="lg" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-bold text-slate-800 dark:text-slate-100">
          {member.name}
          {member.age !== undefined && (
            <span className="mr-2 text-sm font-normal text-slate-400">
              גיל {member.age}
            </span>
          )}
        </h2>
        <div className="mt-1 flex flex-wrap gap-2 text-sm">
          <span className={`rounded-full px-2.5 py-1 font-medium ${colors.chip}`}>
            {points} ⭐ נקודות
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {open} משימות פתוחות
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {done} הושלמו
          </span>
        </div>
      </div>
    </div>
  );
}
