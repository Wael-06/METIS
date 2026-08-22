#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
APP_DIR="$(pwd)"

if pgrep -f "$APP_DIR/.venv/bin/python[[:space:]].*$APP_DIR/app.py" >/dev/null 2>&1; then
  exit 0
fi

if [ ! -x "$APP_DIR/.venv/bin/python" ]; then
  python3 -m venv .venv
  .venv/bin/python -m pip install -r requirements.txt >/dev/null
fi

nohup "$APP_DIR/.venv/bin/python" "$APP_DIR/app.py" >/tmp/study-os.log 2>&1 &
sleep 2
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://127.0.0.1:5173" >/dev/null 2>&1 || true
fi
