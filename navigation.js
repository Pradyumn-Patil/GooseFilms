// GooseFilms Navigation Enhancement Script

// Initialize smooth navigation bar behavior
function initSmoothNavigation() {
    const navbar = document.querySelector('nav') || document.querySelector('.nav-section');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 100;
    let isScrolling = false;
    
    // Add smooth transition
    navbar.style.transition = 'transform 0.3s var(--ease-out-expo)';
    
    // Handle scroll events
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > scrollThreshold) {
                    if (scrollTop > lastScrollTop) {
                        // Scrolling down - hide navbar
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        // Scrolling up - show navbar
                        navbar.style.transform = 'translateY(0)';
                        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    }
                } else {
                    // At top of page
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.boxShadow = 'none';
                }
                
                lastScrollTop = scrollTop;
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    });
}

// Add active link indicator
function initActiveLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.style.color = 'var(--cinema-gold)';
            link.style.position = 'relative';
            
            // Add underline indicator
            const indicator = document.createElement('span');
            indicator.style.cssText = `
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 2px;
                background: var(--cinema-gold);
                animation: slideInLeft 0.3s ease;
            `;
            link.appendChild(indicator);
        }
    });
}

// Add hover effects to navigation links
function initNavHoverEffects() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Skip if already has indicator (active link)
        if (link.querySelector('span')) return;
        
        link.addEventListener('mouseenter', function() {
            if (!this.querySelector('.hover-indicator')) {
                const hoverIndicator = document.createElement('span');
                hoverIndicator.className = 'hover-indicator';
                hoverIndicator.style.cssText = `
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0%;
                    height: 2px;
                    background: var(--cinema-gold);
                    transition: width 0.3s var(--ease-out-expo);
                `;
                this.appendChild(hoverIndicator);
                
                // Trigger animation
                setTimeout(() => {
                    hoverIndicator.style.width = '100%';
                }, 10);
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const hoverIndicator = this.querySelector('.hover-indicator');
            if (hoverIndicator) {
                hoverIndicator.style.width = '0%';
                setTimeout(() => hoverIndicator.remove(), 300);
            }
        });
    });
}

// Mobile menu toggle (for future implementation)
function initMobileMenu() {
    // Check if mobile menu button exists
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (!mobileMenuBtn) {
        // Create mobile menu button for smaller screens
        const navbar = document.querySelector('nav') || document.querySelector('.nav-section');
        if (navbar && window.innerWidth <= 768) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰';
            menuBtn.style.cssText = `
                display: none;
                background: none;
                border: none;
                color: var(--cinema-gold);
                font-size: 1.5rem;
                cursor: pointer;
                transition: transform 0.3s ease;
            `;
            
            // Show on mobile
            if (window.innerWidth <= 768) {
                menuBtn.style.display = 'block';
            }
            
            menuBtn.addEventListener('click', function() {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.toggle('mobile-active');
                    this.style.transform = navLinks.classList.contains('mobile-active') 
                        ? 'rotate(90deg)' 
                        : 'rotate(0)';
                }
            });
            
            const navContainer = navbar.querySelector('.nav-container');
            if (navContainer) {
                navContainer.appendChild(menuBtn);
            }
        }
    }
}

// Initialize all navigation enhancements
document.addEventListener('DOMContentLoaded', () => {
    initSmoothNavigation();
    initActiveLinks();
    initNavHoverEffects();
    initMobileMenu();
    
    // Re-initialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initMobileMenu();
        }, 250);
    });
});

// Export functions for external use
window.NavigationEnhancer = {
    initSmoothNavigation,
    initActiveLinks,
    initNavHoverEffects,
    initMobileMenu
};