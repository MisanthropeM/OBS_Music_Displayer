@echo off

:: Run the npm test command
npm run test

:: Check if the command was successful
if %errorlevel% equ 0 (
    echo Tests executed successfully.
) else (
    echo An error occurred while running tests.
)
