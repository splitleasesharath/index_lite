#!/bin/bash
echo "Building static site..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy all static files to dist
cp index.html dist/
cp styles.css dist/
cp script.js dist/
cp _headers dist/ 2>/dev/null || true
cp _redirects dist/ 2>/dev/null || true
cp README.md dist/ 2>/dev/null || true

echo "Build complete! Files copied to dist/"