import { onAuthStateChange } from './auth-service.js';

function showLoader() {
    // Inject CSS for the loader
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Path is relative to the HTML file including this script
    link.href = '../common/pro-gate.css'; 
    document.head.appendChild(link);

    // Create overlay and loader elements
    const overlay = document.createElement('div');
    overlay.id = 'pro-gate-overlay';
    overlay.innerHTML = '<div class="pro-gate-loader"></div>';
    document.body.appendChild(overlay);

    // Hide main content until user is verified
    document.body.style.visibility = 'hidden';
}

function hideLoader() {
    const overlay = document.getElementById('pro-gate-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            // Show the content now that the user is verified
            document.body.style.visibility = 'visible';
        }, 300);
    }
}

function redirectToPricing() {
    // Redirect unauthorized users to the pricing page
    window.location.href = '../../pricing.html';
}

// Run the check as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    showLoader();

    onAuthStateChange(user => {
        const authorizedRoles = ['pro_user', 'admin', 'subadmin'];
        
        if (user && user.profile && authorizedRoles.includes(user.profile.role)) {
            // User is authorized, show the page content
            hideLoader();
        } else {
            // User is not logged in or not authorized, redirect
            redirectToPricing();
        }
    });
});