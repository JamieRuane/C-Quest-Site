@echo off
cd /d "%~dp0"
echo Starting Code Quest...
start "" http://localhost:4321
node server.js
pause
