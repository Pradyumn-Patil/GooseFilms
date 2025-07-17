// Configuration file for API keys and settings
const CONFIG = {
    TMDB_API_KEY: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmE5YWVlMzg4ZGY0ZTExYjQ4ZTMwZGQ4MzQwMDc3ZCIsInN1YiI6IjY3NDYyNjcyNmI0NmUwMTEzYjFjOGRjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O8Gn_KoCFsAqOo-lrqzVJJzHHJQG1RVEqV0H_-nfzDk', // Working TMDB API key
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
    
    THEATERS: [
        {
            name: "GooseFilms Downtown",
            address: "123 Cinema Boulevard, Downtown District"
        },
        {
            name: "GooseFilms Westside",
            address: "456 Entertainment Ave, West End"
        },
        {
            name: "GooseFilms IMAX",
            address: "789 Premium Plaza, City Center"
        },
        {
            name: "GooseFilms Drive-In",
            address: "321 Sunset Drive, Suburban Area"
        }
    ],
    
    ADMIN_PASSWORD: 'goosefilms2024!' // Production password
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}