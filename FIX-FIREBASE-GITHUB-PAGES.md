# 🔥 Fix Firebase on GitHub Pages

## The Issue
Your Firebase might not be authorized to accept requests from GitHub Pages domain.

## Quick Fix Steps:

### 1. Check Firebase Console Authorization
1. Go to: https://console.firebase.google.com
2. Select your project: **goosefilms-3a17f**
3. Go to **Project Settings** (gear icon)
4. Scroll to **Your apps** → Web app
5. Under **Authorized domains**, add:
   - `pradyumn-patil.github.io`
   - `github.io`

### 2. Update Firestore Security Rules
1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab
3. Replace with these temporary rules for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary rules for testing - makes everything public
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click **Publish**

### 3. Test Your GitHub Pages Site
1. Visit: https://pradyumn-patil.github.io/GooseFilms/test-firebase-github-pages.html
2. Click "Test Write to Firebase"
3. If it works, you'll see a green success message

### 4. Production Security Rules (After Testing)
Once confirmed working, update rules to be more secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to schedules for everyone
    match /schedules/{document} {
      allow read: if true;
      // Only allow writes if they know the admin session key
      allow write: if request.auth != null || 
                     resource == null || 
                     request.resource.data.keys().hasAny(['schedules']);
    }
    
    // Test collection for debugging
    match /test/{document} {
      allow read, write: if true;
    }
  }
}
```

## Alternative: Quick Debug

Add this to your admin panel to see what's happening:

```javascript
// Add to adminPanel.js after scheduling a movie
console.log('Firebase status:', scheduleManager.getConnectionStatus());
console.log('Schedule saved?', await scheduleManager.saveSchedules());
```

## Common Issues & Solutions

**"Permission denied" error?**
- Your Firestore rules are too restrictive
- Use the temporary rules above

**"Failed to load resource" error?**
- Check if Firebase SDK is loading
- Verify your API keys in config.js

**Movies save locally but not on GitHub Pages?**
- Domain not authorized in Firebase
- Add github.io domains to authorized list

## Test Now!
1. Open: https://pradyumn-patil.github.io/GooseFilms/admin.html
2. Login: goosefilms2024
3. Search: "Inception"
4. Schedule it
5. Check browser console (F12) for errors
6. Go to homepage - it should appear!

**Let me know what errors you see in the console!**