let timer;
let inspectionTimer;
let startTime;
let elapsedTime = 0;
let isRunning = false;
let isInspecting = false;
let isSpacePressed = false;
let inspectionTime = 15;
let inspectionEnabled = true;
let times = [];
let scrambles = [];
let currentScramble = "";
let scrambleType = "3x3";
let highlightBest = false;
let soundEffects = false;
let keyboardShortcuts = true;
let hideTimer = false;
let showMilliseconds = true;
let decimalPlaces = 2; // Add this new variable
let autoSave = true;
let removedSolves = []; 
let isLeftCtrlPressed = false;
let isRightCtrlPressed = false;
let isCtrlComboPressed = false;
let isLeftShiftPressed = false;
let isRightShiftPressed = false;
let isShiftComboPressed = false;

let pendingPenalty = false;
let pendingDNF = false;
let inspectionStartTime = null;

const timerDisplay = document.getElementById('timerDisplay');
const inspectionDisplay = document.getElementById('inspectionDisplay');
const historyList = document.getElementById('historyList');
const average3of5Display = document.getElementById('average3of5');
const average12Display = document.getElementById('average12');
const average100Display = document.getElementById('average100');
const bestTimeDisplay = document.getElementById('bestTime');
const worstTimeDisplay = document.getElementById('worstTime');
const scrambleDisplay = document.getElementById('scrambleDisplay');
const twistyPlayer = document.getElementById('scramble-display-player');
const meanDisplay = document.getElementById('mean');
const stdDevDisplay = document.getElementById('stdDev');
const cvDisplay = document.getElementById('cvValue');
const DNF_VALUE = "DNF"; // Use this instead of Infinity

//user identification 
async function verifyProAccess() {
    const user = firebase.auth().currentUser;
    if (!user) return false;

    try {
        const snapshot = await firebase.database()
            .ref(`users/${user.uid}/role`)
            .once('value');
        
        const userRole = snapshot.val();
        return userRole === 'pro_user' || userRole === 'admin';
    } catch {
        return false;
    }
} 

//mouse timer
timerDisplay.addEventListener('click', toggleTimer);

//mobile touch events listeners
timerDisplay.addEventListener('touchstart', handleTouchStart);
timerDisplay.addEventListener('touchend', handleTouchEnd);


function handleTouchStart(event) {
    event.preventDefault();
    isSpacePressed = true;
}

function handleTouchEnd(event) {
    event.preventDefault();
    if (isSpacePressed) {
        isSpacePressed = false;
        handleSpaceKeyPress();
    }
}

document.addEventListener('keydown', (event) => {
    if (!keyboardShortcuts) return;

    // Check if user is typing in ANY input field or textarea
    const isInputActive = document.activeElement.tagName === 'INPUT' || 
                         document.activeElement.tagName === 'TEXTAREA' ||
                         document.activeElement.isContentEditable;
    
    if (isInputActive) {
        // Don't prevent default for Ctrl/Cmd+Z
        if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
            return;
        }
        // Prevent all other keyboard shortcuts
        return;
    }

    // Handle Undo (Command+Z on Mac, Control+Z on Windows)
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        event.preventDefault();
        
        // First check if we need to undo a recently created session
        const sessionSelector = document.getElementById('sessionSelector');
        const currentSessionName = sessionSelector.value;
        
        if (currentSessionName !== '3x3' && 
            sessions[currentSessionName] && 
            sessions[currentSessionName].times.length === 0) {
            
            if (confirm(`Do you want to remove the empty session "${currentSessionName}"?`)) {
                delete sessions[currentSessionName];
                
                // Remove from session selector
                const optionToRemove = sessionSelector.querySelector(`option[value="${currentSessionName}"]`);
                if (optionToRemove) {
                    optionToRemove.remove();
                }
                
                // Switch back to 3x3 session
                currentSession = "3x3";
                sessionSelector.value = currentSession;
                changeSession();
                saveSessionsToLocalStorage();
                return;
            }
        }
        
        // If not undoing session creation, handle solve undo
        if (removedSolves.length > 0) {
            const lastRemoved = removedSolves.pop();
            sessions[currentSession].times.push(lastRemoved.time);
            sessions[currentSession].scrambles.push(lastRemoved.scramble);
            updateHistory();
            updateHistorySummary();
            updateMobileStats();
            if (autoSave) saveSessionsToLocalStorage();
        }
        return;
    }

    // Rest of your keyboard shortcut handling...
    if (event.code === 'Space') {
        event.preventDefault();
        isSpacePressed = true;
    }

    // Handle Ctrl key presses
    if (event.code === 'ControlLeft') {
        isLeftCtrlPressed = true;
        if (isRightCtrlPressed) {
            isCtrlComboPressed = true;
        }
    }
    if (event.code === 'ControlRight') {
        isRightCtrlPressed = true;
        if (isLeftCtrlPressed) {
            isCtrlComboPressed = true;
        }
    }

    // Handle Shift key presses
    if (event.code === 'ShiftLeft') {
        isLeftShiftPressed = true;
        if (isRightShiftPressed) {
            isShiftComboPressed = true;
        }
    }
    if (event.code === 'ShiftRight') {
        isRightShiftPressed = true;
        if (isLeftShiftPressed) {
            isShiftComboPressed = true;
        }
    }

    if (event.key === '2') {
        event.preventDefault();
        if (sessions[currentSession].times.length > 0) {
            const lastSolveIndex = sessions[currentSession].times.length - 1;
            addPenalty(lastSolveIndex, '+2');
        }
    }

    if (event.key.toLowerCase() === 'd') {
        event.preventDefault();
        if (sessions[currentSession].times.length > 0) {
            const lastSolveIndex = sessions[currentSession].times.length - 1;
            markDNF(lastSolveIndex);
        }
    }


    if (event.code === 'KeyR') resetHistory();
    if (event.code === 'KeyI') {
        if (sessions[currentSession].times.length > 0) {
            const lastSolveIndex = sessions[currentSession].times.length - 1;
            showDetails(lastSolveIndex);
        }
    }

    // Update 'P' key handler for delete
    if (event.key.toLowerCase() === 'p' && sessions[currentSession].times.length > 0) {
        event.preventDefault();
        const lastIndex = sessions[currentSession].times.length - 1;
        removeSolve(lastIndex);
        timerDisplay.textContent = "0.00"; // Reset timer display
    }
}); 

