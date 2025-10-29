import { onAuthStateChange } from '../js/auth-service.js';

const ADMIN_ROLES = ['admin']; // Only 'admin' can access for now

function protectAdminPage() {
    onAuthStateChange((user) => {
        if (!user || !user.profile || !ADMIN_ROLES.includes(user.profile.role)) {
            // If user is not logged in, not an admin, or profile is missing
            console.warn('Access denied. User is not an admin.');
            alert('You do not have permission to view this page.');
            window.location.replace('../index.html'); // Redirect to home page
        }
        // If user is an admin, they can stay on the page.
    });
}

// Run the check as soon as the script loads
protectAdminPage();