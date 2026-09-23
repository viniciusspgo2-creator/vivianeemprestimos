@echo off
setlocal
cd /d "%~dp0"
title Deploy automatico - Vercel + Neon
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy-auto.ps1"
echo.
if errorlevel 1 (
  echo DEPLOY FALHOU. Veja a mensagem acima.
) else (
  echo DEPLOY FINALIZADO.
)
pause
