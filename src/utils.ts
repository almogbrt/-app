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

export function startOfWeekDateISO(): string {
  const now = new Date();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - now.getDay());
  return sunday.toISOString().slice(0, 10);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function compressImageFile(file: File, maxDim = 480, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      img.onerror = () => reject(new Error("invalid image"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("no canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
