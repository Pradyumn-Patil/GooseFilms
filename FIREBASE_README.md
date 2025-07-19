# GooseFilms Firebase Integration Guide

## Overview
GooseFilms now supports Firebase for real-time data synchronization and authentication. The system is designed with backward compatibility - it works with Firebase when configured, but falls back to local storage when Firebase is not set up.

## Features
- ✅ Real-time movie schedule synchronization
- ✅ Secure admin authentication
- ✅ Automatic data persistence
- ✅ Works both locally and on GitHub Pages
- ✅ Backward compatible with local storage

## Quick Start

### 1. Set Up Firebase
1. Visit [firebase-setup.html](firebase-setup.html) in your browser
2. Follow the step-by-step guide to create your Firebase project
3. Copy your Firebase configuration

### 2. Configure Your Project
Update `config.js` with your Firebase configuration:

```javascript
FIREBASE_CONFIG: {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
}
```

### 3. Create Admin User
- Use the "Create Admin User" button in firebase-setup.html
- Enter your preferred username (e.g., "admin")
- Enter a secure password

### 4. Login
- Username: Your chosen username (e.g., "admin")
- Password: Your Firebase password

## How It Works

### Authentication Flow
1. **Firebase Auth** (when configured)
   - Username/password authentication
   - Username mapped to internal email for Firebase Auth
   - Secure session management
   - Admin role verification

2. **Local Auth** (fallback)
   - Uses hardcoded credentials from config.js
   - Stores session in localStorage

### Data Storage
1. **Firebase Firestore** (when configured)
   - Real-time synchronization
   - Structured document storage
   - Automatic conflict resolution

2. **Local Storage** (fallback)
   - JSON file storage
   - Manual download/commit workflow

## File Structure
```
js/
├── firebase.js          # Firebase initialization
├── firebaseAuth.js      # Authentication logic
├── firebaseDatabase.js  # Database operations
└── scheduleManager.js   # Updated to use Firebase
```

## Migration
Existing schedules are automatically migrated to Firebase on first load. To manually migrate:
1. Visit firebase-setup.html
2. Click "Migrate Local Data"

## Security Rules
The following Firestore security rules are applied:
- **Schedules**: Public read, authenticated write
- **Users**: Private (only accessible by owner)
- **Usernames**: Public read (for login), authenticated write

## Troubleshooting

### Firebase not working?
1. Check browser console for errors
2. Verify Firebase configuration in config.js
3. Ensure Firestore and Authentication are enabled
4. Check security rules in Firebase Console

### Can't login?
1. Try local credentials first (admin/goosefilms2024!)
2. Check if Firebase user exists with your username
3. Ensure you created the admin user through firebase-setup.html

### Data not syncing?
1. Check network connection
2. Verify Firestore permissions
3. Look for errors in browser console

## Benefits
- **No more manual commits** for schedule updates
- **Real-time updates** across all devices
- **Secure authentication** with proper user management
- **Scalable** for future features
- **Free tier** supports up to 50K reads/20K writes per day

## Next Steps
- Enable Firebase Hosting for deployment
- Add user registration for multiple admins
- Implement booking system with user accounts
- Add email notifications for schedule changes