let scrambleHistories = {};
let currentScrambleIndices = {};

function generateScramble() {
    const currentScrambleType = sessions[currentSession].scrambleType;
    const scrambleDisplay = document.getElementById('scrambleDisplay');
    
    // Initialize history for this puzzle type if it doesn't exist
    if (!scrambleHistories[currentScrambleType]) {
        scrambleHistories[currentScrambleType] = [];
        currentScrambleIndices[currentScrambleType] = -1;
    }

    // Map puzzle types to Scrambow types
    const scrambleTypeMap = {
        // Main puzzles
        '2x2': '222',
        '3x3': '333',
        '4x4': '444',
        '5x5': '555',
        '6x6': '666',
        '7x7': '777',
        'Pyraminx': 'pyraminx',
        'skewb': 'skewb',
        'square1': 'square1',
        'clock': 'clock',
        'megaminx': 'megaminx',

        // CFOP Subsets
        'F2L': 'f2l',
        'OLL': 'll',
        'PLL': 'pll',
        'LL': 'll',
        'LSLL': 'lsll',

        // Roux Subsets
        'CMLL': 'cmll',
        'LSE': 'lse',
        'L10P': 'l10p',

        // ZZ Subsets
        'ZZ': 'zz',
        'ZZLL': 'zzll',
        'ZZLSLL': 'zzlsll',

        // Advanced Sets
        'ZBLL': 'zbll',
        'COLL': 'coll',
        '2GLL': '2gll',
        'EPLL': 'epll',
        'CLS': 'cls',
        'WV': 'wv',
        'EDGES': 'edges',
        'BLE': 'ble',
        'TRIZBLL': 'trizbll',
        'TSLE': 'tsle',
        'NLS': 'nls',
        'LCCP': 'lccp',

        // Move Subsets
        'RU': 'ru',
        'RUD': 'rud',
        'RUL': 'rul',
        'LU': 'lu',
        'FMC': 'fmc'
    };

    try {
        // Initialize scrambler if needed
        if (typeof scramblers !== 'undefined' && scramblers[333]) {
            scramblers[333].initialize(null, Math);
        }

        // Special subset cases using scrambler.js
        switch(currentScrambleType) {
            case "belt":
                currentScramble = scramblers[333].customScramble(
                    [0,1,2,3,4,5,6,7], 
                    [4,5,6,7,8,9,10,11], 
                    [0,1,2,3,4,5,6,7], 
                    [0,1,2,3,4,5,6,7]
                );
                break;
            case "c":
                currentScramble = scramblers[333].getCornerScramble();
                break;
            case "cross":
                currentScramble = scramblers[333].customScramble(
                    [0,1,2,3,4,5,6,7], 
                    [0,1,2,3,8,9,10,11], 
                    [0,1,2,3,4,5,6,7], 
                    [0,1,2,3,8,9,10,11]
                );
                break;
            case "mu":
                currentScramble = megascramble([["U"], ["M"]], ["", "2", "'"]);
                break;
            case "fru":
                currentScramble = megascramble([["U"], ["R"], ["F"]], ["", "2", "'"]);
                break;
            case "o":
                currentScramble = scramblers[333].getOScramble();
                break;
            default:
                // Use original Scrambow for other types
                const scrambleType = scrambleTypeMap[currentScrambleType] || '333';
                const scrambler = new window.Scrambow();
                scrambler.setType(scrambleType);
                const result = scrambler.get(1);
                currentScramble = result[0].scramble_string;
        }

        // After generating the scramble, add it to puzzle-specific history
        if (currentScrambleIndices[currentScrambleType] === scrambleHistories[currentScrambleType].length - 1) {
            // We're at the latest scramble, add new one to history
            scrambleHistories[currentScrambleType].push(currentScramble);
            currentScrambleIndices[currentScrambleType]++;
        } else {
            // We're somewhere in history, truncate forward history and add new scramble
            scrambleHistories[currentScrambleType] = scrambleHistories[currentScrambleType]
                .slice(0, currentScrambleIndices[currentScrambleType] + 1);
            scrambleHistories[currentScrambleType].push(currentScramble);
            currentScrambleIndices[currentScrambleType]++;
        }

        // Update navigation buttons
        updateScrambleNavigation();
        
        scrambleDisplay.textContent = currentScramble;
        
        // Scale down font size differently based on puzzle type
        if (['4x4', '5x5'].includes(currentScrambleType)) {
            scrambleDisplay.style.fontSize = '2vh';
        } else if (['6x6', '7x7', 'megaminx'].includes(currentScrambleType)) {
            scrambleDisplay.style.fontSize = '1.5vh';
        } else {
            // Reset to default size if needed
            scrambleDisplay.style.fontSize = '';
        }
        
        // Handle visualization
        const twistyPuzzle = getTwistyPuzzleType(currentScrambleType);
        const twistyPlayer = document.getElementById("scramble-display-player");
        twistyPlayer.setAttribute("puzzle", twistyPuzzle);
        twistyPlayer.setAttribute("alg", currentScramble);

        return currentScramble;
    } catch (error) {
        console.error('Scramble generation error:', error);
        return "R U R' U'";
    }
}

