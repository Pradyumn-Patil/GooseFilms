#!/bin/bash

echo "🎬 GOOSEFILMS DEPLOYMENT SCRIPT 🎬"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Preparing your project...${NC}"

# First, let's check if we're in the right directory
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" == *"GooseFilms "* ]]; then
    echo -e "${BLUE}Detected space in directory name. You'll need to rename it.${NC}"
    echo "Run this command first:"
    echo -e "${GREEN}cd /Users/pradyumn/Desktop && mv \"GooseFilms \" GooseFilms${NC}"
    echo "Then navigate to the new directory:"
    echo -e "${GREEN}cd GooseFilms${NC}"
    echo "And run this script again!"
    exit 1
fi

# Create .gitignore
echo -e "${YELLOW}Creating .gitignore...${NC}"
cat > .gitignore << 'EOF'
# OS files
.DS_Store
Thumbs.db

# Test files
test-*.html
debug-*.html
admin-debug.html
fix-all.html
diagnose.html
create-favicon.html
generate-favicon.py

# Scripts
*.sh
*.command

# Python
*.py
*.pyc
__pycache__/

# Editors
.vscode/
.idea/
.claude/

# Logs
*.log
EOF

echo -e "${GREEN}✓ .gitignore created${NC}"

# Clean up test files
echo -e "${YELLOW}Cleaning up test files...${NC}"
rm -f test-*.html debug-*.html admin-debug.html fix-all.html diagnose.html create-favicon.html generate-favicon.py *.sh *.command 2>/dev/null

echo -e "${GREEN}✓ Test files removed${NC}"

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Step 2: Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
else
    echo -e "${GREEN}✓ Git already initialized${NC}"
fi

# Add all files
echo -e "${YELLOW}Step 3: Adding files to Git...${NC}"
git add .
echo -e "${GREEN}✓ Files added${NC}"

# Create commit
echo -e "${YELLOW}Step 4: Creating commit...${NC}"
git commit -m "🎬 Initial commit: GooseFilms movie scheduling app

Features:
- Movie scheduling with calendar view
- Admin panel with authentication
- Real-time sync with Firebase
- TMDB movie search integration
- Responsive design with cinema theme"

echo -e "${GREEN}✓ Commit created${NC}"

echo ""
echo -e "${BLUE}=================================="
echo -e "🎉 YOUR PROJECT IS READY FOR GITHUB! 🎉"
echo -e "==================================${NC}"
echo ""
echo -e "${YELLOW}Now follow these steps:${NC}"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Create a new repository named: goosefilms"
echo "3. DON'T initialize with README"
echo "4. After creating, copy the repository URL"
echo ""
echo -e "${YELLOW}5. Run these commands (replace YOUR_USERNAME):${NC}"
echo -e "${GREEN}git remote add origin https://github.com/YOUR_USERNAME/goosefilms.git${NC}"
echo -e "${GREEN}git branch -M main${NC}"
echo -e "${GREEN}git push -u origin main${NC}"
echo ""
echo -e "${YELLOW}6. Enable GitHub Pages:${NC}"
echo "   - Go to Settings → Pages"
echo "   - Source: Deploy from branch"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "   - Save"
echo ""
echo -e "${BLUE}Your site will be live at:${NC}"
echo -e "${GREEN}https://YOUR_USERNAME.github.io/goosefilms/${NC}"
echo ""
echo -e "${YELLOW}Admin password: goosefilms2024${NC}"
echo ""
echo "🎬 Good luck with your deployment! 🚀"