import type { Category, Task } from "./types";

export function escapeHtml(value = ""): string {
  return String(value).replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[c] ?? c));
}

export function childrenOf(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.parent_id === id).sort((a, b) => a.position - b.position);
}

export function rootsFor(tasks: Task[], cat: Category): Task[] {
  return tasks
    .filter((t) => t.category_id === cat.id && !t.parent_id)
    .sort((a, b) => a.position - b.position);
}

export function isOverdue(task: Task, now = new Date()): boolean {
  return !task.completed && Boolean(task.due_at) && new Date(task.due_at as string) < now;
}

export function dueSoon(task: Task, hours = 72, now = new Date()): boolean {
  if (task.completed || !task.due_at) return false;
  const due = new Date(task.due_at);
  const limit = new Date(now.getTime() + hours * 3600 * 1000);
  return due >= now && due <= limit;
}

export function formatDue(dueAt: string | null): string {
  if (!dueAt) return "";
  return new Date(dueAt).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function monthMatrix(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const mondayIndex = (first.getDay() + 6) % 7;
  start.setDate(first.getDate() - mondayIndex);
  const weeks: Date[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w += 1) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d += 1) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isCpCategory(cat: Category): boolean {
  return cat.id === "cp" || /competitive/i.test(cat.name);
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
