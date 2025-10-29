import { onAuthStateChange } from '../js/auth-service.js';
import { showNotification } from '../js/notification.js';

const PRO_ROLES = ['pro_user', 'admin', 'subadmin'];
const PRO_ALGS = [
    'f2l.html', '1lookoll.html', '1lookpll.html', 'zbll.html', 'zbls.html', 'coll.html', // 3x3
    'ortcll.html', 'eg1.html', 'eg2.html', // 2x2
    'L4E.html' // Pyraminx
];
const PRICING_PAGE = '../../pricing.html';

let currentUserRole = null;

// 1. Listen for auth state changes to determine user role
onAuthStateChange((user) => {
    if (user && user.profile) {
        currentUserRole = user.profile.role;
    } else {
        currentUserRole = 'guest';
    }
    // 2. Apply locks once the role is known
    applyProLocks();
});

function isProUser() {
    return PRO_ROLES.includes(currentUserRole);
}

function applyProLocks() {
    const cubeBoxes = document.querySelectorAll('.cube-box');

    cubeBoxes.forEach(box => {
        const link = box.getAttribute('onclick') || box.getAttribute('data-target-href');
        if (!link) return;

        const targetPage = link.match(/window\.location\.href='(.*?)'|data-target-href='(.*?)'/)?.[1] || link.match(/window\.location\.href='(.*?)'|data-target-href='(.*?)'/)?.[2];
        if (!targetPage) return;

        const isProAlg = PRO_ALGS.some(alg => targetPage.includes(alg));

        // If the user is Pro, ensure no locks are present and restore original click handler
        if (isProUser()) {
            box.classList.remove('pro-locked');
            box.querySelector('.locked-overlay')?.remove();
            box.querySelector('.pro-lock-icon')?.remove();
            // Restore original onclick if it was removed
            if (box.hasAttribute('data-target-href')) {
                box.setAttribute('onclick', `window.location.href='${targetPage}'`);
                box.removeAttribute('data-target-href');
                box.removeEventListener('click', handleProClick);
                box.removeAttribute('data-listener-added');
            }
            return;
        }
        
        // If the user is NOT Pro and the algorithm is Pro
        if (isProAlg) {
            box.classList.add('pro-locked');
            
            // 1. Add dark overlay
            let overlay = box.querySelector('.locked-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'locked-overlay';
                box.appendChild(overlay);
            }

            // 2. Add lock icon visually (big and centered)
            let lockIcon = box.querySelector('.pro-lock-icon');
            if (!lockIcon) {
                lockIcon = document.createElement('i');
                lockIcon.className = 'fas fa-lock pro-lock-icon large-lock';
                box.appendChild(lockIcon);
            }

            // Trigger fade-in after elements are added/reset
            // Use a slight timeout to ensure the browser registers the initial opacity: 0 state
            setTimeout(() => {
                overlay.classList.add('fade-in-lock');
                lockIcon.classList.add('fade-in-lock');
            }, 50); 

            // 3. Override click behavior
            box.setAttribute('data-target-href', targetPage);
            box.removeAttribute('onclick');
            // Ensure we don't add multiple listeners
            if (!box.hasAttribute('data-listener-added')) {
                box.addEventListener('click', handleProClick);
                box.setAttribute('data-listener-added', 'true');
            }
        }
    });
}

function handleProClick(event) {
    event.preventDefault();
    // Deny access and show notification, DO NOT REDIRECT
    showNotification('Upgrade to Pro to unlock this algorithm!', 'fas fa-crown', 5000);
}

// Add CSS for the lock icon and overlay
const style = document.createElement('style');
style.textContent = `
    .cube-box {
        position: relative;
        overflow: hidden; /* Ensure overlay stays inside */
    }
    
    /* Overlay for locked boxes */
    .locked-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4); /* Slightly dark overlay */
        z-index: 10;
        opacity: 0; /* Initial state: hidden */
        transition: opacity 0.5s ease-in-out; /* Transition definition */
    }

    /* Large, centered lock icon */
    .pro-lock-icon.large-lock {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--primary-color);
        font-size: 3em; /* Bigger lock */
        opacity: 0; /* Initial state: hidden */
        z-index: 11;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        transition: opacity 0.5s ease-in-out; /* Transition definition */
    }
    
    /* Active state for fade-in */
    .locked-overlay.fade-in-lock,
    .pro-lock-icon.fade-in-lock {
        opacity: 1;
    }

    /* Hide default progress label when locked for cleaner look */
    .cube-box.pro-locked .progress-label {
        opacity: 0.5;
    }
    
    /* Ensure hover effects don't interfere with the lock */
    .cube-box.pro-locked:hover {
        transform: none;
        cursor: default;
    }
`;
document.head.appendChild(style);