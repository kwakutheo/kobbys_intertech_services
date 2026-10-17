@echo off
setlocal enabledelayedexpansion
title Kobbys Intertech Services - Shutdown
color 0C

set QUIET=0
if "%~1"=="--quiet" set QUIET=1

if %QUIET% equ 0 (
    echo ======================================================================
    echo           Stopping Kobby's Intertech Services Development Servers
    echo ======================================================================
    echo.
)

cd /d "%~dp0"

if %QUIET% equ 0 echo Stopping API [Port 4000] and Web [Port 3000] servers...

:: Stop processes listening on ports 3000 and 4000 and their process trees
powershell.exe -NoProfile -Command "& { 3000, 4000 | ForEach-Object { $port = $_; (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique | ForEach-Object { Write-Host ('  [+] Terminating process tree on port ' + $port + ' (PID ' + $_ + ')...'); taskkill.exe /F /T /PID $_ > $null 2>&1 } } }"

:: Close terminal windows with matching titles
taskkill /FI "WINDOWTITLE eq Kobbys API (Port 4000)*" /F /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Kobbys Web (Port 3000)*" /F /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Kobbys API*" /F /T >nul 2>&1
taskkill /FI "WINDOWTITLE eq Kobbys Web*" /F /T >nul 2>&1

:: Optionally stop docker postgres container if docker is running
where docker >nul 2>&1
if %ERRORLEVEL% equ 0 (
    docker compose stop postgres >nul 2>&1
)

if %QUIET% equ 0 (
    echo.
    echo ======================================================================
    echo  All local development servers have been stopped.
    echo ======================================================================
    echo.
    pause
)
