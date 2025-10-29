import { onAuthStateChange } from '../js/auth-service.js';

const ALLOWED_ROLES = ['admin', 'subadmin'];

function protectSubAdminPage() {
    const overlay = document.getElementById('auth-loading-overlay');

    onAuthStateChange((user) => {
        if (user && user.profile && ALLOWED_ROLES.includes(user.profile.role)) {
            // User has permission, hide overlay
            if (overlay) {
                overlay.classList.add('hidden');
            }
        } else {
            // No permission, redirect
            console.warn('Access denied. User is not an admin or subadmin.');
            alert('You do not have permission to view this page.');
            window.location.replace('../index.html');
        }
    });
}

// Run the check
protectSubAdminPage();