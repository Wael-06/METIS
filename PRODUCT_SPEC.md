# Study OS — Product & Engineering Spec

## 1. Product

**Study OS** is a local-first study planning and execution system. It is not a generic todo list and it is not a visual roadmap.

The core UX is a single focused board inspired by the provided references:
- dark background
- restrained purple / teal / amber accents
- simple cards and typography
- no permanent sidebar
- no arrow-based roadmap UI
- low visual noise

The browser is the primary editing interface. JSON is a data interchange format, not the primary editing experience.

## 2. Main goals

1. Turn a high-level study plan into concrete work.
2. Keep videos, blogs, research, problems, projects and normal tasks together.
3. Make priorities, deadlines and reminders actionable.
4. Make progress visible without creating dashboard clutter.
5. Work locally on Linux and Windows with no paid service.
6. Save automatically so the user does not manage files after every edit.

## 3. Current target domains

The initial study categories are:

- Systems CS
- Math & Algorithms
- Machine Learning
- Backend
- Competitive Programming

Categories are user-editable.

## 4. Core hierarchy

The hierarchy is:

```text
Category
└── Task / Resource / Project
    ├── Subtask
    │   └── Subtask (nested depth is allowed by the data model)
    └── Subtask
```

A task belongs to exactly one category. A task may optionally have a parent task.

Subtasks must be created directly from the parent task in the UI. Do not force the user to choose a parent from a dropdown.

## 5. Item types

Current item kinds:

- task
- video
- blog
- research
- problem
- project

Every item can have:
- title
- type
- category
- parent
- priority
- due date/time
- URL
- notes
- completion state
- ordering position

## 6. Progress model

Completion is currently binary:

```text
completed = 0 | 1
```

The product should stay binary at the task level unless a later version introduces explicit effort tracking. Avoid adding fake percentages to individual tasks.

Parent progress can be calculated from descendants.

Suggested formula:

```text
progress = completed_leaf_items / total_leaf_items
```

If a parent has no children, its own completion state determines its progress.

## 7. Ordering

Users can rearrange:

- categories
- tasks
- subtasks

Use visible drag handles at the side of each row/card.

Ordering must be persisted automatically in SQLite. Never rely on DOM order only.

Items should only be reordered within their valid sibling group:

```text
category siblings
category's root-task siblings
same-parent task siblings
```

## 8. Reminders

Reminders must be real desktop notifications and must remain free.

Current modes:

- once
- daily
- weekly
- every N minutes

There is also an automatic overdue notification for an unfinished item when its due time has passed.

Important behavior:

- completing a task stops its reminder checks
- a once reminder should not repeatedly fire
- overdue notification is one-time per due date/state
- reminder timestamps are stored in the database
- reminder worker runs locally with the application

## 9. Startup

### Linux

The intended mechanism is the user's desktop autostart directory:

```text
~/.config/autostart/study-os.desktop
```

The `.desktop` file is **not a shell script** and must not be executed by typing its path into Bash.

The desktop entry launches:

```text
startup_linux.sh
```

That script starts the local Flask app in the background and opens:

```text
http://127.0.0.1:5173
```

### Windows

Use the user's Startup folder and a `.lnk`/VBScript launch path. Keep the process local and hidden where practical.

## 10. Storage

Primary storage:

```text
data/study_os.db
```

SQLite is the source of truth.

The app should save after every meaningful mutation:

- create
- edit
- delete
- complete/uncomplete
- reorder
- reminder change
- category change

## 11. JSON

JSON is for:

- importing an external study plan
- exporting a backup
- giving ChatGPT a machine-readable plan format
- future Git sync

Do not make JSON editing the main UI.

The current export should represent categories, tasks and reminders sufficiently to reconstruct the study plan.

## 12. Reporting

The product should automatically derive a report from activity data.

Current report direction:
- total completed / total items
- overall completion percentage
- overdue count
- category progress
- recent completion graph

Future reports should favor useful engineering metrics over decorative charts.

Good metrics:
- completed tasks per day
- completed leaf subtasks per category
- overdue rate
- planned vs completed work
- streaks
- project milestone progress
- problem-solving volume
- resource consumption (videos/blogs/research)

Bad metrics:
- meaningless gamification
- dozens of percentage cards
- fake productivity scores without a clear definition

## 13. Architecture

Current stack:

```text
Browser
   ↓
Flask HTTP API + HTML
   ↓
SQLite
   ↓
Local notification worker
```

Frontend:
- HTML
- CSS
- vanilla JavaScript

Backend:
- Python
- Flask
- SQLite
- notifypy when available
- OS notification fallbacks

No Electron.

## 14. Local API direction

Keep the API boring and predictable.

Current resource groups:

```text
GET    /api/state
POST   /api/categories
PUT    /api/categories/<id>
DELETE /api/categories/<id>
POST   /api/tasks
PUT    /api/tasks/<id>
DELETE /api/tasks/<id>
POST   /api/tasks/<id>/toggle
POST   /api/reorder
PUT    /api/reminders/<task_id>
DELETE /api/reminders/<task_id>
GET    /api/report
GET    /api/export
POST   /api/import
```

## 15. UX rules

Keep these rules when extending the UI:

1. No permanent sidebar.
2. No unnecessary onboarding wizard.
3. No noisy gradients, blobs, illustrations or AI-generated decoration.
4. No giant KPI dashboard dominating the screen.
5. Editing should happen in the browser.
6. Common actions should be one click away.
7. Every automatic action should have a visible state.
8. Destructive actions need confirmation.
9. Save automatically.
10. The board should remain understandable at a glance.

## 16. V2 roadmap

### A. Execution tracking

- time spent per item
- start/stop focus timer
- daily planned minutes
- daily completed minutes
- compare planned vs actual

### B. Smarter planning

- dependencies
- recurring tasks
- study sessions
- prerequisite relationships
- workload balancing
- automatic overdue rescheduling

### C. Better analytics

- weekly report
- monthly report
- category trends
- completion heatmap
- problem difficulty distribution
- project milestone history

### D. GitHub

Deferred until the local UX is stable.

Planned behavior:
- connect a user-created repository
- store exported plan/history
- optional commit after each change
- configurable auto-commit batching
- check remote state before writes
- conflict handling

GitHub must never become required for normal local operation.

### E. Planning input from ChatGPT

The user should be able to provide a strict JSON plan generated from a reusable prompt. The app can then import that plan without manually editing JSON.

## 17. Non-goals

Do not turn Study OS into:

- a full calendar replacement
- a note-taking platform
- a social study network
- an AI chatbot inside every card
- a habit-game with points everywhere
- a cloud SaaS product by default

The product exists to help the user decide what to study, do the work, and see whether the work actually happened.

## 18. Definition of done for future features

A feature is not done until:

- it works on Linux and Windows when applicable
- state survives restart
- UI state matches database state
- errors are handled visibly
- no existing workflow is unnecessarily broken
- the feature keeps the board visually simple
- documentation is updated
