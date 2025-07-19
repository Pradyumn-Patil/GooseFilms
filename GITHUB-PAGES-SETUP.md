# GitHub Pages Deployment Guide for GooseFilms

## ✅ What Will Work on GitHub Pages

1. **Static Content** - All HTML, CSS, JavaScript files
2. **Client-side JavaScript** - All your JS functionality
3. **Firebase Integration** - Real-time database operations
4. **Authentication** - Your simple auth system using localStorage
5. **Movie Search** - TMDB API calls from the browser

## ⚠️ Important Changes Needed

### 1. Fix File Paths (CRITICAL)
GitHub Pages serves from a subdirectory, so absolute paths like `/favicon.ico` won't work.

**Quick Fix Script:**
```bash
# Run this before pushing to GitHub
find . -name "*.html" -o -name "*.js" | xargs sed -i '' 's|href="/|href="./|g'
find . -name "*.html" -o -name "*.js" | xargs sed -i '' 's|src="/|src="./|g'
```

### 2. Remove Directory Space
The space in "GooseFilms " will cause issues. Rename the directory:
```bash
cd /Users/pradyumn/Desktop
mv "GooseFilms " GooseFilms
```

### 3. Files to Remove/Ignore
Create a `.gitignore` file:
```
.DS_Store
*.pyc
__pycache__/
test-*.html
debug-*.html
admin-debug.html
fix-all.html
diagnose.html
create-favicon.html
generate-favicon.py
*.sh
*.command
.claude/
```

## 📝 Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
cd /Users/pradyumn/Desktop/GooseFilms
git init
git add .
git commit -m "Initial commit: GooseFilms movie scheduling app"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Name it `goosefilms` (or your preferred name)
3. Don't initialize with README (you already have files)
4. Create repository

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/goosefilms.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to Settings → Pages in your repository
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

### 5. Access Your Site
Your site will be available at:
`https://YOUR_USERNAME.github.io/goosefilms/`

## 🔧 GitHub Pages Compatible Config

Create `gh-pages-config.js`:
```javascript
// Override config for GitHub Pages
const GH_PAGES_BASE_URL = '/goosefilms'; // Replace with your repo name

// Update all internal links
document.addEventListener('DOMContentLoaded', function() {
    // Fix navigation links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
        const href = link.getAttribute('href');
        link.setAttribute('href', GH_PAGES_BASE_URL + href);
    });
});
```

## 🚀 Quick Deploy Script

Create `deploy.sh`:
```bash
#!/bin/bash
echo "🎬 Deploying GooseFilms to GitHub Pages..."

# Fix paths
echo "Fixing paths..."
find . -name "*.html" -type f -exec sed -i '' 's|href="/|href="./|g' {} +
find . -name "*.html" -type f -exec sed -i '' 's|src="/|src="./|g' {} +

# Commit and push
git add .
git commit -m "Update for GitHub Pages deployment"
git push origin main

echo "✅ Deployed! Visit: https://YOUR_USERNAME.github.io/goosefilms/"
```

## ⚡ Quick Start Commands

```bash
# 1. Clone this guide's fixes
cd /Users/pradyumn/Desktop/GooseFilms

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Commit
git commit -m "Initial commit: GooseFilms movie scheduling app"

# 5. Add your GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/goosefilms.git

# 6. Push
git push -u origin main

# 7. Enable GitHub Pages in repository settings
```

## 🔐 Security Notes

1. **Firebase Config**: Your Firebase config is already public (client-side), this is normal
2. **API Keys**: TMDB API key is rate-limited and meant for client-side use
3. **Admin Password**: Uses localStorage, not exposed in code

## 🎯 Testing After Deployment

1. Visit your GitHub Pages URL
2. Test all features:
   - Homepage loads
   - Admin login works (password: goosefilms2024)
   - Movie search works
   - Scheduling works
   - Firebase sync works

## 🐛 Troubleshooting

### Images not loading?
- Check paths are relative: `./assets/image.jpg` not `/assets/image.jpg`

### JavaScript not working?
- Open browser console for errors
- Check all script paths are relative

### 404 errors?
- GitHub Pages is case-sensitive
- Check exact filenames match

### Firebase not working?
- Check browser console for errors
- Ensure Firebase project allows your GitHub Pages domain

## ✨ Success!
Your GooseFilms site will work exactly the same on GitHub Pages as it does locally!