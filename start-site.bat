@echo off
setlocal

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

echo Starting Zensical dev server...
py -m zensical serve --open