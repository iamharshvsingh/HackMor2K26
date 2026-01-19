// ============================================
// GALLERY AUTO-SLIDE FUNCTIONALITY
// ============================================

let currentIndex = 0;
let galleryInterval;

function rotateGalleryImages() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    const items = Array.from(galleryGrid.children);
    if (items.length === 0) return;

    // Add fade-out effect to current items
    items.forEach(item => {
        item.style.transition = 'opacity 0.5s ease-in-out';
        item.style.opacity = '0.3';
    });

    // After fade-out, shuffle and fade-in
    setTimeout(() => {
        // Shuffle the items
        const shuffled = items.sort(() => Math.random() - 0.5);

        // Re-append shuffled items
        shuffled.forEach(item => galleryGrid.appendChild(item));

        // Fade back in
        setTimeout(() => {
            items.forEach(item => {
                item.style.opacity = '1';
            });
        }, 100);
    }, 500);

    currentIndex = (currentIndex + 1) % items.length;
}

// Start auto-rotation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        // Initial setup
        const items = Array.from(galleryGrid.children);
        items.forEach(item => {
            item.style.transition = 'opacity 0.5s ease-in-out';
            item.style.opacity = '1';
        });

        // Start rotating every 1.5 seconds
        galleryInterval = setInterval(rotateGalleryImages, 1500);
    }
});

// Pause on hover (optional - for better UX)
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        galleryGrid.addEventListener('mouseenter', () => {
            clearInterval(galleryInterval);
        });

        galleryGrid.addEventListener('mouseleave', () => {
            galleryInterval = setInterval(rotateGalleryImages, 1500);
        });
    }
});
