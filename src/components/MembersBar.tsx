import { useState } from "react";
import type { FamilyMember } from "../types";
import { COLOR_CLASSES, MEMBER_COLORS } from "../constants";
import { uid } from "../utils";
import { Avatar } from "./Avatar";

interface Props {
  members: FamilyMember[];
  setMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  pointsByMember: Record<string, number>;
  activeMemberId: string | null;
  onSelectMember: (id: string | null) => void;
}

const AVATAR_EMOJIS = ["🦊", "🐼", "🐸", "🐧", "🐨", "🦁", "🐰", "🐻", "🐯", "🐵"];

export function MembersBar({
  members,
  setMembers,
  pointsByMember,
  activeMemberId,
  onSelectMember,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  function addMember(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    const avatar = AVATAR_EMOJIS[members.length % AVATAR_EMOJIS.length];
    setMembers((prev) => [...prev, { id: uid(), name: trimmed, color, avatar }]);
    setName("");
    setAdding(false);
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (activeMemberId === id) onSelectMember(null);
  }

  function startRename(m: FamilyMember) {
    setEditingId(m.id);
    setEditingName(m.name);
  }

  function commitRename() {
    const trimmed = editingName.trim();
    if (editingId && trimmed) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, name: trimmed } : m)),
      );
    }
    setEditingId(null);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onSelectMember(null)}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
          activeMemberId === null
            ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
            : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
        }`}
      >
        כולם
      </button>

      {members.map((m) => {
        const colors = COLOR_CLASSES[m.color];
        const active = activeMemberId === m.id;
        const isEditing = editingId === m.id;
        return (
          <div key={m.id} className="group relative">
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commitRename();
                }}
                className="flex items-center gap-2 rounded-full border border-slate-300 px-2 py-1 dark:border-slate-700"
              >
                <Avatar member={m} size="sm" />
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={commitRename}
                  className="w-20 bg-transparent text-sm focus:outline-none"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => onSelectMember(active ? null : m.id)}
                onDoubleClick={() => startRename(m)}
                title="לחיצה כפולה לשינוי שם"
                className={`flex items-center gap-2 rounded-full border py-1 pl-3 pr-1.5 text-sm font-medium transition ${
                  active
                    ? `ring-2 ${colors.ring} border-transparent ${colors.chip}`
                    : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                <Avatar member={m} size="sm" />
                <span>{m.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${colors.chip}`}
                >
                  {pointsByMember[m.id] ?? 0} ⭐
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => removeMember(m.id)}
              className="absolute -left-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-white group-hover:flex"
              title="הסר בן משפחה"
            >
              ×
            </button>
          </div>
        );
      })}

      {adding ? (
        <form onSubmit={addMember} className="flex items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => !name && setAdding(false)}
            placeholder="שם..."
            className="w-28 rounded-full border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-3 py-2 text-sm text-white dark:bg-white dark:text-slate-900"
          >
            הוסף
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400"
        >
          + בן משפחה
        </button>
      )}
    </div>
  );
}