document.addEventListener('keyup', (event) => {
    if (!keyboardShortcuts) return;
    if (event.code === 'Space' && isSpacePressed) {
        isSpacePressed = false;
        handleSpaceKeyPress();
    }

    // Handle Ctrl key releases
    if (event.code === 'ControlLeft') {
        isLeftCtrlPressed = false;
        if (!isRightCtrlPressed && isCtrlComboPressed) {
            isCtrlComboPressed = false;
            handleSpaceKeyPress();
        }
    }
    if (event.code === 'ControlRight') {
        isRightCtrlPressed = false;
        if (!isLeftCtrlPressed && isCtrlComboPressed) {
            isCtrlComboPressed = false;
            handleSpaceKeyPress();
        }
    }

    // Handle Shift key releases
    if (event.code === 'ShiftLeft') {
        isLeftShiftPressed = false;
        if (!isRightShiftPressed && isShiftComboPressed) {
            isShiftComboPressed = false;
            handleSpaceKeyPress();
        }
    }
    if (event.code === 'ShiftRight') {
        isRightShiftPressed = false;
        if (!isLeftShiftPressed && isShiftComboPressed) {
            isShiftComboPressed = false;
            handleSpaceKeyPress();
        }
    }
});


function handleSpaceKeyPress() {
    if (isRunning) {
        toggleTimer();
    } else if (isInspecting) {
        cancelAnimationFrame(inspectionTimer);
        const elapsed = Date.now() - inspectionStartTime;
        if (elapsed < inspectionTime * 1000) {
             // Phase 1: Started on time – no penalty.
             pendingPenalty = false;
             pendingDNF = false;
        } else if (elapsed < (inspectionTime + 2) * 1000) {
             // Phase 2: Started between 15 and 17 seconds – flag for +2 penalty.
             pendingPenalty = true;
             pendingDNF = false;
        } else {
             // Phase 3: More than 17 seconds – flag as DNF.
             pendingDNF = true;
             pendingPenalty = false;
        }
        isInspecting = false;
        // Instead of immediately recording a DNF solve, we now allow the user to start the solve.
        toggleTimer();
    } else if (inspectionEnabled) {
        toggleInspectionTimer();
    } else {
        toggleTimer();
    }
}
function saveAllSessionData() {
            localStorage.setItem('cubeSessions_v2', JSON.stringify(sessions));
        }

//toggling the timer
function toggleTimer() {
    if (isRunning) {
        cancelAnimationFrame(timer);
        isRunning = false;
        const finalTime = elapsedTime / 1000;

        if (!sessions[currentSession].inspectionTimes) {
            sessions[currentSession].inspectionTimes = [];
        }
        
        const usedInspectionTime = isInspecting ? 
            (15 - Math.ceil((Date.now() - inspectionStartTime) / 1000)) : 0;
            
        sessions[currentSession].inspectionTimes.push(usedInspectionTime);
        
        isInspecting = false;
        inspectionStartTime = null;
        
        // Initialize dates array if it doesn't exist
        if (!sessions[currentSession].dates) {
            sessions[currentSession].dates = [];
        }
        
        sessions[currentSession].times.push(finalTime);
        sessions[currentSession].scrambles.push(currentScramble);
        sessions[currentSession].dates.push(Date.now());
        
        if (pendingPenalty) {
             addPenalty(sessions[currentSession].times.length - 1);
             pendingPenalty = false;
        }
        
        if (pendingDNF) {
             markDNF(sessions[currentSession].times.length - 1);
             pendingDNF = false;
        }
        
        updateHistory();
        updateHistorySummary(); // This will now update both stats and timer elements
        updateMobileStats();
        
        inspectionDisplay.style.display = 'none';
        generateScramble();

        if (soundEffects) playSound('stop');
        saveAllSessionData();
        checkForNewBest(finalTime);
        exitDesktopFocusMode();
        
        timerDisplay.style.color = 'inherit';
    } else {
        // Reset inspection tracking when starting new solve
        inspectionStartTime = isInspecting ? Date.now() : null;
        
        // Only change color if we're not already timing
        if (!isRunning) {
            const readyColor = settingsUI.timerReadyColor || "#1cbc9c";
            timerDisplay.style.color = readyColor;
        }
        
        // Enter focus mode if inspection is disabled, regardless of focus mode setting
        if (!inspectionEnabled) {
            enterDesktopFocusMode();
        }
        
        // Reset elapsedTime before starting new timer
        elapsedTime = 0;
        timerDisplay.textContent = "0.00";  // Reset display
        
        startTime = Date.now();
        function updateTimer() {
            elapsedTime = Date.now() - startTime;
            if (hideTimer) {
                timerDisplay.textContent = "SOLVING";
            } else {
                timerDisplay.textContent = formatTime(elapsedTime);
            }
            if (isRunning) {
                timer = requestAnimationFrame(updateTimer);
            } 
        }
        isRunning = true;
        timer = requestAnimationFrame(updateTimer);
        if (soundEffects) playSound('start');
    }
    
    if (hideTimer) {
        timerDisplay.style.visibility = isRunning ? 'visible' : 'visible';
        timerDisplay.textContent = isRunning ? 'SOLVING' : formatTime(elapsedTime);
    }
}

// --- Multiphase integration ---
function isMultiphaseActive() {
    // Check if multiphase tool is selected and visible
    const toolsSelect = document.querySelector('.tools-select');
    return toolsSelect && toolsSelect.value === 'multiphase' && window.multiphaseTool;
}

// Callback for when multiphase finishes
window.onMultiphaseFinish = function(phaseTimes, totalTime) {
    // Save phase times to session
    const session = sessions[currentSession];
    if (!session.phaseTimes) session.phaseTimes = [];
    // Store as {phases, total}
    session.phaseTimes[session.times.length - 1] = {
        phases: phaseTimes,
        total: totalTime
    };
    if (autoSave) saveSessionsToLocalStorage();
    updateHistory();
    updateHistorySummary();
};

