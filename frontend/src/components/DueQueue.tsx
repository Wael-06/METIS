import type { Task } from "../types";
import { dueSoon, formatDue, isOverdue } from "../util";

type Props = {
  tasks: Task[];
  onOpen: (id: string) => void;
};

export function DueQueue({ tasks, onOpen }: Props) {
  const now = new Date();
  const items = tasks
    .filter((task) => isOverdue(task, now) || dueSoon(task, 72, now))
    .sort((a, b) => {
      const aOver = isOverdue(a, now) ? 0 : 1;
      const bOver = isOverdue(b, now) ? 0 : 1;
      if (aOver !== bOver) return aOver - bOver;
      return String(a.due_at).localeCompare(String(b.due_at));
    })
    .slice(0, 12);

  if (!items.length) return null;

  return (
    <section className="queue" aria-label="Near due">
      {items.map((task) => {
        const overdue = isOverdue(task, now);
        return (
          <button
            key={task.id}
            type="button"
            className={`queue-card ${overdue ? "overdue" : ""}`}
            onClick={() => onOpen(task.id)}
          >
            <div className="queue-kicker">{overdue ? "Overdue" : "Due soon"}</div>
            <div className="queue-title">{task.title}</div>
            <div className="queue-meta">{formatDue(task.due_at)}</div>
          </button>
        );
      })}
    </section>
  );
}
