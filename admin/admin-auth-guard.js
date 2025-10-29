import { onAuthStateChange } from '../js/auth-service.js';

const ADMIN_ROLES = ['admin']; // Only 'admin' can access for now

function protectAdminPage() {
    const overlay = document.getElementById('auth-loading-overlay');

    onAuthStateChange((user) => {
        if (user && user.profile && ADMIN_ROLES.includes(user.profile.role)) {
            // User is an admin, hide overlay and let them proceed
            if (overlay) {
                overlay.classList.add('hidden');
            }
        } else {
            // Not an admin, redirect. The overlay will remain, hiding the page content.
            console.warn('Access denied. User is not an admin.');
            alert('You do not have permission to view this page.');
            window.location.replace('../index.html');
        }
    });
}

// Run the check as soon as the script loads
protectAdminPage();