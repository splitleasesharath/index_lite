@echo off
echo Building static site...

REM Create dist directory if it doesn't exist
if not exist dist mkdir dist

REM Copy all static files to dist
copy index.html dist\
copy styles.css dist\
copy script.js dist\
copy _headers dist\ 2>nul
copy _redirects dist\ 2>nul
copy README.md dist\ 2>nul

echo Build complete! Files copied to dist/