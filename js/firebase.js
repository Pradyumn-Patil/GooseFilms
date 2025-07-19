// Firebase initialization and configuration
let firebaseApp = null;
let db = null;

// Initialize Firebase
function initializeFirebase() {
    if (!firebaseApp) {
        try {
            // Check if Firebase config is provided
            if (!CONFIG.FIREBASE_CONFIG.apiKey || CONFIG.FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
                console.warn('Firebase configuration not set. Please update CONFIG.FIREBASE_CONFIG in config.js');
                console.warn('Visit https://console.firebase.google.com to create a project and get your configuration');
                return false;
            }
            
            // Initialize Firebase app
            firebaseApp = firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
            
            // Get Firebase services (only Firestore, no Auth)
            db = firebase.firestore();
            
            // Enable offline persistence for Firestore
            db.enablePersistence()
                .catch((err) => {
                    if (err.code === 'failed-precondition') {
                        console.warn('Firestore persistence failed: Multiple tabs open');
                    } else if (err.code === 'unimplemented') {
                        console.warn('Firestore persistence not available in this browser');
                    }
                });
            
            console.log('Firebase initialized successfully (Firestore only)');
            return true;
        } catch (error) {
            console.error('Error initializing Firebase:', error);
            return false;
        }
    }
    return true;
}

// Check if Firebase is configured
function isFirebaseConfigured() {
    return CONFIG.FIREBASE_CONFIG.apiKey && CONFIG.FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
}

// Get Firebase Auth instance (not used in custom auth)
function getAuth() {
    console.warn('Firebase Auth is not used. Using custom Firestore-based authentication.');
    return null;
}

// Get Firestore instance
function getFirestore() {
    if (!db) {
        initializeFirebase();
    }
    return db;
}

// Export functions for use in other files
window.firebaseUtils = {
    initializeFirebase,
    isFirebaseConfigured,
    getAuth,
    getFirestore
};

// Initialize Firebase when the script loads
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});