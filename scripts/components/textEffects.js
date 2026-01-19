// ============================================
// TEXT SCRAMBLE EFFECT ON HOVER
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const glitchElements = document.querySelectorAll('.glitch-text');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    glitchElements.forEach(element => {
        const originalText = element.textContent.trim();

        // Check if element is in testimonials section for faster glitch
        const isTestimonialsSection = element.closest('.testimonials-section') !== null;
        const intervalTime = isTestimonialsSection ? 8 : 15;
        const iterationSpeed = isTestimonialsSection ? 2 : 1;

        element.addEventListener('mouseenter', function () {
            let iterations = 0;
            const maxIterations = originalText.length;

            const interval = setInterval(() => {
                element.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                iterations += iterationSpeed;

                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    element.textContent = originalText;
                }
            }, intervalTime);
        });
    });
});
