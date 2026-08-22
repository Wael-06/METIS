export type Color = "purple" | "teal";
export type Priority = "high" | "medium" | "low";
export type Kind = "task" | "video" | "blog" | "research" | "problem" | "project";
export type ReminderMode = "once" | "daily" | "weekly" | "interval";
export type View = "board" | "calendar";
export type Verdict = "ac" | "wa" | "tle" | "practice";

export type Category = {
  id: string;
  name: string;
  color: Color | string;
  position: number;
};

export type Task = {
  id: string;
  category_id: string;
  parent_id: string | null;
  title: string;
  kind: Kind | string;
  url: string;
  notes: string;
  priority: Priority | string;
  due_at: string | null;
  completed: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  position: number;
  overdue_notified_at: string | null;
};

export type Reminder = {
  id: string;
  task_id: string;
  enabled: number;
  mode: ReminderMode | string;
  remind_at: string | null;
  interval_minutes: number | null;
  weekdays: string;
  last_sent_at: string | null;
};

export type CpTag = {
  id: string;
  topic: string;
  label: string;
  position: number;
};

export type CpSubtag = {
  id: string;
  tag_id: string;
  slug: string;
  label: string;
  position: number;
};

export type SolveLog = {
  id: string;
  task_id: string | null;
  topic: string;
  tag_id: string | null;
  subtag_id: string | null;
  started_at: string;
  ended_at: string;
  duration_ms: number;
  verdict: Verdict | string;
  notes: string;
  created_at: string;
};

export type Replan = {
  id: string;
  week_of: string;
  summary: string;
  payload: string;
  created_at: string;
};

export type AppState = {
  categories: Category[];
  tasks: Task[];
  reminders: Reminder[];
  settings: Record<string, string>;
  cp_tags: CpTag[];
  cp_subtags: CpSubtag[];
  solve_logs: SolveLog[];
  last_replan: Replan | null;
};

export type Report = {
  total: number;
  done: number;
  overdue: number;
  completion_rate: number;
  categories: { id: string; name: string; total: number; done: number }[];
  last7: { date: string; completed: number }[];
};

export type ReplanPayload = {
  week_of?: string;
  summary?: string;
  add_tasks?: Array<{ title: string; category_id: string } & Partial<Task>>;
  update_tasks?: { id: string; title?: string; notes?: string; priority?: string; due_at?: string | null }[];
};
