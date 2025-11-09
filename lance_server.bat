@echo off
cd /d "%~dp0"
start python -m http.server 8000
start "" http://localhost:8000/english_songs.html
