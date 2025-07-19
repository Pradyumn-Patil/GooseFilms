// Firebase Database (Firestore) operations
class FirebaseDatabase {
    constructor() {
        this.db = null;
        this.schedulesCollection = 'schedules';
        this.listeners = [];
        this.init();
    }

    init() {
        if (window.firebaseUtils && window.firebaseUtils.isFirebaseConfigured()) {
            this.db = window.firebaseUtils.getFirestore();
        }
    }

    // Check if Firebase is available
    isAvailable() {
        return this.db !== null && window.firebaseUtils && window.firebaseUtils.isFirebaseConfigured();
    }

    // Save schedules to Firestore
    async saveSchedules(schedules) {
        if (!this.isAvailable()) {
            console.log('Firebase not available, falling back to local storage');
            return false;
        }

        try {
            // Use batch write for efficiency
            const batch = this.db.batch();
            
            // Delete all existing schedule documents first
            const existingDocs = await this.db.collection(this.schedulesCollection).get();
            existingDocs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            // Add new schedule documents
            Object.entries(schedules).forEach(([date, daySchedules]) => {
                const docRef = this.db.collection(this.schedulesCollection).doc(date);
                batch.set(docRef, {
                    date: date,
                    movies: daySchedules,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            console.log('Schedules saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving to Firestore:', error);
            return false;
        }
    }

    // Load schedules from Firestore
    async loadSchedules() {
        if (!this.isAvailable()) {
            console.log('Firebase not available, falling back to local storage');
            return null;
        }

        try {
            const snapshot = await this.db.collection(this.schedulesCollection).get();
            const schedules = {};
            
            snapshot.forEach(doc => {
                const data = doc.data();
                schedules[doc.id] = data.movies || [];
            });
            
            console.log('Schedules loaded from Firestore:', schedules);
            return schedules;
        } catch (error) {
            console.error('Error loading from Firestore:', error);
            return null;
        }
    }

    // Add a movie to schedule for a specific date
    async addMovieToSchedule(date, scheduleEntry) {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const docRef = this.db.collection(this.schedulesCollection).doc(date);
            const doc = await docRef.get();
            
            let movies = [];
            if (doc.exists) {
                const data = doc.data();
                movies = data.movies || [];
            }
            
            movies.push(scheduleEntry);
            
            await docRef.set({
                date: date,
                movies: movies,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('Movie added to Firestore schedule');
            return true;
        } catch (error) {
            console.error('Error adding movie to Firestore:', error);
            return false;
        }
    }

    // Remove a movie from schedule
    async removeMovieFromSchedule(date, scheduleId) {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const docRef = this.db.collection(this.schedulesCollection).doc(date);
            const doc = await docRef.get();
            
            if (!doc.exists) {
                return false;
            }
            
            const data = doc.data();
            const movies = data.movies || [];
            const updatedMovies = movies.filter(entry => entry.id !== scheduleId);
            
            if (updatedMovies.length === 0) {
                // Delete the document if no movies left
                await docRef.delete();
            } else {
                await docRef.set({
                    date: date,
                    movies: updatedMovies,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            console.log('Movie removed from Firestore schedule');
            return true;
        } catch (error) {
            console.error('Error removing movie from Firestore:', error);
            return false;
        }
    }

    // Get schedule for a specific date
    async getScheduleForDate(date) {
        if (!this.isAvailable()) {
            return [];
        }

        try {
            const doc = await this.db.collection(this.schedulesCollection).doc(date).get();
            
            if (doc.exists) {
                const data = doc.data();
                return data.movies || [];
            }
            
            return [];
        } catch (error) {
            console.error('Error getting schedule from Firestore:', error);
            return [];
        }
    }

    // Listen for real-time updates
    listenForScheduleUpdates(callback) {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            const unsubscribe = this.db.collection(this.schedulesCollection)
                .onSnapshot((snapshot) => {
                    const schedules = {};
                    
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        schedules[doc.id] = data.movies || [];
                    });
                    
                    callback(schedules);
                }, (error) => {
                    console.error('Error listening to Firestore updates:', error);
                });
            
            this.listeners.push(unsubscribe);
            return unsubscribe;
        } catch (error) {
            console.error('Error setting up Firestore listener:', error);
            return null;
        }
    }

    // Unsubscribe all listeners
    unsubscribeAll() {
        this.listeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.listeners = [];
    }

    // Migrate data from local storage to Firestore
    async migrateFromLocalStorage() {
        if (!this.isAvailable()) {
            console.log('Firebase not available for migration');
            return false;
        }

        try {
            // Get data from localStorage
            const localData = localStorage.getItem('movie_schedules');
            if (!localData) {
                console.log('No local data to migrate');
                return false;
            }

            const schedules = JSON.parse(localData);
            
            // Save to Firestore
            await this.saveSchedules(schedules);
            
            console.log('Data migrated from localStorage to Firestore');
            return true;
        } catch (error) {
            console.error('Error migrating data:', error);
            return false;
        }
    }
}

// Create global instance
window.firebaseDatabase = new FirebaseDatabase();