// Patch toggleTimer for multiphase
const originalToggleTimer = toggleTimer;
toggleTimer = function() {
    if (isMultiphaseActive()) {
        // If timer is not running, start multiphase and timer
        if (!isRunning) {
            window.multiphaseTool.start();
            elapsedTime = 0;
            timerDisplay.textContent = "0.00";
            startTime = Date.now();
            function updateTimer() {
                elapsedTime = Date.now() - startTime;
                if (hideTimer) {
                    timerDisplay.textContent = "SOLVING";
                } else {
                    timerDisplay.textContent = formatTime(elapsedTime);
                }
                if (isRunning) {
                    timer = requestAnimationFrame(updateTimer);
                }
            }
            isRunning = true;
            timer = requestAnimationFrame(updateTimer);
            if (soundEffects) playSound('start');
            return;
        } else if (window.multiphaseTool.isActive() && window.multiphaseTool.getCurrentPhase() < window.multiphaseTool.getPhaseCount() - 1) {
            // If running and not last phase, record split
            window.multiphaseTool.split();
            return;
        } else if (window.multiphaseTool.isActive()) {
            // Last split: finish multiphase and stop timer
            // Use elapsedTime for the recorded time, not Date.now() - startTime
            window.multiphaseTool.split(); // This will finish and call onMultiphaseFinish
            isRunning = false;
            cancelAnimationFrame(timer);
            const elapsedSeconds = elapsedTime / 1000;
            const session = sessions[currentSession];
            session.times.push(elapsedSeconds);
            session.scrambles.push(currentScramble);
            if (!session.inspectionTimes) session.inspectionTimes = [];
            session.inspectionTimes.push(session.lastInspectionTime || 0);
            delete session.lastInspectionTime;
            if (autoSave) saveSessionsToLocalStorage();
            updateHistory();
            updateHistorySummary();
            generateScramble();
            exitDesktopFocusMode();
            timerDisplay.style.color = 'inherit';
            return;
        }
    }
    // Fallback to original toggleTimer for normal solves
    originalToggleTimer.apply(this, arguments);
}

function stopTimer() {
    isRunning = false;
    cancelAnimationFrame(timer);
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    
    const session = sessions[currentSession];
    session.times.push(elapsedSeconds);
    session.scrambles.push(currentScramble);
    
    // Store inspection time for this solve
    if (!session.inspectionTimes) {
        session.inspectionTimes = [];
    }
    session.inspectionTimes.push(session.lastInspectionTime || 0);
    delete session.lastInspectionTime;
    
    // Initialize phaseTimes array if it doesn't exist
    if (!session.phaseTimes) {
        session.phaseTimes = new Array(session.times.length).fill(undefined);
    }
    
    // Explicitly set undefined for non-multi-phase solves
    session.phaseTimes[session.times.length - 1] = undefined;
    
    if (autoSave) {
        saveSessionsToLocalStorage();
    }
    
    updateHistory();
    updateHistorySummary();
    generateScramble();
}


function formatTime(time) {
    const seconds = time / 1000;
    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(decimalPlaces).padStart(3 + decimalPlaces, '0');
        return `${minutes}:${remainingSeconds}`;
    }
    return typeof seconds === 'number' ? seconds.toFixed(decimalPlaces) : seconds;
}

function changeDecimalPlaces() {
    const value = parseInt(document.getElementById('decimalPlaces').value);
    decimalPlaces = value;
    saveSetting('decimalPlaces', value);
    
    // Update current timer display without changing the actual time
    if (!isRunning) {
        // Check if current display is DNF or contains a plus
        const currentDisplay = timerDisplay.textContent;
        if (currentDisplay === "DNF") {
            return;
        }
        
        // Handle potential +2 penalty
        const hasPenalty = currentDisplay.endsWith('+');
        let timeValue = parseFloat(currentDisplay.replace('+', ''));
        if (!isNaN(timeValue)) {
            timerDisplay.textContent = formatTime(timeValue * 1000) + (hasPenalty ? '+' : '');
        }
    }
    
    // Force history list update while preserving all solve data
    updateHistory();
}


function getTwistyPuzzleType(scrambleType) {
    // Main puzzles mapping
    const mainPuzzles = {
        '2x2': '2x2x2',
        '3x3': '3x3x3',
        '4x4': '4x4x4',
        '5x5': '5x5x5',
        '6x6': '6x6x6',
        '7x7': '7x7x7',
        'megaminx': 'megaminx',
        'Pyraminx': 'pyraminx',
        'pyraminx': 'pyraminx',
        'skewb': 'skewb',
        'Square-1': 'square1',
        'square-1': 'square1',
        'square1': 'square1',
        'Clock': 'clock',
        'clock': 'clock'
    };

    // All 3x3 subsets should show a 3x3 cube
    const subsets = [
        'PLL', 'OLL', 'ZBLL', 'CMLL', 'COLL', 'EPLL',
        'F2L', 'LSE', 'L10P', 'RU', 'RUD', 'RUL'
    ];

    if (subsets.includes(scrambleType)) {
        return '3x3x3';
    }

    return mainPuzzles[scrambleType] || '3x3x3';
}

function changeScrambleType() {
    const selectedScrambleType = sessions[currentSession].scrambleType;
    const twistyPlayer = document.getElementById('scramble-display-player');
    const twistyPuzzleType = getTwistyPuzzleType(selectedScrambleType);
    
    if (twistyPlayer) {
        twistyPlayer.puzzle = twistyPuzzleType;
        twistyPlayer.setAttribute('visualization', '2D');
    }
    
    generateScramble();
}

//inspection time 
function toggleInspectionEnabled() {
    inspectionEnabled = document.getElementById('enableInspection').checked;
    saveSetting('inspectionEnabled', inspectionEnabled);
}
async function toggleInspectionTimer() {
    if (!inspectionEnabled) {
        toggleTimer();
        return;
    }

    if (isInspecting) {
        cancelAnimationFrame(inspectionTimer);
        timerDisplay.textContent = inspectionTime.toString();
        isInspecting = false;
    exitDesktopFocusMode(); // Exit focus mode when inspection stops
    } else {
        cancelAnimationFrame(inspectionTimer);

        // Check if it's a pro voice and verify access
        let voiceToUse = selectedVoice;
        if (selectedVoice === 'female1' || selectedVoice === 'female2') {
            if (!await verifyProAccess()) {
                // If no pro access, fallback to male1
                voiceToUse = 'male1';
            }
        }

        // Get selected voice audio files
        const { audio8, audio3 } = voiceAudios[voiceToUse];
        const alert8 = new Audio(audio8);
        const alert3 = new Audio(audio3);

        let played8 = false;
        let played3 = false;

        isInspecting = true;
        inspectionStartTime = Date.now();

    enterDesktopFocusMode(); // Enter focus mode when inspection starts

        // Add inspection color here
        const inspectionColor = settingsUI.inspectionColor || 'inherit';
        timerDisplay.style.color = inspectionColor;

        // Three-phase inspection timer with audio alerts
        const updateInspectionTimer = () => {
            const elapsed = Date.now() - inspectionStartTime;
            if (elapsed < inspectionTime * 1000) {
                // Phase 1: Normal countdown
                const remaining = Math.ceil((inspectionTime * 1000 - elapsed) / 1000);
                timerDisplay.textContent = remaining;
                // Audio alerts: play alert at 7 and 3 seconds left if not already played
                if (remaining === 7 && !played8) {
                    alert8.play();
                    played8 = true;
                }
                if (remaining === 3 && !played3) {
                    alert3.play();
                    played3 = true;
                }
                inspectionTimer = requestAnimationFrame(updateInspectionTimer);
            } else if (elapsed < (inspectionTime + 2) * 1000) {
                // Phase 2: Inspection time exceeded—show "+2"
                timerDisplay.textContent = "+2";
                inspectionTimer = requestAnimationFrame(updateInspectionTimer);
            } else {
                // Phase 3: More than 17 seconds—show "DNF" and set flag
                timerDisplay.textContent = "DNF";
                pendingDNF = true;
                cancelAnimationFrame(inspectionTimer);
            exitDesktopFocusMode();
            }
            
            // Store the used inspection time (optional)
            const usedInspectionTime = (inspectionTime * 1000 - Math.max(0, inspectionTime * 1000 - elapsed)) / 1000;
            sessions[currentSession].lastInspectionTime = usedInspectionTime;
        };

        updateInspectionTimer();
    }
}


