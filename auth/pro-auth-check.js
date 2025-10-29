import { onAuthStateChange } from '../js/auth-service.js';
import { showNotification } from '../js/notification.js';

const PRO_ROLES = ['pro_user', 'admin', 'subadmin'];
const PRICING_PAGE = '../../pricing.html'; // Assuming this path

let messageInterval;

const loadingMessages = [
    "Loading images...",
    "Loading icons...",
    "Loading algorithms..."
];

function updateLoadingText(textElement) {
    let index = 0;
    textElement.textContent = loadingMessages[index];
    messageInterval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        textElement.textContent = loadingMessages[index];
    }, 1500); // Change message every 1.5 seconds
}

function showLoading() {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text"></div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.classList.remove('hidden');
    
    const loadingTextElement = overlay.querySelector('.loading-text');
    updateLoadingText(loadingTextElement);
}

function hideLoading() {
    clearInterval(messageInterval); // Stop message cycling
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

function showContent() {
    const contentWrapper = document.getElementById('content-wrapper');
    if (contentWrapper) {
        contentWrapper.classList.remove('content-hidden');
        contentWrapper.classList.add('content-visible');
    }
}

function checkProAccess() {
    // 1. Always show loading screen immediately
    showLoading();

    onAuthStateChange((user) => {
        
        if (user && user.profile) {
            const userRole = user.profile.role;
            
            if (PRO_ROLES.includes(userRole)) {
                // Access granted: show content and hide loading
                hideLoading();
                showContent();
            } else {
                // Free user or unauthorized role: deny access
                hideLoading(); 
                showNotification('Upgrade to Pro to access this algorithm!', 'fas fa-lock', 5000);
                // Secure redirect
                window.location.replace(PRICING_PAGE);
            }
        } else {
            // User is not logged in: deny access
            hideLoading(); 
            showNotification('Please log in or upgrade to Pro to access this page.', 'fas fa-user-lock', 5000);
            // Secure redirect
            window.location.replace(PRICING_PAGE);
        }
    });
}

// Start the check immediately
document.addEventListener('DOMContentLoaded', checkProAccess);