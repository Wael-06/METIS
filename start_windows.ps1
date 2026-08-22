$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Test-Path .venv)) { py -m venv .venv }
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

$startupDir = [Environment]::GetFolderPath('Startup')
$startupVbs = Join-Path $PSScriptRoot 'startup_windows.vbs'
@"
Set shell = CreateObject("WScript.Shell")
shell.Run Chr(34) & "$PSScriptRoot\.venv\Scripts\pythonw.exe" & Chr(34) & " " & Chr(34) & "$PSScriptRoot\app.py" & Chr(34), 0, False
WScript.Sleep 2500
shell.Run "http://127.0.0.1:5173", 1, False
"@ | Set-Content -Path $startupVbs -Encoding ASCII

$shortcutPath = Join-Path $startupDir 'Study OS.lnk'
$ws = New-Object -ComObject WScript.Shell
$shortcut = $ws.CreateShortcut($shortcutPath)
$shortcut.TargetPath = 'wscript.exe'
$shortcut.Arguments = ('"' + $startupVbs + '"')
$shortcut.WorkingDirectory = $PSScriptRoot
$shortcut.WindowStyle = 7
$shortcut.Save()

Write-Host "Study OS startup registered for this Windows user."
Write-Host "Starting Study OS..."
Start-Process -FilePath (Join-Path $PSScriptRoot '.venv\Scripts\python.exe') -ArgumentList ('"' + (Join-Path $PSScriptRoot 'app.py') + '"') -WorkingDirectory $PSScriptRoot
Start-Sleep -Seconds 2
Start-Process 'http://127.0.0.1:5173'