async function changeInspectionTime() {
    const value = parseInt(document.getElementById('inspectionTime').value);
    inspectionTime = value;
    saveSetting('inspectionTime', value);
}


function changeTimerElements() {
    const elementsType = document.getElementById('timerElements').value;
    
    // Save setting first, before any returns
    saveSetting('timerElements', elementsType);
    
    const container = document.querySelector('.timer-elements');
    if (container) container.remove();
    
    if (elementsType === 'none') return;
    
    const elementsContainer = document.createElement('div');
    elementsContainer.className = 'timer-elements';
    
    if (elementsType === 'actions') {
        elementsContainer.innerHTML = `
            <div class="timer-actions-buttons">
                <button class="timer-action-button" onclick="addPenalty(sessions[currentSession].times.length - 1)" title="+2">
                    +2
                </button>
                <button class="timer-action-button" onclick="markDNF(sessions[currentSession].times.length - 1)" title="DNF">
                    <i class="fas fa-ban"></i>
                </button>
                <button class="timer-action-button" onclick="removeSolve(sessions[currentSession].times.length - 1)" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (elementsType === 'averages') {
        elementsContainer.innerHTML = `
            <div class="timer-averages">
                <div class="timer-average">
                    <span class="timer-average-label">ao5</span>
                    <span class="timer-average-value" id="timerAo5">--</span>
                </div>
                <div class="timer-average">
                    <span class="timer-average-label">ao12</span>
                    <span class="timer-average-value" id="timerAo12">--</span>
                </div>
            </div>
        `;
        // Elements will be updated by updateHistorySummary
        updateHistorySummary();
    }
    
    // Insert into body instead of timer container
    document.body.appendChild(elementsContainer);
    
    // Show elements with animation
    requestAnimationFrame(() => {
        elementsContainer.classList.add('show');
    });
}

//session management
function updateSessionSelector() {
    const sessionSelector = document.getElementById('sessionSelector');
    sessionSelector.innerHTML = '';
    Object.keys(sessions).forEach(sessionName => {
        const option = document.createElement('option');
        option.value = sessionName;
        option.textContent = sessionName;
        sessionSelector.appendChild(option);
    });
}

function changeSession() {
    const sessionSelector = document.getElementById('sessionSelector');
    
    // Only prevent keyboard navigation within the select element itself
    sessionSelector.addEventListener('keypress', function(e) {
        if (document.activeElement === sessionSelector) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    currentSession = sessionSelector.value;
    
    // Force update scramble type from session data
    const currentScrambleType = sessions[currentSession].scrambleType;
    const scrambleTypeSelect = document.getElementById('scrambleType');
    if (scrambleTypeSelect) {
        scrambleTypeSelect.value = currentScrambleType;
    }

    // Update twisty player immediately
    const twistyPlayer = document.getElementById('scramble-display-player');
    if (twistyPlayer) {
        twistyPlayer.puzzle = getTwistyPuzzleType(currentScrambleType);
    }

    // Force UI updates
    changeScrambleType();
    updateHistory();
    updateHistorySummary();
    generateScramble();

    // Save current session to localStorage
    localStorage.setItem('currentTimerSession', currentSession);
    saveSessionsToLocalStorage();
}

document.addEventListener('DOMContentLoaded', () => {
    // Check for saved session
    const savedSession = localStorage.getItem('currentTimerSession');
    if (savedSession && sessions[savedSession]) {
        currentSession = savedSession;
        const selector = document.getElementById('sessionSelector');
        if (selector) {
            selector.value = currentSession;
        }
    }
    // Load inspection enabled setting
    const savedInspectionEnabled = localStorage.getItem('inspectionEnabled');
    if (savedInspectionEnabled !== null) {
        inspectionEnabled = savedInspectionEnabled === 'true';
        document.getElementById('enableInspection').checked = inspectionEnabled;
    }

    // Load saved decimal places setting
    const savedDecimalPlaces = localStorage.getItem('decimalPlaces');
    if (savedDecimalPlaces !== null) {
        decimalPlaces = parseInt(savedDecimalPlaces);
        document.getElementById('decimalPlaces').value = decimalPlaces;
    }
});
function createNewSession() {
    const sessionInput = document.getElementById("newSessionName");
    const newSessionName = sessionInput.value.trim().toLowerCase();

    if (!newSessionName || sessions[newSessionName]) {
        if (sessions[newSessionName]) {
            alert('A session with this name already exists. Please choose a different name.');
        }
        return;
    }

    // Detect puzzle type from session name
    let puzzleType = "3x3";
    const puzzleKeywords = {
        '2x2': '2x2',
        '3x3': '3x3',
        '4x4': '4x4',
        '5x5': '5x5',
        '6x6': '6x6',
        '7x7': '7x7',
        'pyraminx': 'Pyraminx',
        'pyra': 'Pyraminx',
        'skewb': 'skewb',
        'mega': 'megaminx',
        'megaminx': 'megaminx',
        'square1': 'square1',
        'square-1': 'square1',
        'sq1': 'square1',
        'clock': 'clock',
        'Clock': 'clock'
    };

    // Check session name against keywords first
    for (const [keyword, type] of Object.entries(puzzleKeywords)) {
        if (newSessionName.includes(keyword)) {
            puzzleType = type;
            break;
        }
    }

    // Create new session with all required properties
    sessions[newSessionName] = {
        times: [],
        scrambles: [],
        scrambleType: puzzleType,
        penalties: [],
        inspectionTimes: [],
        originalTimes: {},
        phaseTimes: []
    };

    // Switch to new session first
    currentSession = newSessionName;

    // Reset all stats displays immediately
    resetStatsDisplays();

    // Update session selector
    const sessionSelector = document.getElementById("sessionSelector");
    const option = document.createElement("option");
    option.value = newSessionName;
    option.textContent = newSessionName;
    sessionSelector.appendChild(option);
    sessionSelector.value = newSessionName;

    // Update twisty player with correct puzzle type
    const twistyPlayer = document.getElementById('scramble-display-player');
    if (twistyPlayer) {
        const twistyPuzzleType = getTwistyPuzzleType(puzzleType);
        twistyPlayer.puzzle = twistyPuzzleType;
        twistyPlayer.setAttribute('visualization', '2D');
    }

    // Generate new scramble before updating UI
    generateScramble();

    // Update UI elements in correct order
    updateHistory();
    updateHistorySummary();
    
    // Clear input
    sessionInput.value = "";
    sessionInput.blur();

    // Save to localStorage
    saveSessionsToLocalStorage();
    localStorage.setItem('currentTimerSession', currentSession);

    // Show notification
    showNotification(`Session "${newSessionName}" created`);

    // Update dropdown trigger
    window.updateSessionTrigger(newSessionName);
}

document.getElementById("newSessionName").addEventListener('focus', function(e) {
    this.addEventListener('keydown', stopPropagation);
});

document.getElementById("newSessionName").addEventListener('blur', function(e) {
    this.removeEventListener('keydown', stopPropagation);
});
window.addEventListener('beforeunload', saveAllSessionData);

function stopPropagation(e) {
    e.stopPropagation();
}

function saveSessionsToLocalStorage() {
    localStorage.setItem('cubeSessions_v2', JSON.stringify(sessions));
    
}

function redirectToCalc() {
    window.location.href = 'calc';
}

function loadSessionsFromLocalStorage() {
    const savedSessions = localStorage.getItem('cubeSessions_v2');
    const savedCurrentSession = localStorage.getItem('currentTimerSession');
    
    if (savedSessions) {
        try {
            sessions = JSON.parse(savedSessions);
            
            // Ensure 3x3 session always exists
            if (!sessions["3x3"]) {
                sessions["3x3"] = {
                    times: [],
                    scrambles: [],
                    scrambleType: "3x3",
                    penalties: [],
                    inspectionTimes: [],
                    originalTimes: {},
                    phaseTimes: []
                };
            }

            // Set current session - prefer saved session if it exists, fallback to 3x3
            currentSession = savedCurrentSession && sessions[savedCurrentSession] ? 
                           savedCurrentSession : "3x3";

            // Update session selector
            const sessionSelector = document.getElementById('sessionSelector');
            sessionSelector.innerHTML = '';
            
            // Always add 3x3 first
            const defaultOption = document.createElement('option');
            defaultOption.value = "3x3";
            defaultOption.textContent = "3x3";
            sessionSelector.appendChild(defaultOption);
            
            // Add other sessions
            Object.keys(sessions).forEach(sessionName => {
                if (sessionName !== "3x3") {
                    const option = document.createElement('option');
                    option.value = sessionName;
                    option.textContent = sessionName;
                    sessionSelector.appendChild(option);
                }
            });
            
            // Set the correct session
            sessionSelector.value = currentSession;
        } catch (error) {
            console.error('Error parsing saved sessions:', error);
            resetToDefaultSession();
        }
    } else {
        resetToDefaultSession();
    }

    updateHistory();
    updateHistorySummary();
    generateScramble();
}

function resetToDefaultSession() {
    sessions = {
        "3x3": {
            times: [],
            scrambles: [],
            scrambleType: "3x3",
            penalties: [],
            inspectionTimes: [],
            originalTimes: {},
            phaseTimes: []
        }
    };
    currentSession = "3x3";
    const sessionSelector = document.getElementById('sessionSelector');
    if (sessionSelector) {
        sessionSelector.innerHTML = '<option value="3x3">3x3</option>';
        sessionSelector.value = "3x3";
    }
}

function initializeSession() {
    loadSessionsFromLocalStorage();
    
    // Ensure the twisty player shows the correct puzzle type
    const twistyPlayer = document.getElementById('scramble-display-player');
    if (twistyPlayer && sessions[currentSession]) {
        const puzzleType = getTwistyPuzzleType(sessions[currentSession].scrambleType);
        twistyPlayer.puzzle = puzzleType;
    }
    
    generateScramble();
    updateHistory();
    updateHistorySummary();
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', initializeSession);

document.getElementById("newSessionName").addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission
        document.querySelector('button[onclick="createNewSession()"]').click();
    }
    e.stopPropagation();
});

// Add these session command suggestions
const sessionCommands = {
'2': '2x2',
'3': '3x3',
'4': '4x4',
'5': '5x5',
'6': '6x6',
'7': '7x7',
'8': '8x8',
'9': '9x9',
'10': '10x10',
"o": "One Handed",
'p': 'Pyraminx',
's': 'Skewb',
'm': 'Megaminx',
'b': 'blindfold',
};

function handleSessionInputAutocomplete(e) {
    const input = e.target;
    const inputValue = input.value.toLowerCase();

    // Remove any existing suggestion span
    const suggestions = document.querySelectorAll('.autocomplete-suggestion');
    suggestions.forEach(s => s.remove());

    // Only show suggestion if input has content and matches a command
    if (inputValue.length > 0 && sessionCommands[inputValue]) {
        const suggestion = document.createElement('span');
        suggestion.className = 'autocomplete-suggestion';
        suggestion.textContent = sessionCommands[inputValue].substring(inputValue.length);
        suggestion.style.position = 'absolute';
        suggestion.style.left = `${input.offsetLeft + measureText(inputValue, input)}px`;
        suggestion.style.top = `${input.offsetTop}px`;
        suggestion.style.pointerEvents = 'none';
        suggestion.style.color = '#999';
        suggestion.style.fontSize = window.getComputedStyle(input).fontSize;
        suggestion.style.fontFamily = window.getComputedStyle(input).fontFamily;
        suggestion.style.lineHeight = window.getComputedStyle(input).lineHeight;
        suggestion.style.padding = window.getComputedStyle(input).padding;
        input.parentElement.appendChild(suggestion);
    }
}

// Handle tab key for completion
function handleTabCompletion(e) {
    if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        const input = e.target;
        const inputValue = input.value.toLowerCase();
        
        if (inputValue.length === 1 && sessionCommands[inputValue]) {
            input.value = sessionCommands[inputValue];
            
            // Remove suggestion after completion
            const suggestion = input.nextElementSibling;
            if (suggestion && suggestion.classList.contains('autocomplete-suggestion')) {
                suggestion.remove();
            }

            // If it was Enter key, also trigger the createNewSession function
            if (e.key === 'Enter') {
                createNewSession();
            }
        } else if (e.key === 'Enter') {
            // If no autocomplete suggestion, just create new session
            createNewSession();
        }
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    const sessionInput = document.getElementById('newSessionName');
    if (sessionInput) {
        sessionInput.setAttribute('autocomplete', 'off');
        const container = document.createElement('div');
        container.className = 'session-input-container';
        sessionInput.parentElement.insertBefore(container, sessionInput);
        container.appendChild(sessionInput);

        // Add input event listener
        sessionInput.addEventListener('input', handleSessionInputAutocomplete);
        
        // Add keydown event listener for special keys
        sessionInput.addEventListener('keydown', (e) => {
            // Clear suggestion on backspace/delete
            if (e.key === 'Backspace' || e.key === 'Delete') {
                const suggestions = document.querySelectorAll('.autocomplete-suggestion');
                suggestions.forEach(s => s.remove());
            }
            handleTabCompletion(e);
        });

        // Clear suggestion when input loses focus
        sessionInput.addEventListener('blur', () => {
            const suggestions = document.querySelectorAll('.autocomplete-suggestion');
            suggestions.forEach(s => s.remove());
        });
    }
});

//History panel
function updateHistory() {
    if (!sessions[currentSession] || sessions[currentSession].times.length === 0) {
        historyList.innerHTML = `
    <div class="empty-state">
        <i class="cubing-icon event-333oh"></i>
        <h3>No solves yet</h3>
        <p>Start solving to see your times here.<br>Press spacebar to begin!</p>
    </div>`;
        return;
    }

    // Get the user's selected layout or default to cstimer
    const layout = settingsUI.historyLayout || 'cstimer';
    const layoutSelect = document.getElementById('historyLayout');
    if (layoutSelect && layoutSelect.value !== layout) {
        layoutSelect.value = layout;
    }
    
    const fragment = document.createDocumentFragment();
    const displayLimit = 200;
    const validTimes = sessions[currentSession].times.filter(time => 
        time !== DNF_VALUE && time !== "Infinity" && time !== Infinity
    );
    const bestTime = Math.min(...validTimes);

    // Remove all layout classes first
    historyList.classList.remove('default', 'compact-grid', 'cstimer-table');
    
    // Add the correct layout class
    if (layout === 'compact') {
        historyList.classList.add('compact-grid');
    } else if (layout === 'cstimer') {
        historyList.classList.add('cstimer-table');
    } else {
        historyList.classList.add('default');
    }

    if (layout === 'cstimer') {
        // Use same display limit as default layout
        const startIndex = Math.max(0, sessions[currentSession].times.length - displayLimit);
        const timesToDisplay = sessions[currentSession].times.slice(startIndex).reverse();
        
        historyList.innerHTML = `
            <div class="header-row">
                <div class="header-cell">#</div>
                <div class="header-cell">Time</div>
                <div class="header-cell">ao5</div>
                <div class="header-cell">ao12</div>
            </div>
            ${timesToDisplay.map((time, index) => {
                const absoluteIndex = sessions[currentSession].times.length - index;
                const ao5 = getAverageOf5(sessions[currentSession].times.slice(0, absoluteIndex));
                const ao12 = getAverageOf12(sessions[currentSession].times.slice(0, absoluteIndex));
                const penalty = sessions[currentSession].penalties?.[absoluteIndex - 1];
                
                let timeDisplay = formatTime(time * 1000);
                if (time === DNF_VALUE) timeDisplay = "DNF";
                if (penalty === '+2') timeDisplay += '+';
                
                const isBest = time === bestTime && time !== DNF_VALUE;
                
                return `
                    <div class="solve-row ${isBest ? 'best-time' : ''}">
                        <div class="solve-cell number">${absoluteIndex}</div>
                        <div class="solve-cell time" onclick="showDetails(${absoluteIndex - 1})">${timeDisplay}</div>
                        <div class="solve-cell average">${ao5 === "--" || ao5 === "DNF" ? ao5 : formatTime(ao5 * 1000)}</div>
                        <div class="solve-cell average">${ao12 === "--" || ao12 === "DNF" ? ao12 : formatTime(ao12 * 1000)}</div>
                    </div>
                `;
            }).join('')}
        `;
        return;
    }

    // Regular or compact layout
    const startIndex = Math.max(0, sessions[currentSession].times.length - displayLimit);
    const timesToDisplay = sessions[currentSession].times.slice(startIndex).reverse();
    
    timesToDisplay.forEach((time, index) => {
        const listItem = document.createElement('li');
        const absoluteIndex = sessions[currentSession].times.length - index;
        
        if (highlightBest && time === bestTime && time !== DNF_VALUE) {
            listItem.classList.add('best-time');
        }

        // For compact layout, add click handler to show details
        if (historyList.classList.contains('compact-grid')) {
            listItem.onclick = () => showDetails(absoluteIndex - 1);
        }
        
        // Format time display
        let timeDisplay;
        if (time === DNF_VALUE) {
            timeDisplay = 'DNF';
        } else {
            if (time >= 60) {
                const minutes = Math.floor(time / 60);
                const seconds = (time % 60).toFixed(2).padStart(5, '0');
                timeDisplay = `${minutes}:${seconds}`;
            } else {
                timeDisplay = time.toFixed(2);
            }
        }

        if (time !== DNF_VALUE && sessions[currentSession].penalties && 
            sessions[currentSession].penalties[sessions[currentSession].times.length - index - 1] === '+2') {
            timeDisplay += '+';
        }

        // Different HTML structure based on layout
        if (historyList.classList.contains('compact-grid')) {
            listItem.innerHTML = `
                <div class="time-info">
                    <span class="solve-number">#${absoluteIndex}</span>
                    <span class="solve-time">${timeDisplay}</span>
                </div>
            `;
        } else {
            listItem.innerHTML = `
                <div class="time-info">
                    <span class="solve-number">#${absoluteIndex}</span>
                    <span class="solve-time">${timeDisplay}</span>
                </div>
                <div class="solve-actions">
                    <button class="penalty" onclick="addPenalty(${absoluteIndex - 1})" title="+2">+2</button>
                    <button class="dnf" onclick="markDNF(${absoluteIndex - 1})" title="DNF"><i class="fas fa-ban"></i></button>
                    <button class="info" onclick="showDetails(${absoluteIndex - 1})" title="Info"><i class="fas fa-info"></i></button>
                    <button class="delete" onclick="removeSolve(${absoluteIndex - 1})" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }

        fragment.appendChild(listItem);
    });

    historyList.innerHTML = '';
    historyList.appendChild(fragment);
}

