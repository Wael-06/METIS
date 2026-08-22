import type { AppState, ReplanPayload, Report } from "./types";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, { ...options, headers });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const type = res.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return undefined as T;
}

export const api = {
  state: () => request<AppState>("/api/state"),
  report: () => request<Report>("/api/report"),
  createCategory: (body: { name: string; color: string }) =>
    request<{ id: string }>("/api/categories", { method: "POST", body: JSON.stringify(body) }),
  createTask: (body: Record<string, unknown>) =>
    request<{ id: string }>("/api/tasks", { method: "POST", body: JSON.stringify(body) }),
  patchTask: (id: string, body: Record<string, unknown>) =>
    request("/api/tasks/" + id, { method: "PATCH", body: JSON.stringify(body) }),
  deleteTask: (id: string) => request("/api/tasks/" + id, { method: "DELETE" }),
  reorder: (body: { type: "category" | "task"; id: string; order: string[] }) =>
    request("/api/reorder", { method: "POST", body: JSON.stringify(body) }),
  putReminder: (taskId: string, body: Record<string, unknown>) =>
    request("/api/reminders/" + taskId, { method: "PUT", body: JSON.stringify(body) }),
  deleteReminder: (taskId: string) => request("/api/reminders/" + taskId, { method: "DELETE" }),
  importJson: (text: string) => request("/api/import", { method: "POST", body: text }),
  putSettings: (body: Record<string, string>) =>
    request<Record<string, string>>("/api/settings", { method: "PUT", body: JSON.stringify(body) }),
  createSolveLog: (body: Record<string, unknown>) =>
    request<{ id: string }>("/api/solve-logs", { method: "POST", body: JSON.stringify(body) }),
  deleteSolveLog: (id: string) => request("/api/solve-logs/" + id, { method: "DELETE" }),
  replanContext: () => request<Record<string, unknown>>("/api/replan/context"),
  applyReplan: (body: ReplanPayload) =>
    request("/api/replan", { method: "POST", body: JSON.stringify(body) }),
};
