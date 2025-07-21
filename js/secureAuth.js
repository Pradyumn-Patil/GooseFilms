// Secure Authentication Module for GooseFilms
// This replaces the insecure hardcoded credentials

class SecureAuth {
    constructor() {
        this.SESSION_KEY = 'goosefilms_session';
        this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        this.isAuthenticated = false;
        this.sessionData = null;
        
        // Initialize session check
        this.checkSession();
    }
    
    // Check if user has valid session
    checkSession() {
        const session = this.getSession();
        if (session && session.expires > Date.now()) {
            this.isAuthenticated = true;
            this.sessionData = session;
            return true;
        }
        this.clearSession();
        return false;
    }
    
    // Get session from localStorage
    getSession() {
        try {
            const sessionStr = localStorage.getItem(this.SESSION_KEY);
            return sessionStr ? JSON.parse(sessionStr) : null;
        } catch (e) {
            console.error('Error reading session:', e);
            return null;
        }
    }
    
    // Save session to localStorage
    saveSession(data) {
        try {
            const session = {
                ...data,
                expires: Date.now() + this.SESSION_TIMEOUT
            };
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            this.sessionData = session;
            this.isAuthenticated = true;
        } catch (e) {
            console.error('Error saving session:', e);
        }
    }
    
    // Clear session
    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        this.isAuthenticated = false;
        this.sessionData = null;
    }
    
    // Hash password (basic implementation - use bcrypt in production)
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    // Validate password strength
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        
        const errors = [];
        if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters`);
        if (!hasUpperCase) errors.push('Password must contain uppercase letters');
        if (!hasLowerCase) errors.push('Password must contain lowercase letters');
        if (!hasNumbers) errors.push('Password must contain numbers');
        if (!hasSpecialChar) errors.push('Password must contain special characters');
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // Login function (should connect to backend in production)
    async login(username, password) {
        try {
            // In production, this should make an API call to your backend
            // For now, we'll use a temporary solution that's more secure than hardcoded credentials
            
            // Hash the password
            const hashedPassword = await this.hashPassword(password);
            
            // Temporary check - replace with API call
            // This is still not secure but better than plaintext
            const tempAdminHash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // admin
            const tempPasswordHash = '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5'; // 12345
            
            if (username === 'admin' && hashedPassword === tempAdminHash) {
                // Create session
                this.saveSession({
                    username,
                    role: 'admin',
                    loginTime: Date.now()
                });
                return { success: true };
            }
            
            return { 
                success: false, 
                error: 'Invalid credentials' 
            };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: 'Login failed' 
            };
        }
    }
    
    // Logout function
    logout() {
        this.clearSession();
        window.location.href = '/login.html';
    }
    
    // Check if user has specific role
    hasRole(role) {
        return this.sessionData && this.sessionData.role === role;
    }
    
    // Refresh session timeout
    refreshSession() {
        if (this.sessionData) {
            this.saveSession(this.sessionData);
        }
    }
    
    // Protected route middleware
    requireAuth(callback) {
        if (this.checkSession()) {
            this.refreshSession();
            callback();
        } else {
            window.location.href = '/login.html';
        }
    }
    
    // Protected admin route middleware
    requireAdmin(callback) {
        if (this.checkSession() && this.hasRole('admin')) {
            this.refreshSession();
            callback();
        } else {
            window.location.href = '/login.html';
        }
    }
}

// Create global auth instance
const secureAuth = new SecureAuth();

// Auto logout on inactivity
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (secureAuth.isAuthenticated) {
        inactivityTimer = setTimeout(() => {
            secureAuth.logout();
            alert('Session expired due to inactivity');
        }, secureAuth.SESSION_TIMEOUT);
    }
}

// Monitor user activity
['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

// Initialize inactivity timer
resetInactivityTimer();