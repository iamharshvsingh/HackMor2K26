// ============================================
// GALLERY FUNCTIONALITY
// ============================================

function shuffleGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    const items = Array.from(galleryGrid.children);
    const shuffled = items.sort(() => Math.random() - 0.5);

    shuffled.forEach(item => galleryGrid.appendChild(item));
}

// Optional: shuffle gallery every 30 seconds
// setInterval(shuffleGallery, 30000);
