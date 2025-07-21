// Admin Panel JavaScript functionality
class AdminPanel {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.selectedMovie = null;
        this.selectedTimes = [];
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        try {
            this.checkAuth();
            this.setupEventListeners();
            this.populateTheaters();
            this.populateTimeSlots();
            this.renderCalendar();
            this.updateSelectedDateDisplay();
            this.loadScheduleForSelectedDate();
            this.checkFirebaseStatus();
            
            // Listen for real-time updates
            window.addEventListener('schedulesUpdated', () => {
                this.loadScheduleForSelectedDate();
            });
            
            // Listen for schedule errors
            window.addEventListener('scheduleError', (event) => {
                this.showError(event.detail.message);
            });
        } catch (error) {
            console.error('Failed to initialize admin panel:', error);
            this.showError('Failed to initialize admin panel', error);
        }
    }

    checkAuth() {
        try {
            // Use simple auth instead of old method
            if (!window.simpleAuth || !window.simpleAuth.isAuthenticated()) {
                this.redirectToLogin();
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    // Show error messages to user
    showError(message, error = null) {
        if (error) {
            console.error(message, error);
        }
        
        // Create or update error toast
        let errorToast = document.getElementById('error-toast');
        if (!errorToast) {
            errorToast = document.createElement('div');
            errorToast.id = 'error-toast';
            errorToast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #DC2626;
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            `;
            document.body.appendChild(errorToast);
        }
        
        errorToast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">⚠️</span>
                <div>
                    <div style="font-weight: 600;">${message}</div>
                    ${error ? `<div style="font-size: 0.85em; opacity: 0.9; margin-top: 4px;">Check console for details</div>` : ''}
                </div>
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorToast) {
                errorToast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => errorToast.remove(), 300);
            }
        }, 5000);
    }

    setupEventListeners() {
        const searchBox = document.getElementById('movieSearch');
        if (!searchBox) {
            console.error('Movie search box not found');
            return;
        }
        
        searchBox.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.searchMovies(e.target.value);
            }, 500);
        });
    }

    populateTheaters() {
        const select = document.getElementById('theaterSelect');
        if (!select) {
            console.error('Theater select element not found');
            return;
        }
        
        select.innerHTML = '';
        
        if (!CONFIG || !CONFIG.THEATERS) {
            console.error('Theater configuration not found');
            return;
        }
        
        CONFIG.THEATERS.forEach(theater => {
            const option = document.createElement('option');
            option.value = theater.id;
            option.textContent = theater.name;
            select.appendChild(option);
        });
    }

    populateTimeSlots() {
        const container = document.getElementById('timeSlots');
        if (!container) {
            console.error('Time slots container not found');
            return;
        }
        
        container.innerHTML = '';
        
        if (!scheduleManager || typeof scheduleManager.getTimeSlots !== 'function') {
            console.error('Schedule manager not initialized properly');
            return;
        }
        
        const timeSlots = scheduleManager.getTimeSlots();
        if (!Array.isArray(timeSlots)) {
            console.error('Invalid time slots data');
            return;
        }
        
        timeSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            slot.onclick = () => this.toggleTimeSlot(slot, time);
            container.appendChild(slot);
        });
    }

    toggleTimeSlot(element, time) {
        element.classList.toggle('selected');
        
        if (this.selectedTimes.includes(time)) {
            this.selectedTimes = this.selectedTimes.filter(t => t !== time);
        } else {
            this.selectedTimes.push(time);
        }
    }

    async searchMovies(query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) {
            console.error('Search results container not found');
            this.showError('Search interface not properly initialized');
            return;
        }
        
        // Ensure container is visible
        resultsContainer.style.display = 'block';
        
        if (!query || !query.trim()) {
            resultsContainer.innerHTML = '<p>Start typing to search for movies...</p>';
            return;
        }

        resultsContainer.innerHTML = '<p>Searching...</p>';

        try {
            const movies = await movieAPI.searchMovies(query);
            
            if (!Array.isArray(movies)) {
                throw new Error('Invalid response from movie API');
            }
            
            this.displaySearchResults(movies);
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <p>⚠️ Error searching movies</p>
                    <p style="font-size: 0.9em; opacity: 0.8;">Please check your internet connection and try again.</p>
                </div>
            `;
            console.error('Search error:', error);
            this.showError('Failed to search movies', error);
        }
    }

    displaySearchResults(movies) {
        const container = document.getElementById('searchResults');
        
        if (!container) {
            console.error('Search results container not found');
            return;
        }
        
        if (!movies || movies.length === 0) {
            container.innerHTML = '<p>No movies found.</p>';
            return;
        }

        // Clear container
        container.innerHTML = '';
        
        // Create movie items with proper event listeners
        movies.slice(0, 10).forEach((movie, index) => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie-search-item';
            movieDiv.style.cursor = 'pointer';
            
            movieDiv.innerHTML = `
                <div class="movie-poster-small" style="background-image: url('${movieAPI.getImageUrl(movie.poster_path) || ''}')">
                    ${!movie.poster_path ? '🎬' : ''}
                </div>
                <div class="movie-info-small">
                    <div class="movie-title-small">${movie.title}</div>
                    <div class="movie-year">${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</div>
                    <div class="movie-rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</div>
                </div>
            `;
            
            // Add click event listener
            movieDiv.addEventListener('click', () => {
                this.selectMovieForScheduling(movie);
            });
            
            container.appendChild(movieDiv);
        });
    }

    selectMovieForScheduling(movie) {
        this.selectedMovie = movie;
        this.showScheduleForm();
        this.displaySelectedMovie();
    }

    showScheduleForm() {
        const form = document.getElementById('scheduleForm');
        if (form) {
            // Clear search results to make room
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
            
            // Show the form
            form.style.display = 'block';
            form.style.visibility = 'visible';
            form.style.opacity = '1';
            
            // Force a reflow to ensure the form is rendered
            form.offsetHeight;
            
            // Scroll to form
            setTimeout(() => {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            
                
            // Show success notification
            if (window.showNotification) {
                showNotification('Movie selected! Fill in the details below.', 'info');
            }
        } else {
            console.error('Schedule form not found!');
            alert('Error: Schedule form not found. Please refresh the page.');
        }
    }

    hideScheduleForm() {
        const form = document.getElementById('scheduleForm');
        if (form) {
            form.style.display = 'none';
        }
        
        // Show search results again
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'block';
        }
        
        this.selectedMovie = null;
        this.selectedTimes = [];
        this.clearTimeSlotSelections();
    }

    displaySelectedMovie() {
        const container = document.getElementById('selectedMovieInfo');
        if (!container) {
            console.error('selectedMovieInfo container not found');
            return;
        }
        
        if (!this.selectedMovie) {
            console.error('No movie selected');
            return;
        }

        
        container.innerHTML = `
            <div style="display: flex; gap: 15px; margin-bottom: 15px; padding: 15px; background: var(--apple-tertiary-background); border-radius: 8px; border: 1px solid var(--apple-gray-3);">
                <div style="width: 60px; height: 90px; background-image: url('${movieAPI.getImageUrl(this.selectedMovie.poster_path) || ''}'); background-size: cover; background-position: center; border-radius: 4px; background-color: #ddd; display: flex; align-items: center; justify-content: center;">
                    ${!this.selectedMovie.poster_path ? '🎬' : ''}
                </div>
                <div>
                    <h4 style="margin: 0 0 8px 0; color: var(--apple-label);">${this.selectedMovie.title}</h4>
                    <p style="margin: 4px 0; color: var(--apple-secondary-label);">Release: ${this.selectedMovie.release_date ? new Date(this.selectedMovie.release_date).getFullYear() : 'N/A'}</p>
                    <p style="margin: 4px 0; color: var(--apple-secondary-label);">Rating: ⭐ ${this.selectedMovie.vote_average ? this.selectedMovie.vote_average.toFixed(1) : 'N/A'}</p>
                </div>
            </div>
        `;
    }

    clearTimeSlotSelections() {
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });
    }

    async scheduleMovie() {
        if (!this.selectedMovie) {
            alert('Please select a movie first.');
            return;
        }

        if (this.selectedTimes.length === 0) {
            alert('Please select at least one showtime.');
            return;
        }

        const theaterId = parseInt(document.getElementById('theaterSelect').value);
        
        try {
            await scheduleManager.addMovieToSchedule(
                this.selectedDate,
                this.selectedMovie,
                this.selectedTimes,
                theaterId
            );

            // Show success message
            showNotification('✅ Movie scheduled successfully! Changes are saved to Firebase in real-time.', 'success');
            
            this.hideScheduleForm();
            this.renderCalendar();
            this.loadScheduleForSelectedDate();
            
            // Clear search
            document.getElementById('movieSearch').value = '';
            document.getElementById('searchResults').innerHTML = '<p>Start typing to search for movies...</p>';
            
        } catch (error) {
            alert('Error scheduling movie. Please try again.');
            console.error('Scheduling error:', error);
        }
    }

    cancelSchedule() {
        this.hideScheduleForm();
    }

    renderCalendar() {
        const container = document.getElementById('calendarGrid');
        const monthYear = document.getElementById('currentMonth');
        
        // Update month display
        monthYear.textContent = this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Clear container
        container.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            container.appendChild(header);
        });

        // Get calendar data
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createCalendarDay(date, firstDay, lastDay);
            container.appendChild(dayElement);
        }
    }

    createCalendarDay(date, firstDay, lastDay) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        
        const isCurrentMonth = date >= firstDay && date <= lastDay;
        const isSelected = this.isSameDay(date, this.selectedDate);
        const scheduledMovies = scheduleManager.getScheduleForDate(date);
        const hasMovies = Array.isArray(scheduledMovies) && scheduledMovies.length > 0;
        
        if (!isCurrentMonth) {
            day.classList.add('other-month');
        }
        
        if (isSelected) {
            day.classList.add('selected');
        }
        
        if (hasMovies) {
            day.classList.add('has-movies');
        }

        day.innerHTML = `
            <div class="day-number">${date.getDate()}</div>
            ${Array.isArray(scheduledMovies) && scheduledMovies.length > 0 ? 
                scheduledMovies.slice(0, 2).map(schedule => 
                    `<div class="movie-indicator">${schedule.movie.title.substring(0, 8)}...</div>`
                ).join('') : ''
            }
            ${Array.isArray(scheduledMovies) && scheduledMovies.length > 2 ? 
                `<div class="movie-indicator">+${scheduledMovies.length - 2}</div>` : ''
            }
        `;

        day.onclick = () => this.selectDate(date);
        
        return day;
    }

    selectDate(date) {
        this.selectedDate = new Date(date);
        this.renderCalendar();
        this.updateSelectedDateDisplay();
        this.loadScheduleForSelectedDate();
    }

    updateSelectedDateDisplay() {
        const selectedDateSpan = document.getElementById('selectedDate');
        selectedDateSpan.textContent = scheduleManager.formatDisplayDate(this.selectedDate);
    }

    loadScheduleForSelectedDate() {
        const container = document.getElementById('daySchedule');
        const schedules = scheduleManager.getScheduleForDate(this.selectedDate);
        
        if (!Array.isArray(schedules) || schedules.length === 0) {
            container.innerHTML = '<p>No movies scheduled for this date.</p>';
            return;
        }

        container.innerHTML = schedules.map(schedule => `
            <div class="scheduled-movie-item">
                <div style="display: flex; justify-content: between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h4>${schedule.movie.title}</h4>
                        <p><strong>Theater:</strong> ${schedule.theater.name}</p>
                        <p><strong>Times:</strong> ${schedule.showtimes.join(', ')}</p>
                        <p><strong>Rating:</strong> ⭐ ${schedule.movie.vote_average ? schedule.movie.vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <button class="btn btn-danger" onclick="adminPanel.removeScheduledMovie('${scheduleManager.formatDateKey(this.selectedDate)}', ${schedule.id})" style="margin-left: 10px;">Remove</button>
                </div>
            </div>
        `).join('');
    }

    async removeScheduledMovie(dateKey, scheduleId) {
        if (confirm('Are you sure you want to remove this scheduled movie?')) {
            await scheduleManager.removeMovieFromSchedule(dateKey, scheduleId);
            this.renderCalendar();
            this.loadScheduleForSelectedDate();
        }
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    showStatistics() {
        const stats = scheduleManager.getScheduleStats();
        const container = document.querySelector('.calendar-section');
        
        container.innerHTML = `
            <div class="statistics-view">
                <h3>📊 Schedule Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalScheduledDates}</div>
                        <div class="stat-label">Scheduled Dates</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalScheduledMovies}</div>
                        <div class="stat-label">Total Movies</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.upcomingDates}</div>
                        <div class="stat-label">Upcoming Dates</div>
                    </div>
                </div>
                
                <div class="theater-stats">
                    <h4>Movies by Theater</h4>
                    <div class="theater-stats-list">
                        ${Object.entries(stats.theaterStats).map(([theater, count]) => `
                            <div class="theater-stat-item">
                                <span class="theater-name">${theater}</span>
                                <span class="theater-count">${count} movies</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="firebase-status">
                    <h4>🔥 Firebase Status</h4>
                    <div id="firebaseStatus" class="status-indicator">
                        <span class="status-dot"></span>
                        <span class="status-text">Checking connection...</span>
                    </div>
                    <div class="sync-info">
                        <p>All changes are automatically saved to Firebase and synced in real-time across all devices.</p>
                    </div>
                    <div class="danger-zone">
                        <button class="btn btn-danger" onclick="adminPanel.clearAllData()">🗑️ Clear All Schedules</button>
                    </div>
                </div>

                <div class="schedule-preview">
                    <h4>📅 Schedule Preview</h4>
                    <pre class="schedule-text">${scheduleManager.getScheduleAsText()}</pre>
                </div>
            </div>
        `;
    }

    showImportDialog() {
        const importSection = document.getElementById('importSection');
        importSection.style.display = importSection.style.display === 'none' ? 'block' : 'none';
    }

    async handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const success = await scheduleManager.importFromCSV(file);
            if (success) {
                alert('Schedules imported successfully!');
                this.switchTab('calendar');
            } else {
                alert('Error importing file. Please check the format.');
            }
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    }

    async clearAllData() {
        if (confirm('Are you sure you want to delete ALL scheduled movies? This cannot be undone.')) {
            if (confirm('This will permanently delete all movie schedules. Are you absolutely sure?')) {
                await scheduleManager.clearAllSchedules();
                showNotification('All schedules have been cleared.', 'success');
                this.switchTab('calendar');
            }
        }
    }
    
    checkFirebaseStatus() {
        const statusElement = document.getElementById('firebaseStatus');
        if (!statusElement) return;
        
        const statusDot = statusElement.querySelector('.status-dot');
        const statusText = statusElement.querySelector('.status-text');
        
        // Check Firebase connection
        const status = scheduleManager.getConnectionStatus();
        
        if (status.firebase) {
            statusDot.style.backgroundColor = '#10B981';
            statusText.textContent = 'Connected to Firebase';
            statusText.style.color = '#10B981';
        } else {
            statusDot.style.backgroundColor = '#EF4444';
            statusText.textContent = 'Firebase not configured - Changes will not be saved';
            statusText.style.color = '#EF4444';
        }
        
        // Update status every 30 seconds
        setInterval(() => {
            const currentStatus = scheduleManager.getConnectionStatus();
            if (currentStatus.firebase) {
                statusDot.style.backgroundColor = '#10B981';
                statusText.textContent = `Connected - ${currentStatus.schedulesCount} dates scheduled`;
                statusText.style.color = '#10B981';
            }
        }, 30000);
    }

    switchTab(tab) {
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        if (tab === 'calendar') {
            document.querySelectorAll('.nav-btn')[0].classList.add('active');
            this.showCalendarView();
        } else if (tab === 'statistics') {
            document.querySelectorAll('.nav-btn')[1].classList.add('active');
            this.showStatistics();
        } else if (tab === 'settings') {
            document.querySelectorAll('.nav-btn')[2].classList.add('active');
            this.showSettings();
        }
    }

    showCalendarView() {
        const container = document.querySelector('.calendar-section');
        container.innerHTML = `
            <div class="calendar-header">
                <h3>Movie Schedule Calendar</h3>
                <div class="month-nav">
                    <button onclick="changeMonth(-1)">◀</button>
                    <span id="currentMonth"></span>
                    <button onclick="changeMonth(1)">▶</button>
                </div>
            </div>
            
            <div class="calendar-grid" id="calendarGrid">
                <!-- Calendar will be generated here -->
            </div>

            <div class="scheduled-movies" id="scheduledMovies">
                <h4>Movies scheduled for <span id="selectedDate">today</span>:</h4>
                <div id="daySchedule">
                    <!-- Scheduled movies for selected day will appear here -->
                </div>
            </div>
        `;
        
        this.renderCalendar();
        this.updateSelectedDateDisplay();
        this.loadScheduleForSelectedDate();
    }

    showSettings() {
        const container = document.querySelector('.calendar-section');
        container.innerHTML = `
            <div class="settings-view">
                <h3>⚙️ Settings</h3>
                
                <div class="settings-section">
                    <h4>Theater Management</h4>
                    <div class="theaters-list">
                        ${CONFIG.THEATERS.map(theater => `
                            <div class="theater-item">
                                <strong>${theater.name}</strong><br>
                                <small>${theater.address}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="settings-section">
                    <h4>Time Slots</h4>
                    <div class="time-slots-display">
                        ${scheduleManager.getTimeSlots().map(time => `
                            <span class="time-slot-display">${time}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="settings-section">
                    <h4>API Configuration</h4>
                    <p><strong>TMDB API:</strong> ${CONFIG.TMDB_API_KEY ? 'Configured' : 'Not configured'}</p>
                    <p><strong>Base URL:</strong> ${CONFIG.TMDB_BASE_URL}</p>
                </div>

                <div class="settings-section">
                    <h4>Storage Information</h4>
                    <p>Data is currently stored in browser localStorage as CSV format.</p>
                    <p>For production use, implement server-side file storage.</p>
                </div>
            </div>
        `;
    }
}

// Global functions for HTML onclick handlers
function switchTab(tab) {
    adminPanel.switchTab(tab);
}

function logout() {
    // Use simpleAuth logout
    if (window.simpleAuth) {
        window.simpleAuth.logout();
    }
    // Also remove old key for compatibility
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
}

function changeMonth(direction) {
    adminPanel.changeMonth(direction);
}

function scheduleMovie() {
    adminPanel.scheduleMovie();
}

function cancelSchedule() {
    adminPanel.cancelSchedule();
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    window.adminPanel = adminPanel; // Make it globally accessible
});