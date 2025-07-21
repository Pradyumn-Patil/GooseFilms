# GooseFilms Project Context for Claude

## Project Overview
GooseFilms is a movie club website with features for scheduling movies, member profiles, voting, and admin management. The site has a cinema/theater theme with purple and gold colors.

## Recent Updates (July 21, 2025)

### 1. Animation System Implementation
- Created comprehensive animation library (`animations.css`, `animations-extras.css`)
- Added JavaScript animation controller (`animations.js`)
- Implemented smooth navigation behavior (`navigation.js`)
- Added performance optimizations and lazy loading (`performance.js`)
- Created loading states and skeleton screens (`loading-states.css`)

### 2. Security Improvements
- Created `config-example.js` for safe configuration management
- Added `SECURITY.md` with security guidelines
- Updated `.gitignore` to prevent committing sensitive files
- Implemented `secureAuth.js` for better authentication
- Added warnings about hardcoded credentials

### 3. Bug Fixes Completed
- ✅ Fixed critical security issues (API keys, hardcoded credentials)
- ✅ Added comprehensive error handling to async functions
- ✅ Fixed undefined function references in members.html
- ✅ Added null checks for DOM element operations
- ✅ Created asset validator for graceful fallback handling
- ✅ Added CSS variable fallbacks
- ✅ Removed debug console.log statements

### 4. Enhanced User Experience
- Parallax scrolling effects on homepage
- 3D card hover effects
- Smooth scroll-triggered animations
- Ripple effects on buttons
- Cinema curtain loading effect
- Floating animation elements
- Back-to-top button with progress bar

## Project Structure
```
GooseFilms/
├── index.html          # Homepage with movie listings
├── members.html        # Member profiles page
├── voting.html         # Movie voting page
├── careers.html        # Join the club page
├── admin.html          # Admin panel
├── login.html          # Admin login
├── assets/             # Images and logos
├── js/                 # JavaScript files
│   ├── firebase.js     # Firebase initialization
│   ├── scheduleManager.js # Movie scheduling logic
│   ├── adminPanel.js   # Admin functionality
│   ├── secureAuth.js   # NEW: Secure authentication
│   ├── assetValidator.js # NEW: Asset validation
│   └── ...
├── animations.css      # NEW: Core animation library
├── animations-extras.css # NEW: Additional effects
├── navigation.js       # NEW: Navigation enhancements
├── performance.js      # NEW: Performance optimizations
└── loading-states.css  # NEW: Loading states

```

## Key Features
1. **Movie Scheduling**: Admin can schedule movies with dates, times, and theaters
2. **Member Profiles**: Display founding members with stats and quotes
3. **Voting System**: Members can vote for next movie
4. **Firebase Integration**: Real-time data sync for schedules
5. **Responsive Design**: Works on all devices
6. **Modern Animations**: Smooth, cinematic-themed animations

## Current State
- Homepage displays scheduled movies or falls back to TMDB "Now Playing"
- Admin panel allows movie scheduling with calendar interface
- Members page shows founding members from configuration
- Voting page has sample movies (needs Firebase integration)
- All pages have enhanced animations and smooth interactions

## Known Issues to Address
1. Voting system needs Firebase integration
2. Some event listeners could use cleanup for memory optimization
3. Production deployment needs environment variables for API keys
4. Firebase security rules need to be implemented

## Development Commands
```bash
# Test locally
python -m http.server 8000

# Or use any local server
npx http-server

# Check for security issues
grep -r "hardcoded" js/
```

## Important Notes
- Always check `config-example.js` for required configuration
- Never commit `config.js` with real API keys
- Test all animations with reduced motion preferences
- Ensure Firebase is properly initialized before testing admin features

## Next Steps
1. Implement Firebase integration for voting system
2. Add proper build process for production
3. Implement server-side API proxy for TMDB calls
4. Add unit tests for critical functions
5. Implement proper CI/CD pipeline