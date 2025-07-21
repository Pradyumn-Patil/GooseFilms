// Schedule Manager for handling movie schedules with Firebase
class ScheduleManager {
    constructor() {
        this.schedules = {};
        this.theaters = CONFIG.THEATERS;
        this.initialized = false;
        this.db = null;
        this.initPromise = this.init();
    }

    async init() {
        if (this.initialized) {
            return this.schedules;
        }
        
        try {
            // Initialize Firebase connection
            if (window.firebaseUtils && window.firebaseUtils.isFirebaseConfigured()) {
                this.db = window.firebaseUtils.getFirestore();
                await this.loadSchedules();
                this.initialized = true;
            } else {
                console.warn('Firebase not configured. Schedule management will not persist.');
                this.initialized = true;
            }
            return this.schedules;
        } catch (error) {
            console.error('Error initializing ScheduleManager:', error);
            this.handleError('Failed to initialize schedule manager', error);
            this.initialized = true;
            return {};
        }
    }

    // Handle errors with user-friendly messages
    handleError(message, error) {
        // Log detailed error for debugging
        console.error(`${message}:`, error);
        
        // Show user-friendly notification
        if (window.showToast) {
            window.showToast(`⚠️ ${message}`, 'error');
        } else {
            // Fallback alert if toast not available
            alert(`Error: ${message}`);
        }
        
        // Dispatch error event for UI handling
        window.dispatchEvent(new CustomEvent('scheduleError', {
            detail: { message, error }
        }));
    }

    // Ensure initialization before any operation
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initPromise;
        }
        return this.schedules;
    }

    // Load schedules from Firebase
    async loadSchedules() {
        if (!this.db) {
            console.warn('Firebase not available');
            return {};
        }

        try {
            const schedulesDoc = await this.db.collection('schedules').doc('movieSchedules').get();
            
            if (schedulesDoc.exists) {
                this.schedules = schedulesDoc.data().schedules || {};
            } else {
                // Create initial document if it doesn't exist
                this.schedules = {};
                await this.saveSchedules();
            }
            
            // Set up real-time listener
            this.setupRealtimeListener();
            
            return this.schedules;
        } catch (error) {
            console.error('Error loading schedules from Firebase:', error);
            // Show user-friendly error message
            this.handleError('Failed to load movie schedules. Please refresh the page.', error);
            this.schedules = {};
            return {};
        }
    }

    // Setup real-time listener for schedule updates
    setupRealtimeListener() {
        if (!this.db) return;

        this.db.collection('schedules').doc('movieSchedules')
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const newSchedules = doc.data().schedules || {};
                    this.schedules = newSchedules;
                    
                    // Dispatch custom event for UI updates
                    window.dispatchEvent(new CustomEvent('schedulesUpdated', { 
                        detail: { schedules: this.schedules } 
                    }));
                }
            }, (error) => {
                console.error('Error in real-time listener:', error);
            });
    }

    // Save schedules to Firebase
    async saveSchedules() {
        if (!this.db) {
            console.warn('Firebase not available. Changes will not be saved.');
            return false;
        }

        try {
            await this.db.collection('schedules').doc('movieSchedules').set({
                schedules: this.schedules,
                lastUpdated: new Date().toISOString(),
                updatedBy: 'admin' // You can enhance this with actual user info
            });
            
            return true;
        } catch (error) {
            console.error('Error saving schedules to Firebase:', error);
            return false;
        }
    }

    // Add a movie to schedule for a specific date
    async addMovieToSchedule(date, movie, showtimes, theaterId) {
        try {
            await this.ensureInitialized();
            
            // Validate inputs
            if (!date || !movie || !showtimes || !theaterId) {
                throw new Error('Missing required parameters');
            }
            
            const dateKey = this.formatDateKey(date);
            
            if (!this.schedules[dateKey]) {
                this.schedules[dateKey] = [];
            }

            const theater = this.theaters.find(t => t.id === theaterId);
            if (!theater) {
                throw new Error('Invalid theater ID');
            }
            
            const scheduleEntry = {
                id: Date.now() + Math.random(),
                movie: movie,
                showtimes: showtimes,
                theater: theater,
                dateAdded: new Date().toISOString()
            };

            this.schedules[dateKey].push(scheduleEntry);
            
            const saved = await this.saveSchedules();
            if (!saved) {
                throw new Error('Failed to save schedule');
            }
            
            return scheduleEntry;
        } catch (error) {
            console.error('Error adding movie to schedule:', error);
            this.handleError('Failed to add movie to schedule', error);
            throw error;
        }
    }

    // Remove a movie from schedule
    async removeMovieFromSchedule(date, scheduleId) {
        try {
            await this.ensureInitialized();
            
            if (!date || !scheduleId) {
                throw new Error('Missing required parameters');
            }
            
            const dateKey = this.formatDateKey(date);
            
            if (this.schedules[dateKey]) {
                const originalLength = this.schedules[dateKey].length;
                this.schedules[dateKey] = this.schedules[dateKey].filter(
                    entry => entry.id !== scheduleId
                );
                
                if (this.schedules[dateKey].length === originalLength) {
                    throw new Error('Schedule entry not found');
                }
                
                if (this.schedules[dateKey].length === 0) {
                    delete this.schedules[dateKey];
                }
                
                const saved = await this.saveSchedules();
                if (!saved) {
                    throw new Error('Failed to save changes');
                }
                
                return true;
            }
            throw new Error('No schedules found for this date');
        } catch (error) {
            console.error('Error removing movie from schedule:', error);
            this.handleError('Failed to remove movie from schedule', error);
            throw error;
        }
    }

    // Get scheduled movies for a specific date
    getScheduleForDate(date) {
        // This needs to be synchronous for the calendar rendering
        const dateKey = this.formatDateKey(date);
        return this.schedules[dateKey] || [];
    }

    // Get all scheduled movies within a date range
    async getScheduleForDateRange(startDate, endDate) {
        await this.ensureInitialized();
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

    // Get all scheduled movies
    async getAllSchedules() {
        await this.ensureInitialized();
        return this.schedules;
    }

    // Clear all schedules
    async clearAllSchedules() {
        await this.ensureInitialized();
        this.schedules = {};
        await this.saveSchedules();
    }

    // Clear schedules for a specific date
    async clearScheduleForDate(date) {
        await this.ensureInitialized();
        const dateKey = this.formatDateKey(date);
        
        if (this.schedules[dateKey]) {
            delete this.schedules[dateKey];
            await this.saveSchedules();
            return true;
        }
        return false;
    }

    // Format date to YYYY-MM-DD key
    formatDateKey(date) {
        if (typeof date === 'string') {
            return date;
        }
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }

    // Format date for display
    formatDisplayDate(dateKey) {
        const date = new Date(dateKey + 'T12:00:00');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Check if Firebase is available
    isFirebaseAvailable() {
        return this.db !== null;
    }

    // Get connection status
    getConnectionStatus() {
        return {
            firebase: this.isFirebaseAvailable(),
            initialized: this.initialized,
            schedulesCount: Object.keys(this.schedules).length
        };
    }
    
    // Get available time slots
    getTimeSlots() {
        return [
            '10:00 AM', '12:30 PM', '3:00 PM', '5:30 PM', 
            '7:00 PM', '8:30 PM', '10:00 PM', '11:30 PM'
        ];
    }
}

// Create global instance
const scheduleManager = new ScheduleManager();
window.scheduleManager = scheduleManager;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = scheduleManager;
}