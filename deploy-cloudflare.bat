@echo off
echo Deploying to Cloudflare Pages...
echo.

REM Install wrangler if not installed
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Wrangler CLI...
    npm install -g wrangler
)

REM Deploy to Cloudflare Pages
echo Deploying your site...
wrangler pages deploy . --project-name=split-lease-clone

echo.
echo Deployment complete!
echo Your site will be available at: https://split-lease-clone.pages.dev
pause