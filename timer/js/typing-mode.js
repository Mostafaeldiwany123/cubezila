//typing mode
function parseInput(value) {
    if (!value) return;
    
    // Handle DNF
    if (value.toLowerCase() === 'dnf') {
        sessions[currentSession].times.push('DNF');
        sessions[currentSession].scrambles.push(currentScramble);
    } else {
        // Remove any non-digits except + for +2
        let timeStr = value.replace(/[^\d+]/g, '');
        let penalty = timeStr.includes('+') ? 2 : 0;
        timeStr = timeStr.replace('+', '');
        
        let timeValue;
        if (timeStr.length === 3) {
            // 934 -> 9.34
            timeValue = parseInt(timeStr[0] + timeStr.slice(1)) / 100;
        } else if (timeStr.length === 4) {
            // 1234 -> 12.34
            timeValue = parseInt(timeStr.slice(0, 2) + timeStr.slice(2)) / 100;
        } else if (timeStr.length === 5) {
            // 12345 -> 1:23.45
            const minutes = parseInt(timeStr[0]);
            const seconds = (timeStr.slice(1, 3));
            const hundredths = parseInt(timeStr.slice(3));
            timeValue = minutes * 60 + seconds + hundredths / 100;
        } else if (timeStr.length === 6) {
            // 123456 -> 12:34.56
            const minutes = parseInt(timeStr.slice(0, 2));
            const seconds = parseInt(timeStr.slice(2, 4));
            const hundredths = parseInt(timeStr.slice(4));
            timeValue = minutes * 60 + seconds + hundredths / 100;
        } else {
            return;
        }
        
        if (!isNaN(timeValue) && timeValue > 0) {
            timeValue += penalty;
            
            // Format time with minutes if over 60 seconds
            let displayTime;
            if (timeValue >= 60) {
                const minutes = Math.floor(timeValue / 60);
                const seconds = (timeValue % 60).toFixed(2).padStart(5, '0');
                displayTime = `${minutes}:${seconds}`;
            } else {
                displayTime = timeValue.toFixed(2);
            }
            
            if (penalty) {
                displayTime += '+';
            }
            
            sessions[currentSession].times.push(timeValue);
            sessions[currentSession].scrambles.push(currentScramble);
        }
    }
    
    // Clear input and keep focus
    const input = document.querySelector('.typing-mode-wrapper input');
    input.value = '';
    input.focus();
    
    updateHistory();
    updateHistorySummary(); // Add this line to update all stats
    updateMobileStats(); // Add this to update mobile stats if present
    generateScramble();
    updateTwistyPlayer(currentScramble); // Add this to update scramble visualization
    if (autoSave) saveSessionsToLocalStorage();
}

function measureText(text, element) {
    const canvas = measureText.canvas || (measureText.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    const computedStyle = window.getComputedStyle(element);
    context.font = computedStyle.font;
    return context.measureText(text).width;
}

function convertToTypingMode() {
    // Clear the session input
    document.getElementById('newSessionName').value = '';
    
    const originalTimer = document.getElementById('timerDisplay');
    originalTimer.style.visibility = 'hidden';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'typing-mode-wrapper';
    wrapper.innerHTML = `
        <input type="text" class="timer-display">
        <span class="exit-typing-mode">×</span>
    `;
    
    // Add to body
    document.body.appendChild(wrapper);
    
    const input = wrapper.querySelector('input');
    const exitButton = wrapper.querySelector('.exit-typing-mode');
    
    // Add click handler to maintain focus
    wrapper.addEventListener('click', (e) => {
        // Only refocus if the click wasn't on another input element
        const activeElement = document.activeElement;
        if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) {
            input.focus();
        }
    });
    
    // Add global click handler to maintain focus
    document.addEventListener('click', function maintainFocus(e) {
        // Don't refocus if clicking on another input or the settings menu
        if (e.target.closest('#settingsMenu') || 
            e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Only refocus if we're still in typing mode
        const typingWrapper = document.querySelector('.typing-mode-wrapper');
        if (typingWrapper) {
            input.focus();
        } else {
            // Remove listener if we exit typing mode
            document.removeEventListener('click', maintainFocus);
        }
    });
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            parseInput(input.value);
        }
        e.stopPropagation();
    });
    
    exitButton.onclick = exitTypingMode;
    input.focus();
}

function exitTypingMode() {
    const typingWrapper = document.querySelector('.typing-mode-wrapper');
    if (typingWrapper) {
        typingWrapper.remove();
    }
    
    const originalTimer = document.getElementById('timerDisplay');
    originalTimer.style.visibility = 'visible';
    
    // Update the dropdown to keyboard mode
    const timerTypeSelect = document.getElementById('timerType');
    if (timerTypeSelect) {
        timerTypeSelect.value = 'keyboard';
    }
    
    // Remove any lingering global click handlers
    const oldHandlers = document.querySelectorAll('.typing-mode-wrapper');
    oldHandlers.forEach(handler => handler.remove());
}

function changeTimerType() {
    const timerType = document.getElementById('timerType').value;
    saveSetting('timerType', timerType);
    
    if (timerType === 'typing') {
        convertToTypingMode();
    } else {
        exitTypingMode();
    }
}

// Modify the document ready listener to initialize timer type from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTimerType = localStorage.getItem('timerType');
    if (savedTimerType) {
        const timerTypeSelect = document.getElementById('timerType');
        timerTypeSelect.value = savedTimerType;
        if (savedTimerType === 'typing') {
            convertToTypingMode();
        }
    }
    
    //event listener for typing mode checkbox
    const typingModeCheckbox = document.getElementById('typingMode');
    if (typingModeCheckbox) {
        typingModeCheckbox.addEventListener('change', function() {
            if (this.checked) {
                convertToTypingMode();
            } else {
                exitTypingMode();
            }
        });
    }
});