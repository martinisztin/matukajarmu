document.addEventListener('DOMContentLoaded', function() {
// Get all links that have hash (#) in href
const links = document.querySelectorAll('a[href^="#"]');

// Add click event listener to each link
links.forEach(link => {
    link.addEventListener('click', function(e) {
    // Prevent default anchor click behavior
    e.preventDefault();
    
    // Get the target element
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; // Skip if href is just "#"
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        // Smooth scroll to target
        window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
        });
        
        // Update URL without page jump (optional)
        history.pushState(null, null, targetId);
    }
    });
});
});