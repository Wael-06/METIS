# How to Ask ChatGPT to Generate a Study OS JSON Plan

## 1. Purpose

Use this format when asking ChatGPT to create a study plan that can be imported into Study OS.

The goal is to give ChatGPT enough information to produce **concrete work**, not vague advice.

A good plan contains:

- categories
- tasks
- nested subtasks
- resource links
- priorities
- due dates
- notes
- reminders where useful

## 2. Rules for the JSON

Return **valid JSON only** unless you explicitly ask for explanation.

Top-level shape:

```json
{
  "version": 1,
  "categories": [],
  "tasks": [],
  "reminders": []
}
```

### Category

```json
{
  "id": "systems",
  "name": "Systems CS",
  "color": "purple",
  "position": 0
}
```

`color` should currently be one of:

```text
purple
teal
```

### Task

```json
{
  "id": "systems-http-parser",
  "category_id": "systems",
  "parent_id": null,
  "title": "Implement a non-blocking HTTP parser",
  "kind": "project",
  "url": "https://example.com",
  "notes": "Implement only the request-line and header parser first.",
  "priority": "high",
  "due_at": "2026-08-24T20:00",
  "completed": 0,
  "completed_at": null,
  "created_at": "2026-08-19T20:00:00",
  "updated_at": "2026-08-19T20:00:00",
  "position": 0,
  "overdue_notified_at": null
}
```

### Subtask

Use the same structure, but set `parent_id` to the parent's ID.

```json
{
  "id": "systems-http-parser-tests",
  "category_id": "systems",
  "parent_id": "systems-http-parser",
  "title": "Write parser tests",
  "kind": "task",
  "url": "",
  "notes": "Cover malformed request lines and duplicate headers.",
  "priority": "medium",
  "due_at": "2026-08-22T20:00",
  "completed": 0,
  "completed_at": null,
  "created_at": "2026-08-19T20:00:00",
  "updated_at": "2026-08-19T20:00:00",
  "position": 0,
  "overdue_notified_at": null
}
```

### Reminder

```json
{
  "id": "reminder-001",
  "task_id": "systems-http-parser",
  "enabled": 1,
  "mode": "once",
  "remind_at": "2026-08-23T19:30",
  "interval_minutes": null,
  "weekdays": "[]",
  "last_sent_at": null
}
```

Allowed reminder modes:

```text
once
daily
weekly
interval
```

For weekly reminders, `weekdays` contains Python weekday numbers:

```text
0 Monday
1 Tuesday
2 Wednesday
3 Thursday
4 Friday
5 Saturday
6 Sunday
```

For example:

```json
"weekdays": "[1,3,5]"
```

means Tuesday, Thursday and Saturday.

## 3. Allowed item kinds

Use one of:

```text
task
video
blog
research
problem
project
```

Use `video` for lectures/courses/videos.

Use `blog` for technical articles/tutorials.

Use `research` for papers, technical reports or serious research material.

Use `problem` for a concrete problem-solving item such as a Codeforces, LeetCode or mathematical problem.

Use `project` for a multi-step engineering outcome.

Use `task` for normal work that does not fit another type.

## 4. Priority rules

Use:

```text
high
medium
low
```

Do not label everything high priority.

A useful rule:

- `high` = required for the current goal/deadline
- `medium` = important but can move
- `low` = useful extension

## 5. Due date rules

Use ISO local datetime:

```text
YYYY-MM-DDTHH:MM
```

Example:

```text
2026-08-23T21:00
```

Do not invent impossible dates.

If the user gives only a duration such as "finish this over the next 3 days", calculate concrete dates from the current date supplied in the conversation.

## 6. Planning rules for ChatGPT

When generating the plan:

1. Prefer concrete outcomes over passive activities.
2. Break large projects into executable subtasks.
3. Keep each task small enough to finish in a realistic session unless it is explicitly a project parent.
4. Put learning resources next to the work they support.
5. Avoid creating 100 tiny tasks just to make the plan look detailed.
6. Use dependencies implicitly through parent/subtask structure when possible.
7. Do not schedule impossible amounts of work in one day.
8. Respect the user's actual weekly availability.
9. Give higher priority to work tied to the user's stated goals.
10. Do not add motivational filler to notes.

## 7. Recommended ChatGPT prompt

Copy this prompt and replace the bracketed values.

