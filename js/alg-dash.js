import { onAuthStateChange } from './auth-service.js';

// --- Notification System ---
let notificationTimeout;

function showProNotification() {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.pro-notification');
    if (existingNotification) {
        existingNotification.remove();
        clearTimeout(notificationTimeout);
    }

    const notification = document.createElement('div');
    notification.className = 'pro-notification';
    notification.innerHTML = `
        <i class="fas fa-crown"></i>
        <span>This is a Pro feature.</span>
        <a href="/pricing.html" class="upgrade-btn">Upgrade to Pro</a>
    `;
    document.body.appendChild(notification);

    // Trigger the animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide after 4 seconds
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        // Remove from DOM after transition
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// --- Pro Feature Gating ---
function gateProFeatures(user) {
    const proBoxes = document.querySelectorAll('.cube-box[data-pro="true"]');
    const authorizedRoles = ['pro_user', 'admin', 'subadmin'];
    const isPro = user && user.profile && authorizedRoles.includes(user.profile.role);

    proBoxes.forEach(box => {
        if (isPro) {
            // User is pro, remove locked state
            box.classList.remove('locked');
            const path = box.getAttribute('data-path');
            box.onclick = () => window.location.href = path;
        } else {
            // User is not pro, add locked state
            box.classList.add('locked');
            box.onclick = (e) => {
                e.preventDefault();
                showProNotification();
            };
        }
    });
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChange(user => {
        gateProFeatures(user);
    });
});