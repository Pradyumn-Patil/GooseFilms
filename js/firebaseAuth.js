// Custom Authentication module using Firestore (no Firebase Auth)
class FirebaseAuth {
    constructor() {
        this.db = null;
        this.currentUser = null;
        this.authStateListeners = [];
        this.sessionKey = 'goosefilms_session';
        this.init();
    }

    init() {
        if (window.firebaseUtils && window.firebaseUtils.isFirebaseConfigured()) {
            this.db = window.firebaseUtils.getFirestore();
            
            // Check for existing session
            this.checkSession();
        }
    }

    // Simple hash function for passwords (in production, use bcrypt on server)
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Generate session token
    generateSessionToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    // Check existing session
    async checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                // Verify session is still valid (24 hour expiry)
                if (sessionData.expiry > Date.now()) {
                    this.currentUser = sessionData.user;
                    this.notifyAuthStateListeners(this.currentUser);
                } else {
                    this.clearSession();
                }
            } catch (error) {
                this.clearSession();
            }
        }
    }

    // Clear session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
        this.currentUser = null;
        this.notifyAuthStateListeners(null);
    }

    // Add auth state listener
    onAuthStateChanged(callback) {
        this.authStateListeners.push(callback);
        // Call immediately with current state
        callback(this.currentUser);
    }

    // Notify all auth state listeners
    notifyAuthStateListeners(user) {
        this.authStateListeners.forEach(callback => callback(user));
    }

    // Sign in with username and password (custom auth)
    async signIn(username, password) {
        try {
            // Check if Firebase is configured
            if (!this.db) {
                // No Firebase, use local auth
                return this.fallbackLocalAuth(username, password);
            }
            
            // Look up user in Firestore
            const userDoc = await this.db.collection('users').doc(username.toLowerCase()).get();
            
            if (!userDoc.exists) {
                // User not found, try local auth as fallback
                return this.fallbackLocalAuth(username, password);
            }
            
            const userData = userDoc.data();
            const hashedPassword = await this.hashPassword(password);
            
            // Verify password
            if (userData.password !== hashedPassword) {
                return { success: false, error: 'Invalid password' };
            }
            
            // Create session
            const sessionToken = this.generateSessionToken();
            const sessionData = {
                user: {
                    username: username,
                    role: userData.role || 'admin',
                    uid: username.toLowerCase()
                },
                token: sessionToken,
                expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            };
            
            // Save session
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            this.currentUser = sessionData.user;
            this.notifyAuthStateListeners(this.currentUser);
            
            console.log('User signed in:', username);
            return { success: true, user: this.currentUser };
        } catch (error) {
            console.error('Sign in error:', error);
            // Try local auth as final fallback
            return this.fallbackLocalAuth(username, password);
        }
    }

    // Create admin user (custom auth in Firestore)
    async createAdminUser(username, password) {
        try {
            if (!this.db) {
                throw new Error('Firebase not initialized');
            }
            
            // Check if user already exists
            const existingUser = await this.db.collection('users').doc(username.toLowerCase()).get();
            if (existingUser.exists) {
                return { success: false, error: 'Username already exists' };
            }
            
            // Hash the password
            const hashedPassword = await this.hashPassword(password);
            
            // Create user document
            await this.db.collection('users').doc(username.toLowerCase()).set({
                username: username,
                password: hashedPassword,
                role: 'admin',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('Admin user created:', username);
            
            // Auto sign in the new user
            return this.signIn(username, password);
        } catch (error) {
            console.error('Create admin user error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out
    async signOut() {
        try {
            this.clearSession();
            console.log('User signed out');
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    async isAdmin() {
        if (!this.currentUser) {
            return false;
        }
        
        // Check from session data
        return this.currentUser.role === 'admin';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if Firebase is available
    isAvailable() {
        return this.db !== null && window.firebaseUtils && window.firebaseUtils.isFirebaseConfigured();
    }

    // Fallback to local auth for backward compatibility
    async fallbackLocalAuth(username, password) {
        if (username === CONFIG.ADMIN.username && password === CONFIG.ADMIN.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            return { success: true, fallback: true };
        }
        return { success: false, error: 'Invalid credentials' };
    }

    // Check local auth status
    checkLocalAuth() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }

    // Clear local auth
    clearLocalAuth() {
        localStorage.removeItem('adminLoggedIn');
    }
}

// Create global instance
window.firebaseAuth = new FirebaseAuth();