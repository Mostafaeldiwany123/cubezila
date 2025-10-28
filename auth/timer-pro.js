import { auth } from '../js/firebase-config.js';
import { getUserProfile } from '../js/user-service.js';
import { onAuthStateChange } from '../js/auth-service.js';

// Pro user effects for timer
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChange(async (user) => {
        if (user && user.profile) {
            const userRole = user.profile.role;
            
            if (userRole === 'pro_user' || userRole === 'admin') {
                applyProEffects();
                enableProFeatures();
                // Check if welcome message has been shown before in this session
                const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
                if (!hasSeenWelcome) {
                    showWelcomeMessage(userRole);
                    sessionStorage.setItem('hasSeenWelcome', 'true');
                }
            } else {
                // If not pro/admin, disable pro features
                disableProFeatures();
            }
        } else {
            // No user logged in, disable pro features
            disableProFeatures();
        }
    });
});

function applyProEffects() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.classList.add('pro-timer');
        
        // Add glow effect
        let glowDiv = timerDisplay.parentElement.querySelector('.timer-glow');
        if (!glowDiv) { // Only create if it doesn't exist
            glowDiv = document.createElement('div');
            glowDiv.className = 'timer-glow';
            timerDisplay.parentElement.appendChild(glowDiv);
        }
    }
}

function enableProFeatures() {
    // Enable inspection time input
    const inspectionTime = document.getElementById('inspectionTime');
    if (inspectionTime) {
        inspectionTime.disabled = false;
        inspectionTime.classList.remove('pro-feature');
        const proLock = inspectionTime.parentElement.querySelector('.pro-lock');
        if (proLock) proLock.remove();
    }

    // Enable multi-phase timing
    const multiPhase = document.getElementById('multiPhase');
    if (multiPhase) {
        multiPhase.disabled = false;
        multiPhase.classList.remove('pro-feature');
        const proLock = multiPhase.parentElement.querySelector('.pro-lock');
        if (proLock) proLock.remove();
    }

    // Enable highlight best time
    const highlightBest = document.getElementById('highlightBest');
    if (highlightBest) {
        highlightBest.disabled = false;
        highlightBest.classList.remove('pro-feature');
        const proLock = highlightBest.parentElement.querySelector('.pro-lock');
        if (proLock) proLock.remove();
    }

    // Enable sound effects
    const soundEffects = document.getElementById('soundEffects');
    if (soundEffects) {
        soundEffects.disabled = false;
        soundEffects.classList.remove('pro-feature');
        const proLock = soundEffects.parentElement.querySelector('.pro-lock');
        if (proLock) proLock.remove();
    }

    // Enable pro voices
    const proVoices = document.querySelectorAll('.dropdown-item.voice-item[data-voice-type="pro"]');
    proVoices.forEach(voice => {
        voice.classList.remove('pro-feature');
        const controls = voice.querySelector('.voice-controls');
        if (controls) {
            const playIcon = controls.querySelector('.preview-icon');
            const proIcon = controls.querySelector('.pro-icon');
            if (playIcon) {
                const voiceId = playIcon.dataset.voice || voice.textContent.trim().toLowerCase().replace(' ', '');
                playIcon.onclick = (e) => togglePreview(e, voiceId);
            }
            if (proIcon) proIcon.remove();
        }
        // Re-enable click handler
        const voiceName = voice.textContent.trim();
        voice.onclick = () => selectVoice(voiceName.toLowerCase().replace(' ', ''));
    });

    // Enable pro themes
    const proThemes = ['neon', 'blue', 'green', 'red', 'golden', 'kids', 'lightblue'];
    proThemes.forEach(theme => {
        const themeLink = document.querySelector(`.premium-theme[data-theme="${theme}"]`);
        if (themeLink) {
            themeLink.classList.remove('locked');
            themeLink.setAttribute('onclick', `setTheme('${theme}')`);
            const lockIcon = themeLink.querySelector('.fa-lock');
            if (lockIcon) {
                lockIcon.remove();
            }
        }
    });

    // Enable cross solver
    const crossSolver = document.getElementById('crossSolver');
    if (crossSolver) {
        crossSolver.disabled = false;
        crossSolver.classList.remove('pro-feature');
        const proLock = crossSolver.parentElement.querySelector('.pro-lock');
        if (proLock) proLock.remove();
    }
}

