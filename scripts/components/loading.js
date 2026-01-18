// ============================================
// LOADING SCREEN
// ============================================

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        // Remove from DOM after fade-out completes
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 500); // Show loader for at least 500ms
});
