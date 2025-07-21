// Simple codeword authentication for GooseFilms admin access
// WARNING: This is a temporary solution. Use secureAuth.js for better security
class SimpleAuth {
    constructor() {
        // WARNING: Hardcoded credentials are insecure!
        // This should be replaced with environment variables or a proper auth system
        // See SECURITY.md for implementation details
        console.warn('SimpleAuth is using hardcoded credentials. This is insecure for production use.');
        
        // Hardcoded codeword - change this to whatever you want
        this.CODEWORD = 'goosefilms2024';
        
        // Session key for localStorage
        this.SESSION_KEY = 'goosefilms_admin_session';
        
        // Session duration (24 hours)
        this.SESSION_DURATION = 24 * 60 * 60 * 1000;
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            // Check if session has expired
            if (now > sessionData.expiresAt) {
                this.logout();
                return false;
            }
            
            return sessionData.authenticated === true;
        } catch (e) {
            return false;
        }
    }
    
    // Login with codeword
    login(codeword) {
        // Simple comparison - case insensitive
        if (codeword.toLowerCase() === this.CODEWORD.toLowerCase()) {
            const sessionData = {
                authenticated: true,
                loginTime: new Date().getTime(),
                expiresAt: new Date().getTime() + this.SESSION_DURATION
            };
            
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            return { success: true };
        } else {
            return { success: false, error: 'Invalid codeword' };
        }
    }
    
    // Logout
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    }
    
    // Get remaining session time
    getSessionInfo() {
        if (!this.isAuthenticated()) return null;
        
        const session = JSON.parse(localStorage.getItem(this.SESSION_KEY));
        const now = new Date().getTime();
        const remainingTime = session.expiresAt - now;
        
        return {
            loginTime: new Date(session.loginTime),
            expiresAt: new Date(session.expiresAt),
            remainingMinutes: Math.floor(remainingTime / (1000 * 60))
        };
    }
}

// Create global instance
window.simpleAuth = new SimpleAuth();