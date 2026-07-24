import { useState } from "react";
import type { Pet, PetSpecies } from "../types";
import { PET_ICONS } from "../constants";
import { uid } from "../utils";

interface Props {
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  activePetId: string | null;
  onSelectPet: (id: string | null) => void;
}

export function PetsBar({ pets, setPets, activePetId, onSelectPet }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<PetSpecies>("dog");

  function addPet(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setPets((prev) => [...prev, { id: uid(), name: trimmed, species }]);
    setName("");
    setAdding(false);
  }

  function removePet(id: string) {
    setPets((prev) => prev.filter((p) => p.id !== id));
    if (activePetId === id) onSelectPet(null);
  }

  if (pets.length === 0 && !adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400"
      >
        + חיית מחמד
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pets.map((p) => {
        const active = activePetId === p.id;
        return (
          <div key={p.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelectPet(active ? null : p.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-transparent bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              <span>{PET_ICONS[p.species]}</span>
              <span>{p.name}</span>
            </button>
            <button
              type="button"
              onClick={() => removePet(p.id)}
              className="absolute -left-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-white group-hover:flex"
              title="הסר חיית מחמד"
            >
              ×
            </button>
          </div>
        );
      })}

      {adding ? (
        <form onSubmit={addPet} className="flex items-center gap-1.5">
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value as PetSpecies)}
            className="rounded-full border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="dog">🐶 כלב</option>
            <option value="turtle">🐢 צב</option>
            <option value="bird">🦜 ציפור</option>
          </select>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => !name && setAdding(false)}
            placeholder="שם..."
            className="w-20 rounded-full border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-slate-900"
          >
            הוסף
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400"
        >
          + חיית מחמד
        </button>
      )}
    </div>
  );
}
