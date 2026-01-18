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
