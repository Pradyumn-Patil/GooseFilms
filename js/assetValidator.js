// Asset Validator and Fallback Handler for GooseFilms

class AssetValidator {
    constructor() {
        this.assetCache = new Map();
        this.fallbackImages = {
            logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXduQm94PSIwIDAgNDAgNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIwIiBmaWxsPSIjNkI0NkMxIi8+CjxwYXRoIGQ9Ik0yMCAxMEMxNSAxMCAxMCAxNSAxMCAyMEMxMCAyNSAxNSAzMCAyMCAzMEMyNSAzMCAzMCAyNSAzMCAyMEMzMCAxNSAyNSAxMCAyMCAxMFoiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+',
            member: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiM2QjQ2QzEiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iMjAiIGZpbGw9IiNGNTlFMEIiLz4KPHBhdGggZD0iTTMwIDkwQzMwIDc1IDQwIDY1IDYwIDY1QzgwIDY1IDkwIDc1IDkwIDkwIiBmaWxsPSIjRjU5RTBCIi8+Cjwvc3ZnPg==',
            movie: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0xNTAgMTUwQzEyMCAxNTAgOTAgMTgwIDkwIDIxMEM5MCAyNDAgMTIwIDI3MCAxNTAgMjcwQzE4MCAyNzAgMjEwIDI0MCAyMTAgMjEwQzIxMCAxODAgMTgwIDE1MCAxNTAgMTUwWiIgZmlsbD0iIzZCNDZDMSIvPgo8cGF0aCBkPSJNMTM1IDE4NVYyMzVMMTc1IDIxMEwxMzUgMTg1WiIgZmlsbD0iI0Y1OUUwQiIvPgo8L3N2Zz4='
        };
    }
    
    // Check if an asset exists
    async checkAsset(url) {
        if (this.assetCache.has(url)) {
            return this.assetCache.get(url);
        }
        
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const exists = response.ok;
            this.assetCache.set(url, exists);
            return exists;
        } catch (error) {
            console.warn(`Asset check failed for ${url}:`, error);
            this.assetCache.set(url, false);
            return false;
        }
    }
    
    // Get fallback image based on type
    getFallbackImage(type) {
        return this.fallbackImages[type] || this.fallbackImages.movie;
    }
    
    // Validate and fix image element
    async validateImage(img, type = 'movie') {
        const originalSrc = img.src || img.dataset.src;
        
        if (!originalSrc) {
            img.src = this.getFallbackImage(type);
            return;
        }
        
        // Handle data URLs
        if (originalSrc.startsWith('data:')) {
            return;
        }
        
        // For lazy loaded images
        if (img.dataset.src && !img.src) {
            const exists = await this.checkAsset(img.dataset.src);
            if (!exists) {
                img.dataset.src = this.getFallbackImage(type);
            }
            return;
        }
        
        // Check if image loads successfully
        img.onerror = () => {
            console.warn(`Failed to load image: ${originalSrc}`);
            img.src = this.getFallbackImage(type);
            img.onerror = null; // Prevent infinite loop
        };
    }
    
    // Validate all images on the page
    async validateAllImages() {
        const images = document.querySelectorAll('img');
        
        for (const img of images) {
            let type = 'movie';
            
            // Determine image type based on context
            if (img.src.includes('logo') || img.alt.toLowerCase().includes('logo')) {
                type = 'logo';
            } else if (img.closest('.member-avatar') || img.src.includes('member')) {
                type = 'member';
            }
            
            await this.validateImage(img, type);
        }
    }
    
    // Fix CSS background images
    fixBackgroundImage(element, fallbackUrl) {
        const style = window.getComputedStyle(element);
        const backgroundImage = style.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
            // Extract URL from background-image
            const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch && urlMatch[1]) {
                const img = new Image();
                img.onerror = () => {
                    element.style.backgroundImage = `url('${fallbackUrl}')`;
                };
                img.src = urlMatch[1];
            }
        }
    }
    
    // Initialize asset validation
    init() {
        // Validate images on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.validateAllImages();
            });
        } else {
            this.validateAllImages();
        }
        
        // Monitor for dynamically added images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'IMG') {
                        this.validateImage(node);
                    } else if (node.querySelectorAll) {
                        const images = node.querySelectorAll('img');
                        images.forEach(img => this.validateImage(img));
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Create global instance
const assetValidator = new AssetValidator();
assetValidator.init();

// Export for use in other modules
window.assetValidator = assetValidator;