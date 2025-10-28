let isDesktopFocusModeActive = false;
let isDesktopFocusEnabled = true;
let spaceHoldTimer;
let overlay;

async function enterDesktopFocusMode() {
    if (!isDesktopFocusEnabled || isDesktopFocusModeActive) return;
    
    isDesktopFocusModeActive = true;
    
    const focusModeType = document.getElementById('focusModeType').value;
    
    if (focusModeType === 'overlay') {
        overlay = document.createElement('div');
        overlay.className = 'focus-mode-overlay';
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('fade-in');
        });
    } else {
        document.body.classList.add('background-focus-mode');
    }

    const exitButton = document.createElement('button');
    exitButton.className = 'desktop-focus-exit-button';
    exitButton.innerHTML = '<i class="fas fa-times"></i>';
    exitButton.onclick = exitDesktopFocusMode;
    document.body.appendChild(exitButton);

    document.querySelectorAll('.scramble-header, .mini-stats-bar, .mobile-stat, .container, .mobile-tabs, .left-panel, .right-panel, .collapse-btn, .scramble-icons, .scramble-display, .scramble-visualization-box, .tools-controls, .timer-elements, .timer-actions-buttons, .timer-averages')
        .forEach(el => el.classList.add('desktop-focus-hidden'));
}

function exitDesktopFocusMode() {
    if (!isDesktopFocusModeActive) return;
    
    const focusModeType = document.getElementById('focusModeType').value;
    
    if (focusModeType === 'overlay') {
        if (overlay) {
            overlay.classList.add('fade-out');
            overlay.addEventListener('transitionend', () => {
                overlay.remove();
            });
        }
    } else {
        document.body.classList.remove('background-focus-mode');
    }

    document.querySelector('.desktop-focus-exit-button')?.remove();
    document.querySelectorAll('.desktop-focus-hidden')
        .forEach(el => el.classList.remove('desktop-focus-hidden'));
    
    isDesktopFocusModeActive = false;
}

function changeFocusModeType() {
    const type = document.getElementById('focusModeType').value;
    saveSetting('focusModeType', type);
}

// Modify toggle function to use settingsUI
async function toggleDesktopFocusMode() {
    isDesktopFocusEnabled = document.getElementById('focusMode').checked;
    saveSetting('focusModeEnabled', isDesktopFocusEnabled);
    
    if (isDesktopFocusEnabled) {
        showNotification('Focus mode enabled. Start the timer to see the difference', {
            duration: 3000
        });
    }
}

// Initialize from settingsUI instead of local
document.addEventListener('DOMContentLoaded', () => {
    const focusModeCheckbox = document.getElementById('focusMode');
    if (focusModeCheckbox) {
        focusModeCheckbox.checked = settingsUI.focusModeEnabled !== false; // Default to true if not set
        isDesktopFocusEnabled = focusModeCheckbox.checked;
    }
    const savedFocusModeType = settingsUI.focusModeType || 'background'; // Default to "background"
    document.getElementById('focusModeType').value = savedFocusModeType;
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const focusModeCheckbox = document.getElementById('focusMode');
        if (focusModeCheckbox) {
            focusModeCheckbox.checked = !focusModeCheckbox.checked;
            toggleDesktopFocusMode();
        }
    }
    
    if (e.key === 'Escape' && isDesktopFocusModeActive) {
        exitDesktopFocusMode();
    }
});

// Add space button hold detection
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !e.repeat && isDesktopFocusEnabled && !isDesktopFocusModeActive) {
        spaceHoldTimer = setTimeout(() => {
            enterDesktopFocusMode();
        }, 400); // Hold for 500ms to activate
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code === 'Space') {
        clearTimeout(spaceHoldTimer);
    }
});
