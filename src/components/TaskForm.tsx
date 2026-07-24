import { useState } from "react";
import type { FamilyMember, HomeTask, Pet, Recurrence, TaskCategory } from "../types";
import { CATEGORY_ICONS, PET_ICONS, TASK_CATEGORIES } from "../constants";
import { todayISO, uid } from "../utils";

interface Props {
  members: FamilyMember[];
  pets: Pet[];
  onAdd: (task: HomeTask) => void;
}

export function TaskForm({ members, pets, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("אחר");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [petId, setPetId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(todayISO());
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [points, setPoints] = useState(5);

  function reset() {
    setTitle("");
    setCategory("אחר");
    setAssigneeId("");
    setPetId("");
    setDueDate(todayISO());
    setRecurrence("none");
    setPoints(5);
    setOpen(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({
      id: uid(),
      title: trimmed,
      category,
      assigneeId: assigneeId || null,
      petId: petId || null,
      dueDate: dueDate || null,
      recurrence,
      points,
      done: false,
      completedAt: null,
      completedCount: 0,
      proofPhoto: null,
      createdAt: new Date().toISOString(),
    });
    reset();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-slate-300 py-4 text-center font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400"
      >
        + הוספת משימה חדשה
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="מה צריך לעשות? (למשל: לשטוף כלים)"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm text-slate-500">
          קטגוריה
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            className="rounded-lg border border-slate-300 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
          >
            {TASK_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_ICONS[c]} {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-500">
          אחראי/ת
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">ללא</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.avatar} {m.name}
              </option>
            ))}
          </select>
        </label>

        {category === "חיות מחמד" && (
          <label className="flex flex-col gap-1 text-sm text-slate-500">
            חיית מחמד
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="">ללא</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {PET_ICONS[p.species]} {p.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm text-slate-500">
          תאריך יעד
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-500">
          חזרתיות
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as Recurrence)}
            className="rounded-lg border border-slate-300 px-2 py-2 dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="none">חד פעמי</option>
            <option value="daily">יומי</option>
            <option value="weekly">שבועי</option>
            <option value="monthly">חודשי</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-500">
        נקודות למשימה:
        <input
          type="number"
          min={1}
          max={50}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value) || 1)}
          className="w-20 rounded-lg border border-slate-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
        />
        ⭐
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
        >
          ביטול
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
        >
          הוספת משימה
        </button>
      </div>
    </form>
  );
}
