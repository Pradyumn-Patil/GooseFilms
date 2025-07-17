// Schedule Manager for handling movie schedules and showtimes
class ScheduleManager {
    constructor() {
        this.schedules = {};
        this.theaters = CONFIG.THEATERS;
        this.initialized = false;
        this.initPromise = this.init();
    }

    async init() {
        if (this.initialized) {
            return this.schedules;
        }
        
        try {
            await this.loadSchedules();
            this.initialized = true;
            console.log('ScheduleManager initialized with schedules:', this.schedules);
            return this.schedules;
        } catch (error) {
            console.error('Error initializing ScheduleManager:', error);
            this.initialized = true; // Mark as initialized even on error to prevent infinite loops
            return {};
        }
    }

    // Ensure initialization before any operation
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initPromise;
        }
        return this.schedules;
    }

    // Load schedules from file storage
    async loadSchedules() {
        try {
            this.schedules = await fileStorage.loadSchedules();
            console.log('Loaded schedules from storage:', this.schedules);
            return this.schedules;
        } catch (error) {
            console.error('Error loading schedules:', error);
            this.schedules = {};
            return {};
        }
    }

    // Save schedules to file storage
    async saveSchedules() {
        try {
            await fileStorage.saveSchedules(this.schedules);
            return true;
        } catch (error) {
            console.error('Error saving schedules:', error);
            return false;
        }
    }

    // Add a movie to schedule for a specific date
    async addMovieToSchedule(date, movie, showtimes, theaterId) {
        const dateKey = this.formatDateKey(date);
        
        if (!this.schedules[dateKey]) {
            this.schedules[dateKey] = [];
        }

        const theater = this.theaters.find(t => t.id === theaterId);
        
        const scheduleEntry = {
            id: Date.now() + Math.random(),
            movie: movie,
            showtimes: showtimes,
            theater: theater,
            dateAdded: new Date().toISOString()
        };

        this.schedules[dateKey].push(scheduleEntry);
        await this.saveSchedules();
        return scheduleEntry;
    }

    // Remove a movie from schedule
    async removeMovieFromSchedule(date, scheduleId) {
        const dateKey = this.formatDateKey(date);
        
        if (this.schedules[dateKey]) {
            this.schedules[dateKey] = this.schedules[dateKey].filter(
                entry => entry.id !== scheduleId
            );
            
            if (this.schedules[dateKey].length === 0) {
                delete this.schedules[dateKey];
            }
            
            await this.saveSchedules();
            return true;
        }
        return false;
    }

    // Get scheduled movies for a specific date
    getScheduleForDate(date) {
        const dateKey = this.formatDateKey(date);
        return this.schedules[dateKey] || [];
    }

    // Get all scheduled movies within a date range
    getScheduleForDateRange(startDate, endDate) {
        const result = {};
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = this.formatDateKey(d);
            if (this.schedules[dateKey]) {
                result[dateKey] = this.schedules[dateKey];
            }
        }
        
        return result;
    }

    // Get all movies scheduled for today
    getTodaysMovies() {
        return this.getScheduleForDate(new Date());
    }

    // Get movies for the current week
    getThisWeekMovies() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return this.getScheduleForDateRange(startOfWeek, endOfWeek);
    }

    // Format date as YYYY-MM-DD
    formatDateKey(date) {
        const d = new Date(date);
        return d.getFullYear() + '-' + 
               String(d.getMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getDate()).padStart(2, '0');
    }

    // Format date for display
    formatDisplayDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    // Get available time slots
    getTimeSlots() {
        return [
            "10:00 AM", "12:30 PM", "1:00 PM", "2:30 PM", 
            "4:15 PM", "5:45 PM", "7:30 PM", "8:45 PM", "10:00 PM"
        ];
    }

    // Clear all schedules (admin function)
    async clearAllSchedules() {
        this.schedules = {};
        await this.saveSchedules();
    }

    // Export schedules to CSV file
    exportToCSV() {
        fileStorage.exportSchedules(this.schedules);
    }

    // Import schedules from CSV file
    async importFromCSV(file) {
        try {
            const importedSchedules = await fileStorage.importSchedules(file);
            
            // Merge with existing schedules
            Object.entries(importedSchedules).forEach(([date, daySchedules]) => {
                if (!this.schedules[date]) {
                    this.schedules[date] = [];
                }
                this.schedules[date] = [...this.schedules[date], ...daySchedules];
            });
            
            await this.saveSchedules();
            return true;
        } catch (error) {
            console.error('Error importing schedules:', error);
            return false;
        }
    }

    // Get schedule statistics
    getScheduleStats() {
        const totalDates = Object.keys(this.schedules).length;
        const totalMovies = Object.values(this.schedules).reduce(
            (sum, daySchedule) => sum + daySchedule.length, 0
        );
        
        const upcomingDates = Object.keys(this.schedules).filter(
            date => new Date(date) >= new Date().setHours(0,0,0,0)
        ).length;

        // Calculate movies by theater
        const theaterStats = {};
        Object.values(this.schedules).flat().forEach(schedule => {
            const theaterName = schedule.theater.name;
            theaterStats[theaterName] = (theaterStats[theaterName] || 0) + 1;
        });
        
        return {
            totalScheduledDates: totalDates,
            totalScheduledMovies: totalMovies,
            upcomingDates: upcomingDates,
            theaterStats: theaterStats
        };
    }

    // Get schedule as text format for easy viewing
    getScheduleAsText() {
        let textOutput = '=== MOVIE SCHEDULE ===\n\n';
        
        const sortedDates = Object.keys(this.schedules).sort();
        
        sortedDates.forEach(date => {
            textOutput += `📅 ${this.formatDisplayDate(date)}\n`;
            textOutput += '─'.repeat(50) + '\n';
            
            this.schedules[date].forEach(schedule => {
                textOutput += `🎬 ${schedule.movie.title}\n`;
                textOutput += `   Theater: ${schedule.theater.name}\n`;
                textOutput += `   Times: ${schedule.showtimes.join(', ')}\n`;
                textOutput += `   Rating: ⭐ ${schedule.movie.vote_average || 'N/A'}\n`;
                textOutput += '\n';
            });
            
            textOutput += '\n';
        });
        
        return textOutput;
    }

    // Save schedule as text file
    exportToText() {
        const textData = this.getScheduleAsText();
        const blob = new Blob([textData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `movie_schedule_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Create global instance
const scheduleManager = new ScheduleManager();