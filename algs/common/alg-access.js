import { onAuthStateChange } from '../../js/auth-service.js';

let currentUserRole = null;

// Listen for authentication state changes to update the user's role
onAuthStateChange((user) => {
    if (user && user.profile) {
        currentUserRole = user.profile.role;
    } else {
        currentUserRole = null; // No user logged in or profile not available
    }
});

/**
 * Handles clicks on algorithm boxes, checking if the user has access to locked content.
 * @param {Event} event The click event.
 * @param {string} pageUrl The URL of the algorithm page.
 * @param {string} algName The name of the algorithm for the alert message.
 */
window.handleLockedAlgClick = function(event, pageUrl, algName) {
    event.preventDefault(); // Prevent default navigation

    // Check if the user is a 'pro_user' or 'admin'
    if (currentUserRole === 'pro_user' || currentUserRole === 'admin') {
        // User has access, allow navigation
        window.location.href = pageUrl;
    } else {
        // User does not have access, show an alert message
        alert(`This algorithm (${algName}) is a premium feature. Please upgrade to a Pro account to access it.`);
    }
};