```text
You are generating a study plan for my Study OS local planner.

Return VALID JSON ONLY. Do not wrap it in Markdown. Do not add commentary before or after the JSON.

CURRENT DATE:
[YYYY-MM-DD]

TIMEZONE:
[Africa/Cairo]

STUDY PERIOD:
[start date] to [end date]

AVAILABLE TIME:
- Monday: [hours]
- Tuesday: [hours]
- Wednesday: [hours]
- Thursday: [hours]
- Friday: [hours]
- Saturday: [hours]
- Sunday: [hours]

MAIN GOALS:
[write the actual goals]

CURRENT LEVEL:
[beginner/intermediate/advanced + what I already know]

TOPICS:
- [topic]
- [topic]
- [topic]

RESOURCES I WANT TO USE:
- [URL or resource]
- [URL or resource]

PROJECTS:
- [project and target outcome]

PROBLEMS / PRACTICE:
- [problem set / contest / platform]

CONSTRAINTS:
- [exams, gym, university, work, etc.]

PLAN REQUIREMENTS:
- Priorities must be high, medium or low.
- Tasks must use task, video, blog, research, problem or project.
- Large work must be broken into subtasks.
- Use realistic due dates and times.
- Give each category and task a unique stable id.
- Do not mark new work completed.
- Put useful context in notes.
- Add reminders only when they have real value; do not put reminders on every item.
- Keep the total workload realistic for the available hours.
- Prefer active work: implementation, problem solving, writing notes, testing, benchmarking and review.
- Use resources to support a task instead of making passive watching/reading the main objective.

CATEGORIES TO USE:
1. Systems CS
2. Math & Algorithms
3. Machine Learning
4. Backend
5. Competitive Programming

OUTPUT SHAPE:
{
  "version": 1,
  "categories": [],
  "tasks": [],
  "reminders": []
}

Generate the complete JSON now.
```

## 8. Better prompt for engineering-focused study

For technical goals, add this block:

```text
ENGINEERING PREFERENCE:
I learn best with:
1. understand the concept
2. implement it
3. encounter a problem
4. research only what is needed
5. benchmark/debug
6. write a short note
7. move to the next concrete milestone

Do not design a plan that is mostly video watching.
For every significant learning resource, attach an implementation or problem-solving task.
For systems topics, favor code, experiments, benchmarks, debugging and reading real documentation/source code.
```

## 9. Example compact plan

```json
{
  "version": 1,
  "categories": [
    {"id":"systems","name":"Systems CS","color":"purple","position":0},
    {"id":"cp","name":"Competitive Programming","color":"teal","position":1}
  ],
  "tasks": [
    {
      "id":"systems-net-1",
      "category_id":"systems",
      "parent_id":null,
      "title":"Learn TCP connection lifecycle",
      "kind":"research",
      "url":"https://example.com/tcp",
      "notes":"Read the article, then explain SYN/SYN-ACK/ACK from memory.",
      "priority":"high",
      "due_at":"2026-08-21T20:00",
      "completed":0,
      "completed_at":null,
      "created_at":"2026-08-19T20:00:00",
      "updated_at":"2026-08-19T20:00:00",
      "position":0,
      "overdue_notified_at":null
    },
    {
      "id":"systems-net-2",
      "category_id":"systems",
      "parent_id":"systems-net-1",
      "title":"Implement a tiny TCP client",
      "kind":"project",
      "url":"",
      "notes":"Create a C program that opens a TCP connection and sends one request.",
      "priority":"high",
      "due_at":"2026-08-22T21:00",
      "completed":0,
      "completed_at":null,
      "created_at":"2026-08-19T20:00:00",
      "updated_at":"2026-08-19T20:00:00",
      "position":0,
      "overdue_notified_at":null
    },
    {
      "id":"cp-binary-search-1",
      "category_id":"cp",
      "parent_id":null,
      "title":"Solve 4 binary search problems",
      "kind":"problem",
      "url":"https://codeforces.com/",
      "notes":"At least one problem should require binary search on the answer.",
      "priority":"medium",
      "due_at":"2026-08-21T22:00",
      "completed":0,
      "completed_at":null,
      "created_at":"2026-08-19T20:00:00",
      "updated_at":"2026-08-19T20:00:00",
      "position":1,
      "overdue_notified_at":null
    }
  ],
  "reminders": [
    {
      "id":"rem-1",
      "task_id":"systems-net-2",
      "enabled":1,
      "mode":"once",
      "remind_at":"2026-08-22T19:30",
      "interval_minutes":null,
      "weekdays":"[]",
      "last_sent_at":null
    }
  ]
}
```

## 10. Quality check before importing

Before giving me JSON, ChatGPT should mentally validate:

- every referenced `category_id` exists
- every `parent_id` exists
- every ID is unique
- positions are numeric
- priorities are valid
- kinds are valid
- date strings are valid ISO local datetimes
- reminders reference existing tasks
- no impossible daily workload was created
- JSON is syntactically valid

The final output should be directly importable by Study OS.
