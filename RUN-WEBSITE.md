# How to Run GooseFilms Website Locally

## Quick Start Options

### Option 1: Simple Python Server (Recommended)
Open Terminal in the GooseFilms directory and run:

```bash
# For Python 3
python3 -m http.server 8000

# For Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Node.js HTTP Server
If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: VS Code Live Server
If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Direct File Opening (Limited)
Simply double-click `index.html` in Finder. However, this may cause issues with:
- Firebase connections
- Some JavaScript features
- Cross-origin requests

## Testing the Website

### 1. First Time Setup
1. Open `http://localhost:8000` (or your chosen port)
2. You should see the GooseFilms homepage
3. Click "Admin Access" to go to login

### 2. Admin Login
- Codeword: `goosefilms2024`
- After login, you'll be redirected to the admin panel

### 3. Test Pages
Visit these URLs to test different features:
- `http://localhost:8000/test-everything.html` - Complete system test
- `http://localhost:8000/diagnose.html` - Diagnostic tool
- `http://localhost:8000/members.html` - Members page
- `http://localhost:8000/voting.html` - Voting system
- `http://localhost:8000/careers.html` - Careers page

### 4. Quick Test Script
Run this in Terminal to start server and open browser:

```bash
cd "/Users/pradyumn/Desktop/GooseFilms "
python3 -m http.server 8000 &
sleep 2
open http://localhost:8000
```

## Troubleshooting

### If the website doesn't load:
1. Check if the port is already in use (try 8080 or 3000)
2. Make sure you're in the correct directory
3. Check Terminal for error messages

### If login doesn't work:
1. Open browser console (F12 or Cmd+Option+I)
2. Check for JavaScript errors
3. Try the test pages first

### If Firebase doesn't work:
1. Check internet connection
2. Verify Firebase configuration in `config.js`
3. Check browser console for Firebase errors

## Stop the Server
Press `Ctrl+C` in Terminal to stop the server.