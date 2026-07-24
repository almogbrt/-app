import type { Recurrence } from "./types";

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "";
  const today = todayISO();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().slice(0, 10);

  if (dueDate === today) return "היום";
  if (dueDate === tomorrowISO) return "מחר";

  return new Date(dueDate).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
  });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return dueDate < todayISO();
}

export function nextOccurrence(dueDate: string, recurrence: Recurrence): string {
  const date = new Date(dueDate);
  if (recurrence === "daily") date.setDate(date.getDate() + 1);
  else if (recurrence === "weekly") date.setDate(date.getDate() + 7);
  else if (recurrence === "monthly") date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
}

export function uid(): string {
  return crypto.randomUUID();
}

export function startOfWeekISO(): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - day);
  sunday.setHours(0, 0, 0, 0);
  return sunday.toISOString();
}
