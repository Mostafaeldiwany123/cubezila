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
        const link = box.getAttribute('onclick');
        if (!link) return;

        const targetPage = link.match(/window\.location\.href='(.*?)'/)?.[1];
        if (!targetPage) return;

        const isProAlg = PRO_ALGS.some(alg => targetPage.includes(alg));

        if (isProAlg) {
            // Add lock icon visually
            if (!box.querySelector('.pro-lock-icon')) {
                const lockIcon = document.createElement('i');
                lockIcon.className = 'fas fa-lock pro-lock-icon';
                box.appendChild(lockIcon);
            }

            // Override click behavior
            box.setAttribute('data-target-href', targetPage);
            box.removeAttribute('onclick');
            box.addEventListener('click', handleProClick);
        }
    });
}

function handleProClick(event) {
    event.preventDefault();
    const box = event.currentTarget;
    const targetHref = box.getAttribute('data-target-href');

    if (isProUser()) {
        // Allow navigation
        window.location.href = targetHref;
    } else {
        // Deny access and show notification
        showNotification('Upgrade to Pro to unlock this algorithm!', 'fas fa-crown', 5000);
        
        // Optional: Redirect to pricing page after a short delay
        setTimeout(() => {
            window.location.href = PRICING_PAGE;
        }, 1000);
    }
}

// Add CSS for the lock icon
const style = document.createElement('style');
style.textContent = `
    .cube-box {
        position: relative;
    }
    .pro-lock-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        color: var(--primary-color);
        font-size: 1.2em;
        opacity: 0.8;
        transition: opacity 0.3s;
    }
    .cube-box:hover .pro-lock-icon {
        opacity: 1;
    }
`;
document.head.appendChild(style);