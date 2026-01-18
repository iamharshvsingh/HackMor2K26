// ============================================
// UTILITY FUNCTIONS
// ============================================

// Throttle scroll events
export function throttle(func, wait) {
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

// Apply throttling to scroll handlers
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations handled here
}, 16));
