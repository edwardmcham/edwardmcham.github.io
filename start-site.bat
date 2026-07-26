@echo off
setlocal enabledelayedexpansion

if defined VIRTUAL_ENV (
    echo Venv already active: %VIRTUAL_ENV%
) else (
    echo Activating .venv...
    call "%~dp0.venv\Scripts\activate.bat"
    if errorlevel 1 (
        echo ERROR: .venv not found at %~dp0.venv
        pause
        exit /b 1
    )
)

echo Checking for a leftover server on port 8000...

REM netstat lists active connections. We filter for port 8000 and only
REM keep lines that end in LISTENING (an actual running server, not a
REM closing/waiting connection). The last column in that line is the PID.
set FOUND_PID=
for /f "tokens=5" %%p in ('netstat -ano -p tcp ^| findstr :8000 ^| findstr LISTENING') do (
    set FOUND_PID=%%p
)

if defined FOUND_PID (
    echo Found a leftover process on port 8000 ^(PID !FOUND_PID!^). Closing it...
    REM /F forces the close, /PID targets that exact process.
    taskkill /F /PID !FOUND_PID! >nul 2>&1
    REM Give Windows a moment to release the port before we bind to it again.
    timeout /t 1 /nobreak >nul
) else (
    echo No leftover server found.
)

echo Doing clean build...
py -m zensical build --clean

echo Starting Zensical dev server in the background...
REM "start /b" runs the server without opening a new window,
REM but its build/log output still prints to this console.
start /b py -m zensical serve

echo Waiting for the dev server to finish its first build...

:waitloop
REM curl checks the site without downloading the page body:
REM   -s          silent (no progress bar)
REM   -o NUL      discard the response body
REM   -w "%%{http_code}"   print only the HTTP status code, e.g. 200 or 000
for /f %%i in ('curl -s -o NUL -w "%%{http_code}" http://localhost:8000') do set STATUS=%%i

if "%STATUS%"=="200" goto ready

REM Server isn't ready yet (or not started). Wait 1 second and check again.
timeout /t 1 /nobreak >nul
goto waitloop

:ready
echo Server is ready. Opening browser...
start http://localhost:8000