import { useState } from "react";
import type { Task } from "../types";
import { isOverdue, monthMatrix, sameDay, WEEKDAY_LABELS } from "../util";

type Props = {
  tasks: Task[];
  onOpen: (id: string) => void;
};

export function CalendarView({ tasks, onOpen }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const weeks = monthMatrix(cursor.getFullYear(), cursor.getMonth());
  const label = cursor.toLocaleString([], { month: "long", year: "numeric" });

  return (
    <section>
      <div className="cal-head">
        <h3>{label}</h3>
        <div className="top-actions">
          <button type="button" className="ghost small" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            Prev
          </button>
          <button type="button" className="ghost small" onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}>
            Today
          </button>
          <button type="button" className="ghost small" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            Next
          </button>
        </div>
      </div>
      <div className="cal-grid">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day} className="cal-dow">{day}</div>
        ))}
        {weeks.flat().map((date) => {
          const inMonth = date.getMonth() === cursor.getMonth();
          const dayTasks = tasks.filter((task) => task.due_at && sameDay(new Date(task.due_at), date));
          return (
            <div
              key={date.toISOString()}
              className={`cal-day ${inMonth ? "" : "out"} ${sameDay(date, today) ? "today" : ""}`}
            >
              <div className="cal-num">{date.getDate()}</div>
              {dayTasks.slice(0, 4).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className={`cal-item ${isOverdue(task) ? "over" : "due"}`}
                  onClick={() => onOpen(task.id)}
                >
                  {task.title}
                </button>
              ))}
              {dayTasks.length > 4 ? <div className="cal-item">+{dayTasks.length - 4}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
