# Study OS — local study planner

A local browser app for planning and tracking study across Systems CS, Math & Algorithms, ML, Backend and Competitive Programming.

## What is in v1
- No sidebar; single focused board inspired by the uploaded references.
- Categories with progress bars.
- Tasks + nested subtasks.
- Resources: video, blog, research, problem, project.
- Priority, due dates, URLs and notes.
- Automatic saving to a local SQLite database.
- Real desktop notifications for reminders when the local app is running.
- Reminder modes: once, daily, weekly and every N minutes.
- Progress report with category breakdown and a 7-day completion graph.
- Manual JSON export for backup/share.
- GitHub sync deliberately left for v2.

## Run on Linux or Windows

1. Create a virtual environment:

```bash
python -m venv .venv
```

2. Activate it:

Linux/macOS:
```bash
source .venv/bin/activate
```

Windows PowerShell:
```powershell
.venv\\Scripts\\Activate.ps1
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start:

```bash
python app.py
```

5. Open `http://127.0.0.1:5173` in your browser.

## Reminder note
The notification worker runs with the local app process. For reminders while you are not actively using the browser, keep the app process running. A future v2 can add OS-level startup registration and GitHub syncing.

## Data
The real database is `data/study_os.db`. Export uses `data/study-os-export.json`.
