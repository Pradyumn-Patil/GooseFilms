// GooseFilms Configuration Example
// Copy this file to config.js and fill in your actual values
// NEVER commit config.js to version control!

const CONFIG = {
    // TMDB API Configuration
    TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    
    // Firebase Configuration
    // Get these values from your Firebase Console
    FIREBASE_CONFIG: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    },
    
    // Application Settings
    THEATERS: [
        { name: "AMC Century City", address: "10250 Santa Monica Blvd" },
        { name: "Regal LA Live", address: "1000 W Olympic Blvd" },
        { name: "TCL Chinese Theatre", address: "6925 Hollywood Blvd" },
        { name: "Home Theater", address: "Your Living Room" }
    ],
    
    // Feature Flags
    FEATURES: {
        enableAuth: true,
        enableVoting: true,
        enableAdmin: true,
        debugMode: false
    },
    
    // Cache Settings
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    
    // Security Settings
    // IMPORTANT: These should be environment variables in production
    // This is just for local development
    SECURE_ADMIN_ENDPOINT: '/api/admin/auth', // Server endpoint for admin auth
    SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
};

// Instructions for deployment:
// 1. Use environment variables for all sensitive data
// 2. Implement server-side authentication
// 3. Use a secrets management service
// 4. Enable CORS only for your domain
// 5. Implement rate limiting
// 6. Use HTTPS in production

// Example of checking for required config:
if (typeof CONFIG.TMDB_API_KEY === 'undefined' || CONFIG.TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
    console.error('Please configure your API keys in config.js');
    console.info('Copy config-example.js to config.js and add your keys');
}