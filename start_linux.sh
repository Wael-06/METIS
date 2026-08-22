#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
APP_DIR="$(pwd)"

python3 -m venv .venv 2>/dev/null || true
source .venv/bin/activate
python -m pip install -r requirements.txt >/dev/null

mkdir -p "$HOME/.config/autostart"
cat > "$HOME/.config/autostart/study-os.desktop" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Study OS
Comment=Start the local Study OS reminder service
Exec=$APP_DIR/startup_linux.sh
Terminal=false
X-GNOME-Autostart-enabled=true
DESKTOP

echo "Study OS startup registered for this Linux user."
python app.py
