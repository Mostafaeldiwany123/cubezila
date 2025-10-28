function addPenalty(index) {
    if (!sessions[currentSession].penalties) {
        sessions[currentSession].penalties = [];
    }
    
    if (sessions[currentSession].times[index] !== Infinity) {
        if (sessions[currentSession].penalties[index] === '+2') {
            // Remove penalty
            sessions[currentSession].penalties[index] = undefined;
            sessions[currentSession].times[index] -= 2;
        } else {
            // Add penalty
            sessions[currentSession].penalties[index] = '+2';
            sessions[currentSession].times[index] += 2;
        }
        
        // Update timer display if it's the last solve
        if (index === sessions[currentSession].times.length - 1) {
            const time = sessions[currentSession].times[index];
            if (time === Infinity) {
                timerDisplay.textContent = 'DNF';
            } else {
                timerDisplay.textContent = formatTime(time * 1000) + (sessions[currentSession].penalties[index] === '+2' ? '+' : '');
            }
        }
    }
    
    // Update popup if it's open
    const popup = document.querySelector('.detail-popup');
    if (popup && popup.dataset.index == index) {
        const timeDisplay = popup.querySelector('.popup-time');
        if (timeDisplay) {
            const time = sessions[currentSession].times[index];
            if (sessions[currentSession].penalties?.[index] === '+2') {
                timeDisplay.textContent = `${formatTime(time * 1000)}+`;
            } else {
                timeDisplay.textContent = formatTime(time * 1000);
            }
        }
    }

    // Save penalties to localStorage
    if (autoSave) {
        saveSessionsToLocalStorage();
    }
       updateHistorySummary();
    updateHistory();
}

function markDNF(index) {
    if (!sessions[currentSession].originalTimes) {
        sessions[currentSession].originalTimes = {};
    }

    if (sessions[currentSession].times[index] === DNF_VALUE) {
        // If it's currently DNF, restore the original time
        sessions[currentSession].times[index] = sessions[currentSession].originalTimes[index];
        delete sessions[currentSession].originalTimes[index];
    } else {
        // If it's not DNF, mark it as DNF and save original time
        sessions[currentSession].originalTimes[index] = sessions[currentSession].times[index];
        sessions[currentSession].times[index] = DNF_VALUE;
    }
    
    // Update timer display if it's the last solve
    if (index === sessions[currentSession].times.length - 1) {
        const time = sessions[currentSession].times[index];
        if (time === DNF_VALUE) {
            timerDisplay.textContent = 'DNF';
        } else {
            timerDisplay.textContent = formatTime(time * 1000);
        }
    }
    
    // Update popup if it's open
    const popup = document.querySelector('.detail-popup');
    if (popup && popup.dataset.index == index) {
        const timeDisplay = popup.querySelector('.popup-time');
        if (timeDisplay) {
            if (sessions[currentSession].times[index] === DNF_VALUE) {
                timeDisplay.textContent = 'DNF';
            } else {
                timeDisplay.textContent = formatTime(sessions[currentSession].times[index] * 1000);
            }
        }
    }
   updateHistorySummary();
    updateHistory();
    if (autoSave) saveSessionsToLocalStorage();
}

function isDNF(index) {
    return sessions[currentSession].times[index] === Infinity;
}