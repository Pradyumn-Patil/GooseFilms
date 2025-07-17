# GooseFilms Website - GitHub Pages Setup

## Commands to run after creating GitHub repository

Replace `yourusername` and `repository-name` with your actual GitHub username and repository name:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/yourusername/repository-name.git

# Push your code to GitHub
git push -u origin main
```

## Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

Your website will be available at: `https://yourusername.github.io/repository-name`

## Important Notes for GitHub Pages

- Your main page (index.html) will be the homepage
- The TMDB API key in config.js is exposed in client-side code
- Consider using environment variables or a backend for sensitive data in production
- GitHub Pages serves static files only - no server-side processing

## File Structure (Ready for GitHub Pages)
- index.html (main page)
- admin.html (admin panel)
- login.html (login page)
- config.js (configuration)
- js/ (JavaScript modules)
- assets/ (images and media)