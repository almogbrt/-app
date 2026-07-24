import { useMemo, useState } from "react";
import type { FamilyMember, HomeTask, Pet, TaskCategory } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { MembersBar } from "./components/MembersBar";
import { PetsBar } from "./components/PetsBar";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { ProfileCard } from "./components/ProfileCard";
import { PayoutPanel } from "./components/PayoutPanel";
import { FilterBar, type StatusFilter } from "./components/FilterBar";
import { nextOccurrence, todayISO } from "./utils";

const avatarUrl = (file: string) => `${import.meta.env.BASE_URL}avatars/${file}`;

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: "dad", name: "אלמוג", color: "sky", avatar: "👨", photo: avatarUrl("dad.jpg") },
  { id: "mom", name: "רעות", color: "rose", avatar: "👩", photo: avatarUrl("mom.jpg") },
  { id: "noam", name: "נועם", age: 14, color: "emerald", avatar: "🧒", photo: avatarUrl("noam.jpg") },
  { id: "rom", name: "רום", age: 11, color: "amber", avatar: "🧒", photo: avatarUrl("rom.jpg") },
  { id: "niv", name: "ניב", age: 7, color: "violet", avatar: "🧒", photo: avatarUrl("niv.jpg") },
];

const DEFAULT_PETS: Pet[] = [
  { id: "charlie", name: "צ'ארלי", species: "dog" },
  { id: "noga", name: "נוגה", species: "turtle" },
  { id: "zigi", name: "זיגי", species: "bird" },
];

const DEFAULT_TASKS: HomeTask[] = [];

function App() {
  const [members, setMembers] = useLocalStorage<FamilyMember[]>(
    "home-tasks/members",
    DEFAULT_MEMBERS,
  );
  const [pets, setPets] = useLocalStorage<Pet[]>("home-tasks/pets", DEFAULT_PETS);
  const [tasks, setTasks] = useLocalStorage<HomeTask[]>(
    "home-tasks/tasks",
    DEFAULT_TASKS,
  );
  const [rate, setRate] = useLocalStorage<number>("home-tasks/rate", 1);

  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [activePetId, setActivePetId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<TaskCategory | "all">("all");
  const [showPayout, setShowPayout] = useState(false);

  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])),
    [members],
  );
  const petsById = useMemo(() => Object.fromEntries(pets.map((p) => [p.id, p])), [pets]);

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

  function runWeeklyPayout() {
    setTasks((prev) =>
      prev.map((t) => (t.done && !t.paidOut ? { ...t, paidOut: true } : t)),
    );
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => (activeMemberId ? t.assigneeId === activeMemberId : true))
      .filter((t) => (activePetId ? t.petId === activePetId : true))
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
  }, [tasks, activeMemberId, activePetId, category, status]);

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
            <h1 className="text-2xl font-bold">🏠 The Bartian's</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {openCount} משימות פתוחות · {doneToday} הושלמו היום
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPayout((v) => !v)}
            className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
          >
            💰 תשלום שבועי
          </button>
        </header>

        {showPayout && (
          <section className="mb-6">
            <PayoutPanel
              members={members}
              tasks={tasks}
              rate={rate}
              setRate={setRate}
              onPayout={runWeeklyPayout}
              onClose={() => setShowPayout(false)}
            />
          </section>
        )}

        <section className="mb-4">
          <MembersBar
            members={members}
            setMembers={setMembers}
            pointsByMember={pointsByMember}
            activeMemberId={activeMemberId}
            onSelectMember={setActiveMemberId}
          />
        </section>

        <section className="mb-6">
          <PetsBar
            pets={pets}
            setPets={setPets}
            activePetId={activePetId}
            onSelectPet={setActivePetId}
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
          <TaskForm members={members} pets={pets} onAdd={addTask} />
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
                pet={task.petId ? (petsById[task.petId] ?? null) : null}
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
