# 🚀 Deploy GooseFilms to GitHub Pages - Simple Guide

## Will it work on GitHub Pages?
**YES! ✅** Your website will work exactly the same on GitHub Pages as it does locally, including:
- ✅ All pages and navigation
- ✅ Admin login system
- ✅ Movie search (TMDB API)
- ✅ Firebase real-time sync
- ✅ Movie scheduling

## Step 1: Prepare Your Files

```bash
# 1. First, rename the folder to remove the space
cd /Users/pradyumn/Desktop
mv "GooseFilms " GooseFilms
cd GooseFilms

# 2. Rename the gitignore file
mv gitignore-file .gitignore

# 3. Remove test files (optional)
rm -f test-*.html debug-*.html admin-debug.html fix-all.html diagnose.html create-favicon.html generate-favicon.py *.sh *.command
```

## Step 2: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `goosefilms`
3. Description: "Movie scheduling app for our exclusive movie club"
4. Public repository
5. DON'T initialize with README
6. Click "Create repository"

## Step 3: Upload to GitHub

```bash
# Run these commands in Terminal
cd /Users/pradyumn/Desktop/GooseFilms

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: GooseFilms movie scheduling app"

# Add your repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/goosefilms.git

# Push to GitHub
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" (in the repository)
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Branch: `main`
6. Folder: `/ (root)`
7. Click "Save"

## Step 5: Access Your Site

After 2-5 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/goosefilms/
```

## That's it! 🎉

### Test Everything:
1. Go to your GitHub Pages URL
2. Click "Admin Access"
3. Login with: `goosefilms2024`
4. Search for a movie
5. Schedule it
6. Check if it appears on the homepage

### If Something Doesn't Work:

**Images not showing?**
- Wait 5 minutes for GitHub to fully deploy
- Hard refresh: Cmd+Shift+R

**Can't login?**
- Check browser console (F12)
- Make sure you're using: `goosefilms2024`

**Firebase errors?**
- Your Firebase is already configured and will work!

## Quick Commands Cheat Sheet:

```bash
# See your changes
git status

# Add and commit new changes
git add .
git commit -m "Update movie schedules"
git push

# Your site auto-updates in ~1 minute!
```

## Your Site URLs:
- Local: http://localhost:8000
- GitHub Pages: https://YOUR_USERNAME.github.io/goosefilms/

Both will work exactly the same! 🎬