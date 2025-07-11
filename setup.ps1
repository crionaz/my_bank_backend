#!/usr/bin/env pwsh

Write-Host "Installing Node.js Backend Dependencies..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check NPM version
try {
    $npmVersion = npm --version
    Write-Host "NPM version: $npmVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: NPM is not available" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Install dependencies
try {
    npm install
    Write-Host ""
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Setting up Husky git hooks..." -ForegroundColor Yellow

try {
    npx husky install
    Write-Host "Husky git hooks configured!" -ForegroundColor Green
} catch {
    Write-Host "Warning: Failed to setup Husky git hooks" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Creating logs directory..." -ForegroundColor Yellow

if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
    Write-Host "Logs directory created!" -ForegroundColor Green
} else {
    Write-Host "Logs directory already exists!" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor Cyan
Write-Host "  1. Copy .env.example to .env and configure your environment" -ForegroundColor White
Write-Host "  2. Start development server with: " -NoNewline -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host "  3. Run tests with: " -NoNewline -ForegroundColor White
Write-Host "npm test" -ForegroundColor Yellow
Write-Host "  4. Build for production with: " -NoNewline -ForegroundColor White
Write-Host "npm run build" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to continue"