function resetHistory() {
    if (confirm('Are you sure you want to reset all solves? This cannot be undone.')) {
        // Store current session state for undo
        const oldSessionData = {
            times: [...sessions[currentSession].times],
            scrambles: [...sessions[currentSession].scrambles],
            penalties: sessions[currentSession].penalties ? [...sessions[currentSession].penalties] : []
        };

        // Clear all session data
        sessions[currentSession].times = [];
        sessions[currentSession].scrambles = [];
        sessions[currentSession].penalties = [];
        
        // Clear penalties from localStorage
        localStorage.removeItem(`penalties_${currentSession}`);
        
        // Reset all statistics displays
        resetStatsDisplays();
        
        // Update display and generate new scramble
        updateHistory(); // Changed from historyList.innerHTML = "" to properly show empty state
        updateHistorySummary();
        generateScramble();
        
        if (autoSave) saveSessionsToLocalStorage();

        // Show notification with undo option
        showNotification(`Session "${currentSession}" reset`, {
            undoCallback: () => {
                sessions[currentSession].times = oldSessionData.times;
                sessions[currentSession].scrambles = oldSessionData.scrambles;
                sessions[currentSession].penalties = oldSessionData.penalties;
                updateHistory();
                updateHistorySummary();
                if (autoSave) saveSessionsToLocalStorage();
            }
        });
    }
}

