import { useMemo, useState } from "react";
import type { FamilyMember, HomeTask, TaskCategory } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { MembersBar } from "./components/MembersBar";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { ProfileCard } from "./components/ProfileCard";
import { FilterBar, type StatusFilter } from "./components/FilterBar";
import { nextOccurrence, todayISO } from "./utils";

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "dad", name: "אבא", color: "sky", avatar: "👨", photo: "/avatars/dad.jpg" },
  { id: "mom", name: "אמא", color: "rose", avatar: "👩", photo: "/avatars/mom.jpg" },
  { id: "boy-1", name: "הבן הגדול", color: "emerald", avatar: "🧒", photo: "/avatars/boy-1.jpg" },
  { id: "boy-2", name: "הבן האמצעי", color: "amber", avatar: "🧒", photo: "/avatars/boy-2.jpg" },
  { id: "boy-3", name: "הבן הקטן", color: "violet", avatar: "🧒", photo: "/avatars/boy-3.jpg" },
];
const DEFAULT_TASKS: HomeTask[] = [];

function App() {
  const [members, setMembers] = useLocalStorage<FamilyMember[]>(
    "home-tasks/members",
    DEFAULT_MEMBERS,
  );
  const [tasks, setTasks] = useLocalStorage<HomeTask[]>(
    "home-tasks/tasks",
    DEFAULT_TASKS,
  );

  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<TaskCategory | "all">("all");

  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members],
  );

  const pointsByMember = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const task of tasks) {
      if (task.done && task.assigneeId) {
        totals[task.assigneeId] = (totals[task.assigneeId] ?? 0) + task.points;
      }
    }
    return totals;
  }, [tasks]);

  function addTask(task: HomeTask) {
    setTasks((prev) => [task, ...prev]);
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        if (!t.done && t.recurrence !== "none" && t.dueDate) {
          return {
            ...t,
            done: false,
            completedAt: new Date().toISOString(),
            dueDate: nextOccurrence(t.dueDate, t.recurrence),
          };
        }

        return {
          ...t,
          done: !t.done,
          completedAt: !t.done ? new Date().toISOString() : null,
        };
      }),
    );
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => (activeMemberId ? t.assigneeId === activeMemberId : true))
      .filter((t) => (category === "all" ? true : t.category === category))
      .filter((t) => {
        if (status === "pending") return !t.done;
        if (status === "done") return t.done;
        return true;
      })
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [tasks, activeMemberId, category, status]);

  const openCount = tasks.filter((t) => !t.done).length;
  const doneToday = tasks.filter(
    (t) => t.done && t.completedAt?.slice(0, 10) === todayISO(),
  ).length;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🏠 משימות הבית</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {openCount} משימות פתוחות · {doneToday} הושלמו היום
            </p>
          </div>
        </header>

        <section className="mb-6">
          <MembersBar
            members={members}
            setMembers={setMembers}
            pointsByMember={pointsByMember}
            activeMemberId={activeMemberId}
            onSelectMember={setActiveMemberId}
          />
        </section>

        {activeMemberId && membersById[activeMemberId] && (
          <section className="mb-6">
            <ProfileCard
              member={membersById[activeMemberId]}
              tasks={tasks.filter((t) => t.assigneeId === activeMemberId)}
              points={pointsByMember[activeMemberId] ?? 0}
            />
          </section>
        )}

        <section className="mb-6">
          <TaskForm members={members} onAdd={addTask} />
        </section>

        <section className="mb-4">
          <FilterBar
            status={status}
            setStatus={setStatus}
            category={category}
            setCategory={setCategory}
          />
        </section>

        <section className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-700">
              אין משימות להצגה 🎉
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                assignee={task.assigneeId ? (membersById[task.assigneeId] ?? null) : null}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
