#!/bin/bash

# Auto-commit script for GooseFilms schedule updates
# This script automatically commits and pushes schedule changes

echo "🎬 GooseFilms Auto-Commit Script"
echo "================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if data/schedules.json exists
if [ ! -f "data/schedules.json" ]; then
    echo "❌ Error: data/schedules.json not found"
    exit 1
fi

# Check if there are changes to commit
if git diff --quiet data/schedules.json; then
    echo "ℹ️  No changes to schedules.json"
    exit 0
fi

echo "📅 Changes detected in movie schedules"
echo "🔄 Auto-committing to GitHub..."

# Add the schedules file
git add data/schedules.json

# Create commit with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Auto-update movie schedules - $TIMESTAMP"

# Push to GitHub
if git push; then
    echo "✅ Successfully pushed schedule updates to GitHub Pages!"
    echo "🌐 Your live website will update in a few minutes"
else
    echo "❌ Failed to push to GitHub"
    exit 1
fi