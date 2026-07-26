import { useState } from "react";
import type { ShoppingItem } from "../types";
import { uid } from "../utils";

interface Props {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export function ShoppingList({ items, setItems }: Props) {
  const [name, setName] = useState("");

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((prev) => [
      { id: uid(), name: trimmed, quantity: 1, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setName("");
  }

  function changeQuantity(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 font-bold text-slate-800 dark:text-slate-100">
        🛒 רשימת קניות
      </h2>

      <form onSubmit={addItem} className="mb-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="מוצר חדש..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
        >
          הוספה
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">הרשימה ריקה 🎉</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                {item.name}
              </span>

              <div className="flex flex-shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="הפחתת כמות"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => changeQuantity(item.id, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  aria-label="הוספת כמות"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="flex-shrink-0 rounded-full p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-600 dark:hover:bg-red-500/10"
                aria-label="מחיקת מוצר"
                title="מחיקת מוצר"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