function disableProFeatures() {
    // Remove pro effects
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.classList.remove('pro-timer');
        const glowDiv = document.querySelector('.timer-glow');
        if (glowDiv) glowDiv.remove();
    }

    // Disable inspection time input
    const inspectionTime = document.getElementById('inspectionTime');
    if (inspectionTime) {
        inspectionTime.disabled = true;
        inspectionTime.classList.add('pro-feature');
        // Add lock icon if not present
        if (!inspectionTime.parentElement.querySelector('.pro-lock')) {
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fas fa-lock pro-lock';
            inspectionTime.parentElement.appendChild(lockIcon);
        }
    }

    // Disable multi-phase timing
    const multiPhase = document.getElementById('multiPhase');
    if (multiPhase) {
        multiPhase.disabled = true;
        multiPhase.classList.add('pro-feature');
        if (!multiPhase.parentElement.querySelector('.pro-lock')) {
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fas fa-lock pro-lock';
            multiPhase.parentElement.appendChild(lockIcon);
        }
    }

    // Disable highlight best time
    const highlightBest = document.getElementById('highlightBest');
    if (highlightBest) {
        highlightBest.disabled = true;
        highlightBest.classList.add('pro-feature');
        if (!highlightBest.parentElement.querySelector('.pro-lock')) {
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fas fa-lock pro-lock';
            highlightBest.parentElement.appendChild(lockIcon);
        }
    }

    // Disable sound effects
    const soundEffects = document.getElementById('soundEffects');
    if (soundEffects) {
        soundEffects.disabled = true;
        soundEffects.classList.add('pro-feature');
        if (!soundEffects.parentElement.querySelector('.pro-lock')) {
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fas fa-lock pro-lock';
            soundEffects.parentElement.appendChild(lockIcon);
        }
    }

    // Disable pro voices
    const proVoices = document.querySelectorAll('.dropdown-item.voice-item[data-voice-type="pro"]');
    proVoices.forEach(voice => {
        voice.classList.add('pro-feature');
        voice.onclick = null; // Remove click handler
        const controls = voice.querySelector('.voice-controls');
        if (controls) {
            const playIcon = controls.querySelector('.preview-icon');
            if (playIcon) playIcon.onclick = null;
            // Add lock icon if not present
            if (!controls.querySelector('.pro-icon')) {
                const proIcon = document.createElement('i');
                proIcon.className = 'fas fa-lock pro-icon';
                controls.appendChild(proIcon);
            }
        }
    });

    // Disable pro themes
    const proThemes = ['neon', 'blue', 'green', 'red', 'golden', 'kids', 'lightblue'];
    proThemes.forEach(theme => {
        const themeLink = document.querySelector(`.premium-theme[data-theme="${theme}"]`);
        if (themeLink) {
            themeLink.classList.add('locked');
            themeLink.removeAttribute('onclick');
            // Add lock icon if not present
            if (!themeLink.querySelector('.fa-lock')) {
                const lockIcon = document.createElement('i');
                lockIcon.className = 'fas fa-lock';
                themeLink.appendChild(lockIcon);
            }
        }
    });

    // Disable cross solver
    const crossSolver = document.getElementById('crossSolver');
    if (crossSolver) {
        crossSolver.disabled = true;
        crossSolver.classList.add('pro-feature');
        if (!crossSolver.parentElement.querySelector('.pro-lock')) {
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fas fa-lock pro-lock';
            crossSolver.parentElement.appendChild(lockIcon);
        }
    }
}

function showWelcomeMessage(role) {
    // Create welcome container
    const welcomeContainer = document.createElement('div');
    welcomeContainer.className = 'welcome-container';
    
    // Create welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    welcomeMessage.innerHTML = `
        <div class="welcome-content">
            <div class="welcome-icon">
                <i class="fas fa-${role === 'admin' ? 'shield-alt' : 'crown'}"></i>
            </div>
            <div class="welcome-text">
                <h3>${role === 'admin' ? 'Welcome Admin!' : 'Welcome Pro User!'}</h3>
                <p>${role === 'admin' ? 'Full access enabled' : 'Premium features unlocked'}</p>
            </div>
        </div>
    `;
    
    // Add to document
    welcomeContainer.appendChild(welcomeMessage);
    document.body.appendChild(welcomeContainer);
    
    // Trigger animation
    setTimeout(() => {
        welcomeMessage.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        welcomeMessage.classList.add('hide');
        setTimeout(() => welcomeContainer.remove(), 500);
    }, 4000);
}