function getPreviousScramble() {
    const currentScrambleType = sessions[currentSession].scrambleType;
    
    if (!scrambleHistories[currentScrambleType]) return;
    
    if (currentScrambleIndices[currentScrambleType] > 0) {
        currentScrambleIndices[currentScrambleType]--;
        currentScramble = scrambleHistories[currentScrambleType][currentScrambleIndices[currentScrambleType]];
        const scrambleDisplay = document.getElementById('scrambleDisplay');
        scrambleDisplay.textContent = currentScramble;
        
        // Update visualization
        const twistyPuzzle = getTwistyPuzzleType(currentScrambleType);
        const twistyPlayer = document.getElementById("scramble-display-player");
        twistyPlayer.setAttribute("puzzle", twistyPuzzle);
        twistyPlayer.setAttribute("alg", currentScramble);
        
        updateScrambleNavigation();
    }
}

function getNextScramble() {
    const currentScrambleType = sessions[currentSession].scrambleType;
    
    if (!scrambleHistories[currentScrambleType]) {
        generateScramble();
        return;
    }

    if (currentScrambleIndices[currentScrambleType] < scrambleHistories[currentScrambleType].length - 1) {
        // Navigate existing history
        currentScrambleIndices[currentScrambleType]++;
        currentScramble = scrambleHistories[currentScrambleType][currentScrambleIndices[currentScrambleType]];
        const scrambleDisplay = document.getElementById('scrambleDisplay');
        scrambleDisplay.textContent = currentScramble;
        
        // Update visualization
        const twistyPuzzle = getTwistyPuzzleType(currentScrambleType);
        const twistyPlayer = document.getElementById("scramble-display-player");
        twistyPlayer.setAttribute("puzzle", twistyPuzzle);
        twistyPlayer.setAttribute("alg", currentScramble);
    } else {
        // Generate new scramble if at end of history
        generateScramble();
    }
    updateScrambleNavigation();
}

function updateScrambleNavigation() {
    const currentScrambleType = sessions[currentSession].scrambleType;
    const currentIndex = currentScrambleIndices[currentScrambleType] || 0;
    
    const prevButton = document.querySelector('.timer-action[title="Previous scramble"]');
    const nextButton = document.querySelector('.timer-action[title="Next scramble"]');
    
    if (prevButton) {
        prevButton.disabled = currentIndex <= 0;
        prevButton.style.opacity = currentIndex <= 0 ? '0.5' : '1';
    }
    
    if (nextButton) {
        nextButton.style.opacity = '1'; // Next is always available
    }
}

// Reset scramble histories when changing puzzle type
function resetScrambleHistory() {
    const currentScrambleType = sessions[currentSession].scrambleType;
    scrambleHistories[currentScrambleType] = [];
    currentScrambleIndices[currentScrambleType] = -1;
    generateScramble();
}


// Initialize first scramble when page loads
document.addEventListener('DOMContentLoaded', () => {
    resetScrambleHistory();
});

// Make functions available globally
window.generateScramble = generateScramble;
window.getPreviousScramble = getPreviousScramble;
window.getNextScramble = getNextScramble;
window.resetScrambleHistory = resetScrambleHistory;