function removeLastTime() {
    if (sessions[currentSession].times.length > 0) {
        // Store the removed solve
        removedSolves.push({
            time: sessions[currentSession].times[sessions[currentSession].times.length - 1],
            scramble: sessions[currentSession].scrambles[sessions[currentSession].scrambles.length - 1]
        });
        
        sessions[currentSession].times.pop();
        sessions[currentSession].scrambles.pop();
        updateHistory();
        updateHistorySummary();
        timerDisplay.textContent = "0.00";
        setTimeout(() => {
            timerDisplay.textContent = "0.00";
        }, 1000);
        if (autoSave) saveSessionsToLocalStorage();
    }
}

function removeSolve(index) {
    const removedTime = sessions[currentSession].times[index];
    const formattedTime = removedTime === DNF_VALUE ? 'DNF' : removedTime.toFixed(2);
    
    // Store removed data for undo
    const removedData = {
        time: sessions[currentSession].times[index],
        scramble: sessions[currentSession].scrambles[index],
        penalty: sessions[currentSession].penalties?.[index],
        comment: sessions[currentSession].comments?.[index],
        date: sessions[currentSession].dates?.[index]
    };

    // Remove the solve and associated data
    sessions[currentSession].times.splice(index, 1);
    sessions[currentSession].scrambles.splice(index, 1);
    if (sessions[currentSession].penalties) {
        sessions[currentSession].penalties.splice(index, 1);
    }
    if (sessions[currentSession].comments) {
        sessions[currentSession].comments.splice(index, 1);
    }
    if (sessions[currentSession].dates) {
        sessions[currentSession].dates.splice(index, 1);
    }

    // Show notification with undo option
    showNotification(`Solve ${formattedTime} removed`, {
        undoCallback: () => {
            // Restore the solve and associated data
            sessions[currentSession].times.splice(index, 0, removedData.time);
            sessions[currentSession].scrambles.splice(index, 0, removedData.scramble);
            if (removedData.penalty) {
                if (!sessions[currentSession].penalties) {
                    sessions[currentSession].penalties = [];
                }
                sessions[currentSession].penalties[index] = removedData.penalty;
            }
            if (removedData.comment) {
                if (!sessions[currentSession].comments) {
                    sessions[currentSession].comments = [];
                }
                sessions[currentSession].comments[index] = removedData.comment;
            }
            if (removedData.date) {
                if (!sessions[currentSession].dates) {
                    sessions[currentSession].dates = [];
                }
                sessions[currentSession].dates.splice(index, 0, removedData.date);
            }
            updateHistory();
            updateHistorySummary();
            if (autoSave) saveSessionsToLocalStorage();
        }
    });

    updateHistory();
    updateHistorySummary();
    if (autoSave) saveSessionsToLocalStorage();
}



