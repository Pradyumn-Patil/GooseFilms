// Movie API service for TMDB integration
class MovieAPI {
    constructor() {
        this.apiKey = CONFIG.TMDB_API_KEY;
        this.baseUrl = CONFIG.TMDB_BASE_URL;
        this.imageBaseUrl = CONFIG.IMAGE_BASE_URL;
    }

    async makeRequest(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        url.searchParams.append('api_key', this.apiKey);
        url.searchParams.append('language', 'en-US');
        
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async fetchGenres() {
        try {
            const data = await this.makeRequest('/genre/movie/list');
            const genreMap = {};
            data.genres.forEach(genre => {
                genreMap[genre.id] = genre.name;
            });
            return genreMap;
        } catch (error) {
            console.error('Error fetching genres:', error);
            return {};
        }
    }

    async fetchNowPlayingMovies(page = 1) {
        try {
            const data = await this.makeRequest('/movie/now_playing', { page });
            return data.results;
        } catch (error) {
            console.error('Error fetching now playing movies:', error);
            return [];
        }
    }

    async searchMovies(query, page = 1) {
        try {
            const data = await this.makeRequest('/search/movie', { query, page });
            return data.results;
        } catch (error) {
            console.error('Error searching movies:', error);
            return [];
        }
    }

    async getMovieDetails(movieId) {
        try {
            return await this.makeRequest(`/movie/${movieId}`);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }

    getImageUrl(posterPath, size = 'w500') {
        return posterPath ? `https://image.tmdb.org/t/p/${size}${posterPath}` : null;
    }
}

// Create global instance
const movieAPI = new MovieAPI();