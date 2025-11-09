@echo off
title MCP Server - Le Monde des Curieux Phase 3
color 0A

echo.
echo  ====================================================
echo  🚀 MCP Server - Le Monde des Curieux Phase 3
echo  ====================================================
echo.

cd /d "H:\lemondedescurieux"

REM Vérification existence configuration locale
if not exist ".mcp\config.local.json" (
    echo ❌ Fichier configuration locale manquant
    echo Créer .mcp\config.local.json avec votre GitHub token
    echo.
    pause
    exit /b 1
)

REM Vérification token GitHub configuré
findstr /C:"REMPLACER_PAR_VOTRE_GITHUB_TOKEN" ".mcp\config.local.json" >nul 2>&1
if %errorlevel% == 0 (
    echo ❌ GitHub Token non configuré
    echo.
    echo Éditer .mcp\config.local.json et remplacer:
    echo "REMPLACER_PAR_VOTRE_GITHUB_TOKEN"
    echo.
    echo Par votre token GitHub commençant par github_pat_
    echo.
    pause
    exit /b 1
)

echo ✅ Configuration validée
echo.
echo 📡 Démarrage MCP Server sur localhost:3001...
echo.

REM Démarrage serveur MCP
npx @modelcontextprotocol/server-github --server --port 3001 --config .mcp\mcp-config.json

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erreur démarrage MCP Server
    echo.
    pause
    exit /b 1
)

pause