loadSessionsFromLocalStorage();
generateScramble();



function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}

// Add updateTimerDisplay function if missing
function updateTimerDisplay() {
    if (sessions[currentSession].times.length === 0) {
        timerDisplay.textContent = "0.00";
        return;
    }

    const lastIndex = sessions[currentSession].times.length - 1;
    const lastTime = sessions[currentSession].times[lastIndex];
    const penalty = sessions[currentSession].penalties?.[lastIndex];

    if (lastTime === DNF_VALUE) {
        timerDisplay.textContent = "DNF";
    } else {
        let displayTime = formatTime(lastTime * 1000);
        if (penalty === '+2') {
            displayTime += '+';
        }
        timerDisplay.textContent = displayTime;
    }
}

function renameSession(sessionName) {
    if (sessionName === "3x3") {
        alert("The default '3x3' session cannot be renamed.");
        return;
    }

    const newName = prompt(`Rename session "${sessionName}" to:`);
    
    if (newName && newName.trim()) {
        const trimmedName = newName.trim().toLowerCase();
        
        if (sessions[trimmedName]) {
            alert('A session with this name already exists. Please choose a different name.');
            return;
        }
        
        // Store the session data temporarily
        const sessionData = sessions[sessionName];
        
        // Delete the old session
        delete sessions[sessionName];
        
        // Create the new session with the same data
        sessions[trimmedName] = sessionData;
        
        // Update the session selector
        const sessionSelector = document.getElementById("sessionSelector");
        const options = sessionSelector.options;
        
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === sessionName) {
                options[i].value = trimmedName;
                options[i].textContent = trimmedName;
                break;
            }
        }
        
        // Only update current session if it's the one being renamed
        if (currentSession === sessionName) {
            currentSession = trimmedName;
            sessionSelector.value = trimmedName;
        }
        
        // Update dropdown trigger
        window.updateSessionTrigger(currentSession);
        
        // Force update custom dropdown menu
        document.querySelector('.session-dropdown-trigger').click();
        document.querySelector('.session-dropdown-trigger').click();
        
        saveAllSessionData();
        
        // Show notification
        showNotification(`Session renamed to "${trimmedName}"`);
    }
}

