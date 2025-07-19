// File-based storage manager for movie schedules
class FileStorage {
    constructor() {
        this.scheduleFile = 'data/schedules.json';
        this.isLocalEnvironment = this.detectLocalEnvironment();
    }

    // Detect if running locally vs GitHub Pages
    detectLocalEnvironment() {
        return window.location.protocol === 'file:' || 
               window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname === '';
    }

    // Save schedules to JSON file (local only)
    async saveSchedules(schedules) {
        try {
            if (this.isLocalEnvironment) {
                // Local environment: save to localStorage and auto-save to file
                localStorage.setItem('movie_schedules', JSON.stringify(schedules, null, 2));
                
                // Auto-save to data/schedules.json file
                await this.saveToDataFile(schedules);
                
                console.log('Schedules saved locally and to data file.');
                return true;
            } else {
                // GitHub Pages: Read-only mode
                console.log('Cannot save schedules on GitHub Pages. Schedule locally and commit the data file.');
                return false;
            }
        } catch (error) {
            console.error('Error saving schedules:', error);
            return false;
        }
    }

    // Save directly to data/schedules.json and auto-commit
    async saveToDataFile(schedules) {
        try {
            // Create the JSON data
            const jsonData = JSON.stringify(schedules, null, 2);
            
            // For local development, we'll use a file download approach
            // since browsers can't directly write to files for security reasons
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            
            // Auto-download the file (user will need to replace the existing one)
            const a = document.createElement('a');
            a.href = url;
            a.download = 'schedules.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Show auto-commit instructions
            this.showAutoCommitInstructions();
            
        } catch (error) {
            console.error('Error saving to data file:', error);
        }
    }

    // Load schedules from JSON file or localStorage
    async loadSchedules() {
        try {
            if (this.isLocalEnvironment) {
                // Local: Try to load from localStorage first, then from file
                const localData = localStorage.getItem('movie_schedules');
                if (localData) {
                    return JSON.parse(localData);
                }
            }
            
            // Try to load from committed JSON file (works on both local and GitHub Pages)
            try {
                // Add cache-busting parameter for GitHub Pages
                const cacheBuster = new Date().getTime();
                const response = await fetch(`./data/schedules.json?v=${cacheBuster}`);
                if (response.ok) {
                    const schedules = await response.json();
                    console.log('Loaded schedules from committed data file:', schedules);
                    return schedules;
                } else {
                    console.log('Failed to fetch schedules.json, status:', response.status);
                }
            } catch (fetchError) {
                console.log('Error fetching schedule data:', fetchError);
                console.log('No committed schedule data found, starting fresh');
            }
            
            return {};
        } catch (error) {
            console.error('Error loading schedules:', error);
            return {};
        }
    }

    // Export schedules as JSON file for GitHub commit
    exportSchedulesJSON(schedules) {
        const jsonData = JSON.stringify(schedules, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schedules.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show instructions to user
        this.showCommitInstructions();
    }

    // Show instructions for committing the data file
    showCommitInstructions() {
        if (this.isLocalEnvironment) {
            const instructions = `
📁 SCHEDULE DATA SAVED!

To update your GitHub Pages website with the new schedule:

1. A 'schedules.json' file has been downloaded
2. Move this file to: /data/schedules.json in your project
3. Commit and push to GitHub:
   
   git add data/schedules.json
   git commit -m "Update movie schedules"
   git push

Your scheduled movies will then appear on the live website!
            `;
            
            console.log(instructions);
            
            // Optional: Show popup with instructions
            if (confirm('Schedule saved! Click OK to see instructions for updating your live website.')) {
                alert(instructions);
            }
        }
    }

    // Show instructions for automatic workflow
    showAutoCommitInstructions() {
        if (this.isLocalEnvironment) {
            const instructions = `
🎬 SCHEDULE UPDATED!

AUTOMATIC WORKFLOW:
1. Replace /data/schedules.json with the downloaded file
2. Run the auto-commit script:
   
   ./auto-commit.sh

This will automatically commit and push your changes to GitHub Pages!

MANUAL ALTERNATIVE:
   git add data/schedules.json
   git commit -m "Update movie schedules"
   git push
            `;
            
            console.log(instructions);
            
            // Show a simplified popup
            if (confirm('Schedule saved! The schedules.json file has been downloaded.\n\nReplace /data/schedules.json with the downloaded file, then run "./auto-commit.sh" to automatically update your live website.\n\nClick OK for more details.')) {
                alert(instructions);
            }
        }
    }

    // Export schedules as downloadable CSV (for backup)
    exportSchedules(schedules) {
        const csvData = this.schedulesToCSV(schedules);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `movie_schedules_backup_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Convert schedules to CSV format for backup
    schedulesToCSV(schedules) {
        const headers = 'Date,MovieTitle,MovieRating,Showtimes,TheaterName,TheaterAddress\n';
        let csvContent = headers;
        
        Object.entries(schedules).forEach(([date, daySchedules]) => {
            daySchedules.forEach(schedule => {
                const row = [
                    date,
                    `"${(schedule.movie.title || '').replace(/"/g, '""')}"`,
                    schedule.movie.vote_average || '',
                    `"${(schedule.showtimes || []).join(', ')}"`,
                    `"${schedule.theater.name.replace(/"/g, '""')}"`,
                    `"${schedule.theater.address.replace(/"/g, '""')}"`,
                ].join(',');
                csvContent += row + '\n';
            });
        });
        
        return csvContent;
    }

    // Get environment info for admin panel
    getEnvironmentInfo() {
        return {
            isLocal: this.isLocalEnvironment,
            canSave: this.isLocalEnvironment,
            dataSource: this.isLocalEnvironment ? 'localStorage + file export' : 'committed data file',
            hostname: window.location.hostname || 'file://',
            protocol: window.location.protocol
        };
    }
}

// Create global instance
const fileStorage = new FileStorage();