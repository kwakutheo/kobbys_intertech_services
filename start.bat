@echo off
setlocal enabledelayedexpansion
title Kobbys Intertech Services - Launcher
color 0A

echo ======================================================================
echo           Starting Kobby's Intertech Services Development Servers
echo ======================================================================
echo.

cd /d "%~dp0"

:: Detect active Wi-Fi / Local Network IPv4 address
set "LAN_IP="
for /f "delims=" %%A in ('powershell.exe -NoProfile -Command "try { $ip = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway } | Select-Object -ExpandProperty IPv4Address | Select-Object -First 1).IPv4Address; if (-not $ip) { $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.)' } | Select-Object -First 1).IPAddress }; $ip } catch { '' }"' ) do (
    if not defined LAN_IP set "LAN_IP=%%A"
)

:: Step 1: Ensure database service is running
echo [1/3] Checking Database...
where docker >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Starting PostgreSQL container via Docker Compose...
    docker compose up -d postgres
) else (
    echo Note: Docker not found on PATH. Using local PostgreSQL service on port 5432.
)

:: Check if port 4000 or 3000 are already in use
powershell.exe -NoProfile -Command "& { $used = (Get-NetTCPConnection -LocalPort 3000, 4000 -State Listen -ErrorAction SilentlyContinue); if ($used) { exit 1 } else { exit 0 } }"
if %ERRORLEVEL% neq 0 (
    echo [!] Detected existing servers running on port 3000 or 4000.
    echo     Cleaning up previous instances before starting fresh...
    call "%~dp0stop.bat" --quiet
    timeout /t 1 /nobreak >nul
)

:: Step 2: Start API Server
echo [2/3] Starting NestJS API server (Port 4000)...
pushd "%~dp0apps\api"
start "Kobbys API (Port 4000)" cmd /k "npm run start:dev"
popd

:: Step 3: Start Web Server
echo [3/3] Starting Next.js Web server (Port 3000)...
pushd "%~dp0apps\web"
start "Kobbys Web (Port 3000)" cmd /k "npm run dev"
popd

echo.
echo ======================================================================
echo  Servers have been launched in dedicated terminal windows:
echo.
echo   [Local Access - On This PC]
echo     - Web App:      http://localhost:3000
echo     - API Server:   http://localhost:4000
echo     - API Health:   http://localhost:4000/api/health
echo.
if defined LAN_IP (
    echo   [Wi-Fi / Local Network Access - Other Devices]
    echo   Open these on your phone, tablet, or another PC on the same Wi-Fi:
    echo     - Web App:      http://!LAN_IP!:3000
    echo     - API Server:   http://!LAN_IP!:4000
    echo     - API Health:   http://!LAN_IP!:4000/api/health
) else (
    echo   [Wi-Fi / Local Network Access - Other Devices]
    echo   Check your Wi-Fi IPv4 address using 'ipconfig' to access from other devices.
)
echo.
echo  To stop all running servers, run 'stop.bat'.
echo ======================================================================
echo.
pause
