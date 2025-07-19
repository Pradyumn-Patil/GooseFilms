// Configuration file for API keys and settings
const CONFIG = {
    TMDB_API_KEY: '92175e435cae9aafe94bc6a82819ec7b',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
    
    // Firebase configuration
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyBnJCp0u5xiiU8JWkvmu5DGLdQK3Jg3ctc",
        authDomain: "goosefilms-3a17f.firebaseapp.com",
        projectId: "goosefilms-3a17f",
        storageBucket: "goosefilms-3a17f.firebasestorage.app",
        messagingSenderId: "757347001514",
        appId: "1:757347001514:web:7ebac73236746e226c1cd3"
    },
    
    // Admin credentials
    ADMIN: {
        username: 'admin',
        password: 'goosefilms2024!'
    },
    
    ADMIN_PASSWORD: 'goosefilms2024!', // Keep for backwards compatibility
    
    THEATERS: [
        {
            id: 1,
            name: "Prada and Jimin's WG",
            address: "Stuisie 48, 0602"
        },
        {
            id: 2,
            name: "GooseFilms Downtown",
            address: "123 Cinema Boulevard, Downtown District"
        },
        {
            id: 3,
            name: "GooseFilms Westside", 
            address: "456 Entertainment Ave, West End"
        },
        {
            id: 4,
            name: "GooseFilms IMAX",
            address: "789 Premium Plaza, City Center"
        },
        {
            id: 5,
            name: "GooseFilms Drive-In",
            address: "321 Sunset Drive, Suburban Area"
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}