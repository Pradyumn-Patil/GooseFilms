# GooseFilms Security Guide

## ⚠️ IMPORTANT SECURITY NOTICE

This application currently has several security vulnerabilities that need to be addressed before deployment to production.

## Critical Issues to Fix:

### 1. API Keys Exposed in Client-Side Code
**Problem**: Firebase and TMDB API keys are visible in `config.js`
**Solution**: 
- Use environment variables
- Implement a backend proxy for API calls
- Use Firebase Security Rules

### 2. Hardcoded Admin Credentials
**Problem**: Admin username/password visible in JavaScript
**Solution**:
- Implement proper authentication (Firebase Auth, OAuth, etc.)
- Use server-side session management
- Store hashed passwords only

### 3. No Input Validation
**Problem**: User inputs are not sanitized
**Solution**:
- Validate all form inputs
- Sanitize data before display
- Use prepared statements for any database queries

## Setup Instructions:

1. **Copy Configuration**
   ```bash
   cp config-example.js config.js
   ```

2. **Add Your API Keys**
   - Get TMDB API key from https://www.themoviedb.org/settings/api
   - Get Firebase config from https://console.firebase.google.com/

3. **Never Commit Sensitive Data**
   ```bash
   # Add to .gitignore
   config.js
   .env
   ```

## Production Deployment Checklist:

- [ ] Move all API calls to backend server
- [ ] Implement proper authentication system
- [ ] Enable Firebase Security Rules
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Add CORS restrictions
- [ ] Remove all console.log statements
- [ ] Minify and obfuscate JavaScript
- [ ] Implement Content Security Policy (CSP)
- [ ] Regular security audits

## Firebase Security Rules Example:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Read-only access for schedules
    match /schedules/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.admins;
    }
    
    // Voting requires authentication
    match /votes/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Environment Variables Setup:

Create a `.env` file:
```
TMDB_API_KEY=your_tmdb_key_here
FIREBASE_API_KEY=your_firebase_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
```

## Server-Side Proxy Example:

```javascript
// server.js (Node.js/Express)
const express = require('express');
const app = express();

app.post('/api/movies/search', authenticate, async (req, res) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${req.body.query}`);
  const data = await response.json();
  res.json(data);
});
```

## Contact

If you find any security vulnerabilities, please report them to the development team immediately.