// File Storage Compatibility Layer
// This file now only provides compatibility for legacy code
// All actual storage is handled by Firebase through scheduleManager.js

class FileStorage {
    constructor() {
        console.log('FileStorage initialized - Note: All storage is now handled by Firebase');
    }

    // Legacy method - no longer saves to files
    async saveSchedules() {
        console.warn('FileStorage.saveSchedules() is deprecated. Use scheduleManager instead.');
        return false;
    }

    // Legacy method - no longer loads from files
    async loadSchedules() {
        console.warn('FileStorage.loadSchedules() is deprecated. Use scheduleManager instead.');
        return {};
    }

    // Legacy method - no longer exports
    exportSchedulesJSON() {
        console.warn('File export is no longer needed. All data is stored in Firebase.');
    }

    // Legacy method - no longer needed
    exportSchedules() {
        console.warn('File export is no longer needed. All data is stored in Firebase.');
    }

    // Get environment info
    getEnvironmentInfo() {
        return {
            isLocal: false, // Always use Firebase
            canSave: true,  // Can save if Firebase is configured
            dataSource: 'Firebase Firestore',
            hostname: window.location.hostname || 'localhost',
            protocol: window.location.protocol
        };
    }
}

// Create global instance for compatibility
const fileStorage = new FileStorage();