import { onAuthStateChange } from '../js/auth-service.js';
import { showNotification } from '../js/notification.js';

const PRO_ROLES = ['pro_user', 'admin', 'subadmin'];
const PRICING_PAGE = '../../pricing.html'; // Assuming this path

function showLoading() {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading algorithms and images...</div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        // Remove overlay after transition
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500);
    }
}

function checkProAccess() {
    showLoading();

    onAuthStateChange((user) => {
        if (user && user.profile) {
            const userRole = user.profile.role;
            
            if (PRO_ROLES.includes(userRole)) {
                // Access granted
                hideLoading();
            } else {
                // Free user or unauthorized role
                showNotification('Upgrade to Pro to access this algorithm!', 'fas fa-lock', 5000);
                // Secure redirect
                window.location.replace(PRICING_PAGE);
            }
        } else {
            // User is not logged in
            showNotification('Please log in or upgrade to Pro to access this page.', 'fas fa-user-lock', 5000);
            // Secure redirect
            window.location.replace(PRICING_PAGE);
        }
    });
}

// Start the check immediately
document.addEventListener('DOMContentLoaded', checkProAccess);