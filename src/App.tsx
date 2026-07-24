import { useEffect, useMemo, useState } from "react";
import type { FamilyMember, HomeTask, Pet, TaskCategory, TaskCompletion } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { MembersBar } from "./components/MembersBar";
import { PetsBar } from "./components/PetsBar";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { ProfileCard } from "./components/ProfileCard";
import { PayoutPanel } from "./components/PayoutPanel";
import { PointsDashboard } from "./components/PointsDashboard";
import { FilterBar, type StatusFilter } from "./components/FilterBar";
import { nextOccurrence, shuffle, todayISO, uid } from "./utils";

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

function seedTask(
  id: string,
  title: string,
  category: TaskCategory,
  recurrence: HomeTask["recurrence"],
  points: number,
  petId: string | null = null,
): HomeTask {
  return {
    id,
    title,
    category,
    assigneeId: null,
    petId,
    dueDate: todayISO(),
    recurrence,
    points,
    done: false,
    completedAt: null,
    completedCount: 0,
    proofPhoto: null,
    createdAt: new Date().toISOString(),
  };
}

const SEED_TASKS: HomeTask[] = [
  seedTask("seed-dishwasher-in", "להכניס מדיח", "מטבח", "daily", 10),
  seedTask("seed-dishwasher-out", "לפנות מדיח", "מטבח", "daily", 8),
  seedTask("seed-trash-out", "להוריד זבל", "ניקיון", "daily", 8),
  seedTask("seed-bins-curb", "סיבוב פחים", "ניקיון", "weekly", 6),
  seedTask("seed-laundry-down", "להוריד כביסה", "כביסה", "weekly", 5),
  seedTask("seed-laundry-hang", "לתלות כביסה", "כביסה", "weekly", 5),
  seedTask("seed-charlie-walk", "סיבוב לצ'ארלי", "חיות מחמד", "daily", 8, "charlie"),
  seedTask("seed-noga-water", "מים לנוגה", "חיות מחמד", "daily", 8, "noga"),
  seedTask("seed-zigi-food", "אוכל לזיגי", "חיות מחמד", "daily", 8, "zigi"),
];

