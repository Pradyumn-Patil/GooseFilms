// File-based storage manager for movie schedules
class FileStorage {
    constructor() {
        this.storageFile = 'data/schedules.txt';
        this.theatersFile = 'data/theaters.txt';
        this.ensureDataDirectory();
    }

    // Ensure data directory exists (in a real implementation, this would be server-side)
    ensureDataDirectory() {
        // Note: This is a client-side implementation. In production, you'd need a server.
        console.log('File storage initialized. In production, use a proper server-side implementation.');
    }

    // Save schedules to file (simulated with localStorage for demo)
    async saveSchedules(schedules) {
        try {
            // Convert schedules to CSV format
            const csvData = this.schedulesToCSV(schedules);
            
            // For demo purposes, we'll still use localStorage but format as CSV
            localStorage.setItem('schedules_csv', csvData);
            
            // In production, you would make an API call to save to server
            // await fetch('/api/save-schedules', { 
            //     method: 'POST', 
            //     body: csvData,
            //     headers: { 'Content-Type': 'text/plain' }
            // });
            
            console.log('Schedules saved to file storage');
            return true;
        } catch (error) {
            console.error('Error saving schedules:', error);
            return false;
        }
    }

    // Load schedules from file
    async loadSchedules() {
        try {
            // In production, you would fetch from server
            // const response = await fetch('/api/schedules.csv');
            // const csvData = await response.text();
            
            // For demo, load from localStorage
            const csvData = localStorage.getItem('schedules_csv');
            
            if (!csvData) {
                return {};
            }
            
            return this.csvToSchedules(csvData);
        } catch (error) {
            console.error('Error loading schedules:', error);
            return {};
        }
    }

    // Convert schedules object to CSV format
    schedulesToCSV(schedules) {
        const headers = 'Date,MovieId,MovieTitle,MoviePoster,MovieOverview,MovieRating,MovieGenres,MovieReleaseDate,Showtimes,TheaterId,TheaterName,TheaterAddress,ScheduleId,DateAdded\n';
        
        let csvContent = headers;
        
        Object.entries(schedules).forEach(([date, daySchedules]) => {
            daySchedules.forEach(schedule => {
                const row = [
                    date,
                    schedule.movie.id || '',
                    `"${(schedule.movie.title || '').replace(/"/g, '""')}"`,
                    schedule.movie.poster_path || '',
                    `"${(schedule.movie.overview || '').replace(/"/g, '""')}"`,
                    schedule.movie.vote_average || '',
                    `"${JSON.stringify(schedule.movie.genre_ids || [])}"`,
                    schedule.movie.release_date || '',
                    `"${JSON.stringify(schedule.showtimes)}"`,
                    schedule.theater.id,
                    `"${schedule.theater.name.replace(/"/g, '""')}"`,
                    `"${schedule.theater.address.replace(/"/g, '""')}"`,
                    schedule.id,
                    schedule.dateAdded
                ].join(',');
                
                csvContent += row + '\n';
            });
        });
        
        return csvContent;
    }

    // Convert CSV data back to schedules object
    csvToSchedules(csvData) {
        const lines = csvData.split('\n');
        const schedules = {};
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            try {
                const fields = this.parseCSVLine(line);
                if (fields.length < 14) continue;
                
                const [date, movieId, movieTitle, moviePoster, movieOverview, movieRating, 
                       movieGenres, movieReleaseDate, showtimes, theaterId, theaterName, 
                       theaterAddress, scheduleId, dateAdded] = fields;
                
                if (!schedules[date]) {
                    schedules[date] = [];
                }
                
                // Parse JSON fields more safely
                let parsedGenres = [];
                let parsedShowtimes = [];
                
                try {
                    parsedGenres = JSON.parse(movieGenres || '[]');
                } catch (e) {
                    console.warn('Error parsing movie genres:', movieGenres, e);
                    parsedGenres = [];
                }
                
                try {
                    parsedShowtimes = JSON.parse(showtimes || '[]');
                } catch (e) {
                    console.warn('Error parsing showtimes:', showtimes, e);
                    // Fallback: try to extract showtimes as simple array
                    parsedShowtimes = [showtimes.replace(/["\[\]]/g, '')];
                }
                
                const schedule = {
                    id: parseFloat(scheduleId),
                    movie: {
                        id: parseInt(movieId),
                        title: movieTitle,
                        poster_path: moviePoster,
                        overview: movieOverview,
                        vote_average: parseFloat(movieRating) || 0,
                        genre_ids: parsedGenres,
                        release_date: movieReleaseDate
                    },
                    showtimes: parsedShowtimes,
                    theater: {
                        id: parseInt(theaterId),
                        name: theaterName,
                        address: theaterAddress
                    },
                    dateAdded: dateAdded
                };
                
                schedules[date].push(schedule);
            } catch (error) {
                console.error('Error parsing CSV line:', line, error);
            }
        }
        
        return schedules;
    }

    // Simple CSV parser that handles quoted fields
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // Export schedules as downloadable CSV
    exportSchedules(schedules) {
        const csvData = this.schedulesToCSV(schedules);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `movie_schedules_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Import schedules from CSV file
    async importSchedules(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvData = e.target.result;
                    const schedules = this.csvToSchedules(csvData);
                    resolve(schedules);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// Create global instance
const fileStorage = new FileStorage();