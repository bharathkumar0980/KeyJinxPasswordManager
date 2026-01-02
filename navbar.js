/**
 * NAVBAR FUNCTIONALITY
 * ====================
 * Handles mobile hamburger menu toggle
 */

// Get hamburger button and nav menu elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

/**
 * Toggle mobile menu when hamburger is clicked
 */
hamburger.addEventListener('click', function() {
    // Toggle 'active' class on both hamburger and menu
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

/**
 * Close mobile menu when a nav link is clicked
 */
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        // Remove 'active' class to close menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});