const SEED_BY_ID = new Map(SEED_TASKS.map((t) => [t.id, t]));

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
  const [lastAssignDate, setLastAssignDate] = useLocalStorage<string>(
    "home-tasks/lastAssignDate",
    "",
  );
  const [completions, setCompletions] = useLocalStorage<TaskCompletion[]>(
    "home-tasks/completions",
    [],
  );
  const [completionsMigrated, setCompletionsMigrated] = useLocalStorage<boolean>(
    "home-tasks/completionsMigrated",
    false,
  );

  // One-time: convert points earned under the old task-level completedCount
  // model (which mis-attributed everything to the task's *current* assignee)
  // into individual completion records, so future reassignment can't retroactively
  // change who past points belong to.
  useEffect(() => {
    if (completionsMigrated) return;
    setCompletions((prevCompletions) => {
      if (prevCompletions.length > 0) return prevCompletions;
      const migrated: TaskCompletion[] = tasks
        .filter((t) => (t.completedCount ?? 0) > 0 && t.assigneeId)
        .map((t) => ({
          id: uid(),
          taskId: t.id,
          memberId: t.assigneeId,
          points: t.points * (t.completedCount ?? 0),
          photo: t.proofPhoto ?? "",
          completedAt: t.completedAt ?? new Date().toISOString(),
          paidOut: false,
        }));
      return migrated.length ? [...migrated, ...prevCompletions] : prevCompletions;
    });
    setCompletionsMigrated(true);
  }, [completionsMigrated, tasks, setCompletions, setCompletionsMigrated]);

  // One-time repair for photo URLs saved before the GitHub Pages base-path fix.
  useEffect(() => {
    setMembers((prev) => {
      let changed = false;
      const fixed = prev.map((m) => {
        if (m.photo?.startsWith("/avatars/")) {
          changed = true;
          return { ...m, photo: avatarUrl(m.photo.slice("/avatars/".length)) };
        }
        return m;
      });
      return changed ? fixed : prev;
    });
  }, [setMembers]);

  // Add the requested household seed tasks if they aren't already present,
  // and keep already-added seed tasks' point values in sync with the latest list.
  useEffect(() => {
    setTasks((prev) => {
      let changed = false;
      const updated = prev.map((t) => {
        const seed = SEED_BY_ID.get(t.id);
        if (seed && seed.points !== t.points) {
          changed = true;
          return { ...t, points: seed.points };
        }
        return t;
      });
      const existingIds = new Set(updated.map((t) => t.id));
      const missing = SEED_TASKS.filter((t) => !existingIds.has(t.id));
      if (missing.length) changed = true;
      return changed ? [...missing, ...updated] : prev;
    });
  }, [setTasks]);

  // Once per day, randomly pick family members and hand each of them 3 chores.
  useEffect(() => {
    if (members.length === 0 || lastAssignDate === todayISO()) return;

    setTasks((prev) => {
      const recurringIds = prev.filter((t) => t.recurrence !== "none").map((t) => t.id);
      if (recurringIds.length === 0) return prev;

      const peopleCount = Math.max(
        1,
        Math.min(members.length, Math.floor(recurringIds.length / 3) || 1),
      );
      const chosen = shuffle(members).slice(0, peopleCount);
      const shuffledTaskIds = shuffle(recurringIds);

      const assignment = new Map<string, string>();
      shuffledTaskIds.forEach((taskId, i) => {
        assignment.set(taskId, chosen[i % chosen.length].id);
      });

      return prev.map((t) =>
        assignment.has(t.id) ? { ...t, assigneeId: assignment.get(t.id)! } : t,
      );
    });

    setLastAssignDate(todayISO());
  }, [members, lastAssignDate, setTasks, setLastAssignDate]);

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
    for (const c of completions) {
      if (c.memberId) {
        totals[c.memberId] = (totals[c.memberId] ?? 0) + c.points;
      }
    }
    return totals;
  }, [completions]);

  function addTask(task: HomeTask) {
    setTasks((prev) => [task, ...prev]);
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function completeTask(id: string, photo: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setCompletions((prev) => [
      {
        id: uid(),
        taskId: id,
        memberId: task.assigneeId,
        points: task.points,
        photo,
        completedAt: new Date().toISOString(),
        paidOut: false,
      },
      ...prev,
    ]);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completedCount = (t.completedCount ?? 0) + 1;

        if (t.recurrence !== "none" && t.dueDate) {
          return {
            ...t,
            done: false,
            completedAt: new Date().toISOString(),
            completedCount,
            proofPhoto: photo,
            dueDate: nextOccurrence(t.dueDate, t.recurrence),
          };
        }

        return {
          ...t,
          done: true,
          completedAt: new Date().toISOString(),
          completedCount,
          proofPhoto: photo,
        };
      }),
    );
  }

  function uncompleteTask(id: string) {
    setCompletions((prev) => {
      const idx = prev.findIndex((c) => c.taskId === id);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && t.done
          ? {
              ...t,
              done: false,
              completedAt: null,
              completedCount: Math.max(0, (t.completedCount ?? 0) - 1),
            }
          : t,
      ),
    );
  }

  function runWeeklyPayout() {
    setCompletions((prev) => prev.map((c) => (c.paidOut ? c : { ...c, paidOut: true })));
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
    (t) => t.completedAt?.slice(0, 10) === todayISO(),
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

        <section className="mb-6">
          <PointsDashboard members={members} pointsByMember={pointsByMember} />
        </section>

        {showPayout && (
          <section className="mb-6">
            <PayoutPanel
              members={members}
              completions={completions}
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
                onComplete={completeTask}
                onUncomplete={uncompleteTask}
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