function deleteSession(sessionName) {
    if (sessionName === "3x3") {
        alert("The default '3x3' session cannot be deleted.");
        return;
    }

    if (confirm(`Are you sure you want to delete the session "${sessionName}"? This cannot be undone.`)) {
        // Store session data for potential undo
        const deletedSession = {
            name: sessionName,
            data: { ...sessions[sessionName] }
        };

        delete sessions[sessionName];

        const sessionSelector = document.getElementById("sessionSelector");
        const optionToRemove = sessionSelector.querySelector(`option[value="${sessionName}"]`);
        if (optionToRemove) optionToRemove.remove();

        // Only switch to 3x3 if we're deleting the current session
        if (currentSession === sessionName) {
            currentSession = "3x3";
            sessionSelector.value = currentSession;
            changeSession();
            // Update the dropdown trigger to show 3x3
            window.updateSessionTrigger("3x3");
        }
        
        saveSessionsToLocalStorage();

        // Show notification with undo option
        showNotification(`Session "${deletedSession.name}" deleted`, {
            undoCallback: () => {
                // Restore the session
                sessions[deletedSession.name] = deletedSession.data;
                
                // Restore the session option in selector
                const option = document.createElement("option");
                option.value = deletedSession.name;
                option.textContent = deletedSession.name;
                sessionSelector.appendChild(option);
                
                // Switch back to the restored session
                if (currentSession === "3x3") {
                    currentSession = deletedSession.name;
                    sessionSelector.value = currentSession;
                    changeSession();
                    // Update the dropdown trigger when restoring the session
                    window.updateSessionTrigger(deletedSession.name);
                }
                saveSessionsToLocalStorage();
            }
        });
    }
}

function addCustomScramble() {
    const customScramble = prompt('Enter your custom scramble:');
    if (customScramble) {
        currentScramble = customScramble;
        scrambleDisplay.textContent = customScramble;
        updateTwistyPlayer(customScramble);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for scramble type items
    document.querySelectorAll('.scramble-type-item').forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.scramble-type-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Update scramble type and generate new scramble
            const scrambleType = item.dataset.type;
            sessions[currentSession].scrambleType = scrambleType;
            
            // Update twisty player puzzle type
            const twistyPlayer = document.getElementById('scramble-display-player');
            const puzzleType = getTwistyPuzzleType(scrambleType);
            twistyPlayer.setAttribute('puzzle', puzzleType);
            
            // Generate new scramble using scramble.js
            generateScramble();
        });
    });
    
    // Set initial active state
    const currentType = sessions[currentSession].scrambleType;
    const activeItem = document.querySelector(`.scramble-type-item[data-type="${currentType}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
});

function copyScramble() {
    if (!currentScramble) return;
    
    const textArea = document.createElement('textarea');
    textArea.value = currentScramble;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Visual feedback
    const icon = document.querySelector('.timer-action[title="Copy scramble"] i');
    if (icon) {
        icon.className = 'fas fa-check';
        setTimeout(() => icon.className = 'fas fa-copy', 2000);
    }

    // Show notification
    showNotification('Scramble copied to clipboard');
}

// Add mobile full screen touch handler
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 1024) {
        // Create invisible overlay for touch events
        const touchOverlay = document.createElement('div');
        touchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: transparent;
            -webkit-tap-highlight-color: transparent;
            pointer-events: none; // Allow clicks to pass through
        `;
        document.body.appendChild(touchOverlay);

        // Handle touch events on the document instead of overlay
        document.addEventListener('touchstart', handleBackgroundTouch);
        document.addEventListener('touchend', handleBackgroundTouch);
    }
});

function handleBackgroundTouch(event) {
    // First check if we're in the timer tab
    const timerTab = document.querySelector('.mobile-tab[data-tab="timer"]');
    if (!timerTab?.classList.contains('active')) {
        return;
    }

    // Ignore touches if they're on UI elements
    const ignoreElements = [
        '.settings-container',
        '.scramble-header',
        '.session-menu',
        '.session-selector-container',
        '.scramble-icons',
        '.mobile-tabs',
        'button',
        'input',
        'select',
        'a',
        '.settings-overlay',
        '#settingsMenu',
        '.new-session-popup',
        '.new-session-backdrop',
    ];

    // Check if touch is on any ignored element or their children
    const touchedElement = event.target;
    const shouldIgnore = ignoreElements.some(selector => 
        touchedElement.matches(selector) || touchedElement.closest(selector)
    );

    if (shouldIgnore || event.target === timerDisplay) {
        return;
    }
    
    event.preventDefault();
    if (event.type === 'touchstart') {
        isSpacePressed = true;
    } else if (event.type === 'touchend' && isSpacePressed) {
        isSpacePressed = false;
        handleSpaceKeyPress();
    }
}

// Keep original timer touch handlers
timerDisplay.addEventListener('touchstart', handleTouchStart);
timerDisplay.addEventListener('touchend', handleTouchEnd);

function toggleFullscreen() {
    const checkbox = document.getElementById('fullscreenMode');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            checkbox.checked = true;
        }).catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
            checkbox.checked = false;
        });
    } else {
        document.exitFullscreen().then(() => {
            checkbox.checked = false;
        });
    }
}

// Handle fullscreen change events
document.addEventListener('fullscreenchange', () => {
    const checkbox = document.getElementById('fullscreenMode');
    checkbox.checked = !!document.fullscreenElement;
});

function toggleHideTimer() {
    hideTimer = document.getElementById('hideTimer').checked;
    saveSetting('hideTimer', hideTimer);
    
    // Update timer display immediately
    if (isRunning) {
        timerDisplay.textContent = hideTimer ? 'SOLVING' : formatTime(elapsedTime);
    }
}

// Ensure the timer display always uses the DP size styling, both when running and when stopped
function updateTimerDisplayDPSize(timeStr) {
    // Only update if timerDisplay exists
    if (!window.timerDisplay) return;
    // Use provided string or current display
    let text = typeof timeStr === 'string' ? timeStr : timerDisplay.textContent;
    if (text === 'DNF' || text === 'SOLVING' || text === '+2') {
        timerDisplay.innerHTML = text;
        return;
    }
    // Find decimal point
    const dp = text.indexOf('.');
    if (dp === -1) {
        timerDisplay.innerHTML = text;
        return;
    }
    const intPart = text.slice(0, dp);
    let decPart = text.slice(dp + 1);
    // Remove any trailing + or penalty
    let penalty = '';
    if (decPart.endsWith('+')) {
        penalty = '+';
        decPart = decPart.slice(0, -1);
    }
    const size = (window.settingsUI && window.settingsUI.timerDpSize !== undefined) ? window.settingsUI.timerDpSize : 0;
    timerDisplay.innerHTML = `${intPart}.<span style=\"font-size:${size}%;vertical-align:baseline;\">${decPart}</span>${penalty}`;
}

