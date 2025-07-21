// GooseFilms Performance Optimization Script

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageOptions = {
        threshold: 0.01,
        rootMargin: '50px'
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading placeholder
                img.classList.add('lazy-image');
                
                // Create new image to preload
                const tempImg = new Image();
                tempImg.onload = function() {
                    img.src = this.src;
                    img.classList.add('loaded');
                    
                    // Remove data-src attribute
                    img.removeAttribute('data-src');
                    
                    // Remove will-change after animation
                    setTimeout(() => {
                        img.style.willChange = 'auto';
                    }, 600);
                };
                
                tempImg.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    }, imageOptions);
    
    images.forEach(img => {
        imageObserver.observe(img);
        img.style.willChange = 'opacity';
    });
}

// Debounce function for scroll and resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for high-frequency events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize animations based on performance
function optimizeAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.body.classList.add('reduced-motion');
        return;
    }
    
    // Check device performance
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          navigator.deviceMemory <= 4 ||
                          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isLowEndDevice) {
        // Reduce animation complexity
        document.body.classList.add('low-performance-mode');
        
        // Disable parallax effects
        document.querySelectorAll('.parallax-bg').forEach(el => {
            el.style.transform = 'none';
        });
        
        // Simplify animations
        document.querySelectorAll('[class*="animate-"]').forEach(el => {
            el.style.animationDuration = '0.3s';
        });
    }
}

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'assets/turtle-logo.svg',
        'assets/unicorn.jpeg',
        'animations.css',
        'animations-extras.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        
        if (resource.endsWith('.css')) {
            link.as = 'style';
        } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
            link.as = 'image';
        }
        
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Page loading animation
function initPageLoader() {
    // Create preloader if it doesn't exist
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <img src="assets/turtle-logo.svg" alt="Loading" class="preloader-logo">
                <div class="preloader-text">GOOSEFILMS</div>
                <div class="preloader-spinner"></div>
            </div>
        `;
        document.body.appendChild(preloader);
    }
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => preloader.remove(), 500);
            }, 500);
        }
    });
}

// Loading states for dynamic content
function showContentLoader(container) {
    container.classList.add('content-loading');
}

function hideContentLoader(container) {
    container.classList.remove('content-loading');
}

// Button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('btn-loading');
        button.disabled = true;
    } else {
        button.classList.remove('btn-loading');
        button.disabled = false;
    }
}

// Create skeleton loaders
function createSkeletonCard() {
    return `
        <div class="skeleton-movie-card">
            <div class="skeleton skeleton-poster"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
    `;
}

// Initialize performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    initLazyLoading();
    
    // Optimize animations
    optimizeAnimations();
    
    // Preload critical resources
    preloadResources();
    
    // Remove will-change after animations complete
    document.addEventListener('animationend', (e) => {
        if (e.target.classList.contains('will-animate-transform') ||
            e.target.classList.contains('will-animate-opacity')) {
            e.target.classList.add('animation-done');
            e.target.style.willChange = 'auto';
        }
    });
    
    // Optimize scroll events
    const optimizedScroll = throttle(() => {
        // Scroll-related operations
    }, 100);
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    
    // Optimize resize events
    const optimizedResize = debounce(() => {
        // Resize-related operations
        optimizeAnimations();
    }, 250);
    
    window.addEventListener('resize', optimizedResize);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    initPerformanceOptimizations();
});

// Export utilities
window.PerformanceUtils = {
    debounce,
    throttle,
    showContentLoader,
    hideContentLoader,
    setButtonLoading,
    createSkeletonCard,
    initLazyLoading
};