// ============================================
// LIVE COUNTDOWN TIMER (CRITICAL)
// Target: February 19, 2026
// ============================================

function updateCountdown() {
    const targetDate = new Date('2026-02-19T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.getElementById('milliseconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((distance % 1000) / 10);
    
    document.getElementById('days').textContent = String(days % 100).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    document.getElementById('milliseconds').textContent = String(milliseconds).padStart(2, '0');
}

// Update countdown every 10ms for milliseconds
setInterval(updateCountdown, 10);
updateCountdown();

// ============================================
// GLITCH TEXT EFFECT (MANDATORY)
// On hover: text turns into random alphabets
// After ~300ms, morphs back to original
// ============================================

// Apply glitch effect to all glitch-text elements on hover
document.addEventListener('DOMContentLoaded', () => {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        // Get original text from data attribute or textContent
        const originalText = (element.dataset.text || element.textContent).trim();
        
        // Store original text
        element.dataset.originalText = originalText;
        
        let glitchInterval = null;
        let morphInterval = null;
        let morphTimeout = null;
        
        element.addEventListener('mouseenter', () => {
            // Clear any existing intervals/timeouts
            if (glitchInterval) {
                clearInterval(glitchInterval);
                glitchInterval = null;
            }
            if (morphInterval) {
                clearInterval(morphInterval);
                morphInterval = null;
            }
            if (morphTimeout) {
                clearTimeout(morphTimeout);
                morphTimeout = null;
            }
            
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
            const original = element.dataset.originalText;
            
            // Phase 1: Random glitch for ~300ms
            glitchInterval = setInterval(() => {
                element.textContent = original
                    .split('')
                    .map((letter) => {
                        // Preserve spaces and special chars
                        if (letter === ' ' || letter === '-' || letter === '&' || letter === '•') {
                            return letter;
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');
            }, 50);
            
            // After 300ms, stop glitch and morph back
            morphTimeout = setTimeout(() => {
                if (glitchInterval) {
                    clearInterval(glitchInterval);
                    glitchInterval = null;
                }
                
                // Phase 2: Morph back to original character by character
                let morphIndex = 0;
                morphInterval = setInterval(() => {
                    element.textContent = original
                        .split('')
                        .map((letter, index) => {
                            if (index < Math.floor(morphIndex)) {
                                return original[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    morphIndex += 0.4;
                    
                    if (morphIndex >= original.length) {
                        clearInterval(morphInterval);
                        morphInterval = null;
                        element.textContent = original;
                    }
                }, 30);
            }, 300);
        });
        
        element.addEventListener('mouseleave', () => {
            // Clear all intervals and timeouts
            if (glitchInterval) {
                clearInterval(glitchInterval);
                glitchInterval = null;
            }
            if (morphInterval) {
                clearInterval(morphInterval);
                morphInterval = null;
            }
            if (morphTimeout) {
                clearTimeout(morphTimeout);
                morphTimeout = null;
            }
            // Immediately restore original text
            element.textContent = element.dataset.originalText;
        });
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.announcement-card, .theme-card, .prize-card, .gallery-item, .timeline-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// PARTICLES ANIMATION
// ============================================

function createParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;

    // Create dynamic particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 255, 136, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add CSS animation for particles
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float-particle {
                0%, 100% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize particles
createParticles();

// ============================================
// GALLERY SHUFFLE ANIMATION (Optional)
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

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission (replace with actual API call)
        console.log('Form submitted:', data);
        
        // Show success message
        if (formSuccess) {
            formSuccess.classList.remove('hidden');
        }
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            if (formSuccess) {
                formSuccess.classList.add('hidden');
            }
        }, 5000);
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Throttle scroll events
function throttle(func, wait) {
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

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('HACKMoR 2026 website initialized!');
    document.body.style.opacity = '1';
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🚀 HACKMoR 2026', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cCyberpunk Hackathon', 'font-size: 14px; color: #00d9ff;');
console.log('%cBuilt with cyberpunk aesthetic', 'font-size: 12px; color: #6ee7b7;');
