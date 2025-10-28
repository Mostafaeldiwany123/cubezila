// Add this function after the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {

    // Initialize tools selector handler
    const toolsSelect = document.querySelector('.tools-select');
    const scrambleBox = document.getElementById('scrambleVisBox');
    const twistyPlayer = document.getElementById('scramble-display-player');
    
    if (toolsSelect && scrambleBox && twistyPlayer) {
        // Adjust the vertical position of the twisty player
        twistyPlayer.style.marginTop = '-43px';
        
        toolsSelect.addEventListener('change', function() {
            handleToolSelect(this.value);
        });
        
        // Set initial state to scramble display
        toolsSelect.value = 'scramble';
        toolsSelect.dispatchEvent(new Event('change'));
    }
});

function handleToolSelect(value) {
    const scrambleBox = document.getElementById('scrambleVisBox');
    const twistyPlayer = document.getElementById('scramble-display-player');
    
    // Stop metronome if it's playing when switching tools
    if (isMetronomePlaying) {
        stopMetronome();
        isMetronomePlaying = false;
    }
    
    // Reset all tools first
    if (twistyPlayer) twistyPlayer.style.display = 'none';
    scrambleBox.style.display = 'none';
    
    // Handle tool selection
    switch(value) {
        case 'scramble':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Scramble Display</h3>
                </div>
                <div id="puzzle-net-display" class="display-wrapper">
                    <twisty-player
                        id="scramble-display-player"
                        experimental-setup-anchor="start"
                        background="none"
                        hint-facelets="none"
                        visualization="2D"
                        control-panel="none"
                        style="width: 100%; height: 100%; margin-top: -43px;"
                    ></twisty-player>
                </div>
            `;
            // Re-initialize twisty player
            const newTwistyPlayer = document.getElementById('scramble-display-player');
            if (newTwistyPlayer) {
                newTwistyPlayer.puzzle = getTwistyPuzzleType(sessions[currentSession].scrambleType);
                newTwistyPlayer.alg = currentScramble;
            }
            break;
            
        case 'metronome':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Metronome</h3>
                </div>
                <div class="metronome-container">
                    <div class="metronome-circle">
                        <div class="bpm-display" id="bpmValue">120</div>
                    </div>
                    <input type="range" class="bpm-slider" id="bpm" 
                        min="30" max="240" value="120" oninput="updateBPM()">
                    <div class="controls">
                        <button class="control-button" id="metronomeStart" onclick="toggleMetronomePlay()">
                            <i class="fas fa-play"></i>
                        </button>
                        <div class="volume-control">
                            <button class="control-button" onclick="toggleVolumeControl(this)">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <input type="range" class="volume-slider" id="volume" 
                                min="0" max="100" value="50" oninput="updateVolume()">
                        </div>
                        <div class="instrument-control">
                            <button class="control-button" onclick="toggleInstrumentControl(this)">
                                <i class="fas fa-music"></i>
                            </button>
                            <div class="instrument-dropdown">
                                <div class="instrument-option" onclick="changeInstrument('single')">
                                    <i class="fas fa-music"></i>Single Note
                                </div>
                                <div class="instrument-option" onclick="changeInstrument('scale')">
                                    <i class="fas fa-stream"></i>Scale Pattern
                                </div>
                                <div class="instrument-option" onclick="changeInstrument('happyBirthday')">
                                    <i class="fas fa-birthday-cake"></i>Happy Birthday
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'cross':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Cross Solver</h3>
                </div>
                <div class="cross-solver-container">
                    <div class="control-panel">
                        <div class="custom-dropdown" id="crossSolveTypeDropdown">
                            <div class="dropdown-selected">Cross</div>
                            <div class="dropdown-options">
                                <div class="dropdown-option" data-value="0">Cross</div>
                                <div class="dropdown-option" data-value="1">XCross (EC1)</div>
                                <div class="dropdown-option" data-value="2">XXCross (EC2)</div>
                            </div>
                        </div>
                        <div class="custom-dropdown" id="crossFaceDropdown">
                            <div class="dropdown-selected">
                                <span class="color-dot" style="background:#FFFFFF"></span>
                                White Face
                            </div>
                            <div class="dropdown-options">
                                <div class="dropdown-option" data-value="1" data-color="#FFFFFF">
                                    <span class="color-dot" style="background:#FFFFFF"></span>
                                    White Face
                                </div>
                                <div class="dropdown-option" data-value="0" data-color="#FFFF00">
                                    <span class="color-dot" style="background:#FFFF00"></span>
                                    Yellow Face
                                </div>
                                <div class="dropdown-option" data-value="2" data-color="#FFA500">
                                    <span class="color-dot" style="background:#FFA500"></span>
                                    Orange Face
                                </div>
                                <div class="dropdown-option" data-value="3" data-color="#FF0000">
                                    <span class="color-dot" style="background:#FF0000"></span>
                                    Red Face
                                </div>
                                <div class="dropdown-option" data-value="4" data-color="#00FF00">
                                    <span class="color-dot" style="background:#00FF00"></span>
                                    Green Face
                                </div>
                                <div class="dropdown-option" data-value="5" data-color="#0000FF">
                                    <span class="color-dot" style="background:#0000FF"></span>
                                    Blue Face
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="solutions-list"></div>
                </div>`;

            // Initialize dropdowns after adding to DOM
            initializeCustomDropdowns(scrambleBox);
            updateCrossSolution();
            break;

        case 'bld':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>BLD Helper</h3>
                </div>
                <div id="bld-helper-content">
                    <div id="buffer-selection">
                        <div class="buffer-selectors">
                            <div class="buffer-input-group">
                                <label>Edge</label>
                                <select id="edge-buffer" class="buffer-select">
                                    ${Array.from({length: 24}, (_, i) => String.fromCharCode(65 + i)).map(letter => 
                                        `<option value="${letter}"${letter === 'U' ? ' selected' : ''}>${letter}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="buffer-input-group">
                                <label>Corner</label>
                                <select id="corner-buffer" class="buffer-select">
                                    ${Array.from({length: 24}, (_, i) => String.fromCharCode(65 + i)).map(letter => 
                                        `<option value="${letter}"${letter === 'A' ? ' selected' : ''}>${letter}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="solutions-container">
                        <div class="solution-box">
                            <div id="solutionEdges"></div>
                        </div>
                        <div class="solution-box">
                            <div id="solutionCorners"></div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize BLD helper
            const puzzle = new cube3x3bld();
            
            // Set up buffer change handlers
            document.getElementById('edge-buffer').addEventListener('change', function() {
                try {
                    puzzle.setBuffers(this.value, document.getElementById('corner-buffer').value);
                    updateBLDSolution();
                } catch (error) {
                    alert("Invalid buffer selection");
                }
            });

            document.getElementById('corner-buffer').addEventListener('change', function() {
                try {
                    puzzle.setBuffers(document.getElementById('edge-buffer').value, this.value);
                    updateBLDSolution();
                } catch (error) {
                    alert("Invalid buffer selection");
                }
            });

            // Update solution when scramble changes
            function updateBLDSolution() {
                if (currentScramble && currentScramble.trim() !== "") {
                    const scrambleArray = currentScramble.split(" ");
                    puzzle.scrambles = [scrambleArray];
                    puzzle.scrambleIndex = 0;
                    puzzle.doScramble();
                    
                    document.getElementById('solutionEdges').innerHTML = `
                        <div class="solution-header">Solution for edges:</div>
                        <div class="letter-sequence">${puzzle.strigifySolutionEdges(puzzle.getBldSolutionEdges())}</div>
                    `;
                    
                    document.getElementById('solutionCorners').innerHTML = `
                        <div class="solution-header">Solution for corners:</div>
                        <div class="letter-sequence">${puzzle.strigifySolutionCorners(puzzle.getBldSolutionCorners())}</div>
                    `;
                }
            }

            // Initial solution update
            updateBLDSolution();
            break;

        case 'lastsolve':
            scrambleBox.style.display = 'block';
            const timesArr = sessions[currentSession]?.times || [];
            const scramblesArr = sessions[currentSession]?.scrambles || [];
            const penaltiesArr = sessions[currentSession]?.penalties || [];
            const lastIndex = timesArr.length - 1;

            if (lastIndex < 0) {
                scrambleBox.innerHTML = `
                    <div class="visualization-header">
                        <h3>Last Solve</h3>
                    </div>
                    <div class="display-wrapper">
                        <div class="empty-state" style="position:relative; transform:none; top:0; left:0;">
                            <i class="cubing-icon event-333oh"></i>
                            <h3>No solves yet</h3>
                            <p>Start solving to see your last solve here.</p>
                        </div>
                    </div>
                `;
                break;
            }

            const lastTime = timesArr[lastIndex];
            const lastScramble = scramblesArr[lastIndex];
            const lastPenalty = penaltiesArr?.[lastIndex];
            const isDNF = lastTime === DNF_VALUE || lastTime === Infinity || lastTime === "Infinity";
            let timeDisplay = isDNF ? "DNF" : formatTime(lastTime * 1000);
            if (lastPenalty === '+2' && !isDNF) timeDisplay += '+';

            // Render from bottom to top: twisty-player, actions, scramble, timer, solve number (bottom)
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Last Solve</h3>
                </div>
                <div id="lastsolve-wrapper" class="display-wrapper" style="flex-direction:column;align-items:center;justify-content:center;height:calc(100% - 40px);padding:5px;gap:8px;">
                     <div style="width: 100%; height: 90px; display: flex; align-items: center; justify-content: center;">
                        <twisty-player
                            id="scramble-display-player"
                            experimental-setup-anchor="start"
                            background="none"
                            hint-facelets="none"
                            visualization="experimental-2D-LL"
                            control-panel="none"
                            style="width: 80%; height: 100%;"
                            experimental-twizzle-controls
                        ></twisty-player>
                    </div>
                    <div id="lastsolve-actions" style="display: flex; gap: 5px; justify-content: center;">
                           <button class="penalty" title="+2" onclick="addPenalty(${lastIndex})" style="background:var(--highlight-bg);border:none;padding:3px 8px;border-radius:4px;color:var(--text-color);font-weight:bold;cursor:pointer;">+2</button>
                        <button class="dnf" title="DNF" onclick="markDNF(${lastIndex})" style="background:var(--highlight-bg);border:none;padding:3px 8px;border-radius:4px;color:var(--text-color);font-weight:bold;cursor:pointer;"><i class="fas fa-ban"></i></button>
                        <button class="delete" title="Remove" onclick="removeSolve(${lastIndex})" style="background:var(--highlight-bg);border:none;padding:3px 8px;border-radius:4px;color:var(--text-color);font-weight:bold;cursor:pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                    <div id="lastsolve-scramble" style="font-size: 0.85em; text-align: center; color: var(--text-color); word-break: break-word;max-width:95%;">${lastScramble || ""}</div>
                    <div id="lastsolve-time" style="font-size: 1.6em; font-family: Inconsolata, monospace; font-weight: bold; color: var(--text-color);">${timeDisplay}</div>
                    <div id="lastsolve-num" style="font-size: 0.85em; color: var(--text-color);">#${lastIndex + 1}</div>
                </div>
            `;

            // Make sure alg is applied to twisty-player
            const twisty = document.getElementById('scramble-display-player');
            if (twisty) {
                const puzzleType = getTwistyPuzzleType(sessions[currentSession].scrambleType);
                twisty.puzzle = puzzleType;
                twisty.alg = lastScramble || "";
            }
            break;

        case 'graph':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Solve Graph</h3>
                </div>
                <div class="graph-controls">
                    <select id="graphType" onchange="updateGraph()">
                        <option value="times">Solve Times</option>
                        <option value="ao5">Ao5 Trend</option>
                        <option value="ao12">Ao12 Trend</option>
                    </select>
                </div>
                <div class="graph-container">
                    <canvas id="solveGraph"></canvas>
                </div>
            `;
            // Initialize the graph immediately after adding to DOM
            requestAnimationFrame(() => updateGraph());
            break;

        case 'remove':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Remove Solves</h3>
                </div>
                <div class="remove-solves-container">
                    <div class="remove-filter">
                        <select id="removeType" onchange="updateRemoveFilter()">
                            <option value="less">Less than</option>
                            <option value="greater">Greater than</option>
                        </select>
                        <input type="number" 
                            id="removeValue" 
                            value="1.00" 
                            step="0.01" 
                            min="0"
                            onchange="updateRemoveFilter()"
                            oninput="updateRemoveFilter()">
                    </div>
                    <div class="matching-solves">
                        <div class="solves-count">Matching solves: <span id="solvesCount">0</span></div>
                        <div id="matchingSolves" class="solves-list"></div>
                    </div>
                    <button onclick="executeRemove()" class="remove-button">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            
            // Add initial filter update
            setTimeout(updateRemoveFilter, 0);
            break;

        case 'multiphase':
            scrambleBox.style.display = 'block';
            scrambleBox.innerHTML = `
                <div class="visualization-header">
                    <h3>Multiphase Timer</h3>
                </div>
                <div class="multiphase-tool-panel">
                    <select id="multiphasePreset">
                        <option value="cfop">CFOP (4 phases)</option>
                        <option value="roux">Roux (4 phases)</option>
                        <option value="bld">BLD (2 phases)</option>
                        <option value="custom">Custom</option>
                    </select>
                    <div id="multiphaseCustomPhases" style="display:none; margin-top:10px;"></div>
                    <div id="multiphasePhasesList" class="multiphase-phases-list"></div>
                </div>
            `;
            // Attach event listeners for preset and custom phase setup
            const presetSelect = document.getElementById('multiphasePreset');
            presetSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    document.getElementById('multiphasePhasesList').style.display = 'none';
                    showCustomPhaseInput();
                } else {
                    document.getElementById('multiphaseCustomPhases').style.display = 'none';
                    document.getElementById('multiphasePhasesList').style.display = '';
                    window.multiphaseTool && window.multiphaseTool.setPreset(this.value);
                }
            });
            // Initialize multiphase tool logic
            if (window.multiphaseTool && window.multiphaseTool.initUI) {
                window.multiphaseTool.initUI();
            }
            break;
    }
}

function updateGraph() {
    const canvas = document.getElementById('solveGraph');
    if (!canvas) return;

    const graphType = document.getElementById('graphType').value;
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.solveChart) {
        window.solveChart.destroy();
    }

    // Get only the last 50 times
    const times = sessions[currentSession].times.slice(-50);
    if (!times || times.length === 0) {
        const container = canvas.parentElement;
        container.innerHTML = `
        
            <div id="graph-wrapper" class="display-wrapper">
                <div class="empty-state" style="position:relative; transform:none; top:0; left:0;">
                    <i class="cubing-icon event-333oh"></i>
                    <h3>No solves yet</h3>
                    <p>Start solving to see your solve graph here.</p>
                </div>
            </div>
        `;
        return;
    }

    let data = [];
    let labels = [];
    
    // Changed this part to use actual solve numbers instead of relative indices
    const useRelativeIndices = times.length >= 50;
    const startingIndex = useRelativeIndices ? 
        sessions[currentSession].times.length - 50 : 0;

    switch(graphType) {
        case 'times':
            data = times.map(time => time === DNF_VALUE ? null : time);
            labels = times.map((_, i) => i + startingIndex + 1);
            break;
        case 'ao5':
            for (let i = 4; i < times.length; i++) {
                const ao5 = getAverageOf5(times.slice(0, i + 1));
                if (ao5 !== '--' && ao5 !== 'DNF') {
                    data.push(ao5);
                    labels.push(i + startingIndex + 1);
                }
            }
            break;
        case 'ao12':
            for (let i = 11; i < times.length; i++) {
                const ao12 = getAverageOf12(times.slice(0, i + 1));
                if (ao12 !== '--' && ao12 !== 'DNF') {
                    data.push(ao12);
                    labels.push(i + startingIndex + 1);
                }
            }
            break;
    }

    // Get CSS variables for consistent theming
    const style = getComputedStyle(document.body);
    const primaryColor = style.getPropertyValue('--primary-color').trim();
    const textColor = style.getPropertyValue('--text-color').trim();
    const gridColor = style.getPropertyValue('--border-color').trim();

    window.solveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: graphType === 'times' ? 'Last 50 Solves' : 
                       graphType === 'ao5' ? 'Average of 5' : 'Average of 12',
                data: data,
                borderColor: primaryColor,
                backgroundColor: primaryColor + '20',
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: primaryColor,
                pointBorderColor: 'transparent',
                pointHoverBackgroundColor: primaryColor,
                pointHoverBorderColor: primaryColor,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 20 // Increased bottom padding for x-axis
                }
            },
            scales: {
                y: {
                    grid: {
                        display: false  // Remove y-axis grid lines
                    },
                    ticks: {
                        color: textColor,
                        callback: value => formatTime(value * 1000),
                        font: {
                            size: 10 // Smaller font size
                        }
                    }
                },
                x: {
                    grid: {
                        display: false  // Remove x-axis grid lines
                    },
                    ticks: {
                        color: textColor,
                        maxTicksLimit: 8,
                        font: {
                            size: 9
                        },
                        padding: 10 // Increased padding for x-axis ticks
                    }
                }
            },
            animation: {
                duration: 500
            }
        }
    });
}

// Update the graph container styles
const graphStyles = document.createElement('style');
graphStyles.textContent = `
    .graph-controls {
        padding: 4px;
        text-align: center;
        margin-top: 15px;
        margin-bottom: 8px;
        position: relative;
        z-index: 2;
    }
    
    .graph-controls select {
        background: var(--highlight-bg);
        color: var(--text-color);
        border: 1px solid var(--border-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        cursor: pointer;
        width: 110px;
    }
    
    .graph-container {
        height: calc(100% - 60px);
        padding: 4px;
        padding-bottom: 20px;
        position: relative;
        box-sizing: border-box;
    }
    
    .graph-container canvas {
        filter: drop-shadow(0 0 8px var(--primary-color-transparent));
        width: 100% !important;
        height: 100% !important;
    }
`;

// Observe history updates to refresh graph
function observeGraphUpdates() {
    const historyList = document.getElementById('historyList');
    if (historyList) {
        const observer = new MutationObserver(() => {
            const toolsSelect = document.querySelector('.tools-select');
            if (toolsSelect && toolsSelect.value === 'graph') {
                updateGraph();
            }
        });
        observer.observe(historyList, { childList: true, subtree: true });
    }

    // Also update when session changes
    const sessionSelector = document.getElementById('sessionSelector');
    if (sessionSelector) {
        sessionSelector.addEventListener('change', () => {
            const toolsSelect = document.querySelector('.tools-select');
            if (toolsSelect && toolsSelect.value === 'graph') {
                updateGraph();
            }
        });
    }
}

// Initialize graph updates when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(graphStyles);
    observeGraphUpdates();
});

function initializeCustomDropdowns(container) {
    const dropdowns = container.querySelectorAll('.custom-dropdown');
    
    dropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.dropdown-selected');
        const options = dropdown.querySelector('.dropdown-options');
        
        // Set initial selected value
        const initialOption = options.querySelector('.dropdown-option');
        dropdown.dataset.value = initialOption.dataset.value;
        
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open');
                    d.querySelector('.dropdown-options').style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('open');
            options.style.display = dropdown.classList.contains('open') ? 'block' : 'none';
        });

        options.querySelectorAll('.dropdown-option').forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                selected.innerHTML = option.innerHTML;
                dropdown.dataset.value = value;
                dropdown.classList.remove('open');
                options.style.display = 'none';
                
                options.querySelectorAll('.dropdown-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                
                updateCrossSolution();
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(d => {
            d.classList.remove('open');
            d.querySelector('.dropdown-options').style.display = 'none';
        });
    });
}

function updateCrossSolution() {
    if (!currentScramble) return;

    const scrambleBox = document.getElementById('scrambleVisBox');
    const solutionsList = scrambleBox.querySelector('.solutions-list');
    if (!solutionsList) return;

    // Check if scramble type is 3x3
    if (sessions[currentSession].scrambleType !== '3x3') {
        solutionsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Cross solver is only available for 3x3 scrambles</p>
            </div>`;
        return;
    }

    // Show loading animation
    solutionsList.innerHTML = `
        <div class="loading-animation">
            <div class="spinner"></div>
            <p>Calculating solutions...</p>
        </div>`;

    // Add slight delay to ensure loading animation shows
    setTimeout(() => {
        const moveSeq = scrambleParser.parseScramble(currentScramble, "FRUBLD");
        const solveType = parseInt(scrambleBox.querySelector('#crossSolveTypeDropdown').dataset.value || '0');
        const currentFace = parseInt(scrambleBox.querySelector('#crossFaceDropdown').dataset.value || '0');

        const faces = [
            ["Yellow", "#FFFF00", ""],
            ["White", "#FFFFFF", "z2"],
            ["Orange", "#FFA500", "z'"],
            ["Red", "#FF0000", "z"],
            ["Green", "#00FF00", "x'"],
            ["Blue", "#0000FF", "x"]
        ];

        let baseSolutions;
        let solutionsLimit;
        
        // Set different limits based on solve type
        switch(solveType) {
            case 0: // Cross only
                baseSolutions = cross.solve(moveSeq)[currentFace];
                solutionsLimit = 6; // Increased from 4 to 12 for cross
                break;
            case 1: // XCross
                baseSolutions = cross.solve_xcross(moveSeq, currentFace);
                solutionsLimit = 6;
                break;
            case 2: // XXCross
                baseSolutions = cross.solve_xxcross(moveSeq, currentFace);
                solutionsLimit = 4;
                break;
        }

        // Check if no solutions were found
        if (!baseSolutions || baseSolutions.length === 0) {
            solutionsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-search"></i>
                    <p>No solutions found for this scramble</p>
                </div>`;
            return;
        }

        const faceRotations = {
            'Yellow': '',
            'White': 'z2 ',
            'Orange': 'z\' ',
            'Red': 'z ',
            'Green': 'x\' ',
            'Blue': 'x '
        };

        const rotations = ['none', 'y', 'y\'', 'y2'];
        const solutionMap = new Map(); // Use Map to store unique solutions

        baseSolutions.forEach(sol => {
            // Try all rotations and find the best one for this solution
            let bestRotation = 'none';
            let bestSpeed = Infinity;
            let bestMoves = sol;

            rotations.forEach(rotation => {
                const moves = rotation === 'none' ? sol : applyRotation(sol, rotation);
                const speed = algSpeed(moves.join(' '));
                
                if (speed < bestSpeed) {
                    bestSpeed = speed;
                    bestRotation = rotation;
                    bestMoves = moves;
                }
            });

            // Create a unique key for this solution
            const key = bestMoves.join(' ');
            if (!solutionMap.has(key)) {
                solutionMap.set(key, {
                    moves: bestMoves,
                    rotation: bestRotation,
                    faceRotation: faceRotations[faces[currentFace][0]],
                    speed: bestSpeed
                });
            }
        });

        // Convert map to array and sort by speed
        const allSolutions = Array.from(solutionMap.values());
        allSolutions.sort((a, b) => a.speed - b.speed);
        
        // Keep only the best solutions based on solve type limit
        const displaySolutions = allSolutions.slice(0, solutionsLimit);

        // Display solutions
        solutionsList.innerHTML = displaySolutions.map((sol, idx) => `
            <div class="solution-card ${idx === 0 ? 'best' : ''}">
                <div class="rank-number">${idx + 1}</div>
                <div class="solution-info">
                    <div class="solution-algorithm">
                        ${sol.faceRotation}${sol.rotation !== 'none' ? sol.rotation + ' ' : ''}${sol.moves.join(' ')}
                    </div>
                    <div class="solution-stats">
                        <span>${sol.moves.length} moves</span>
                        <span>${sol.speed.toFixed(2)} MCC</span>
                        ${idx > 0 ? `<span>(+${(sol.speed - allSolutions[0].speed).toFixed(2)})</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }, 100);
}

// Add rotation mapping functions
function applyRotation(moves, rotation) {
    const moveMapping = {
        'y\'': { 'F':'R', 'R':'B', 'B':'L', 'L':'F', 'U':'U', 'D':'D' },
        'y': { 'F':'L', 'L':'B', 'B':'R', 'R':'F', 'U':'U', 'D':'D' },
        'y2': { 'F':'B', 'B':'F', 'R':'L', 'L':'R', 'U':'U', 'D':'D' }
    };
    return moves.map(move => {
        let face = move[0].toUpperCase();
        let suffix = move.slice(1);
        return (moveMapping[rotation][face] || face) + suffix;
    });
}

function getRotatedFace(originalFace, rotation) {
    const faceRotationMap = {
        'y': { 'D':'D', 'U':'U', 'L':'F', 'F':'R', 'R':'B', 'B':'L' },
        'y\'': { 'D':'D', 'U':'U', 'L':'B', 'B':'R', 'R':'F', 'F':'L' },
        'y2': { 'D':'D', 'U':'U', 'L':'R', 'R':'L', 'F':'B', 'B':'F' }
    };
    return faceRotationMap[rotation][originalFace] || originalFace;
}

// Update when scramble changes
let scrambleObserver = new MutationObserver(() => {
    updateCrossSolution();
});

document.addEventListener('DOMContentLoaded', () => {
    const scrambleDisplay = document.getElementById('scrambleDisplay');
    if (scrambleDisplay) {
        scrambleObserver.observe(scrambleDisplay, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
});

// Ensure lastsolve updates when anything changes
function updateLastSolveTool() {
    const toolsSelect = document.querySelector('.tools-select');
    if (toolsSelect && toolsSelect.value === 'lastsolve') {
        handleToolSelect('lastsolve');
    }
}

function observeLastSolveUpdates() {
    // Observe history list for changes (solves added/removed/penalized)
    const historyList = document.getElementById('historyList');
    if (historyList) {
        const observer = new MutationObserver(updateLastSolveTool);
        observer.observe(historyList, { childList: true, subtree: true });
    }
    // Observe session selector for session changes
    const sessionSelector = document.getElementById('sessionSelector');
    if (sessionSelector) {
        sessionSelector.addEventListener('change', updateLastSolveTool);
    }
    // Observe scramble type changes
    document.querySelectorAll('.scramble-type-item').forEach(item => {
        item.addEventListener('click', updateLastSolveTool);
    });
    // Listen for penalty, DNF, delete button clicks
    document.addEventListener('click', (e) => {
        if (
            e.target.classList.contains('penalty') ||
            e.target.classList.contains('dnf') ||
            e.target.classList.contains('delete')
        ) {
            setTimeout(updateLastSolveTool, 50);
        }
    });
}
document.addEventListener('DOMContentLoaded', observeLastSolveUpdates);

function updateRemoveFilter() {
    const type = document.getElementById('removeType').value;
    const value = parseFloat(document.getElementById('removeValue').value);
    const solvesCount = document.getElementById('solvesCount');
    const matchingSolves = document.getElementById('matchingSolves');
    
    // Safety check if elements don't exist (tool not visible)
    if (!solvesCount || !matchingSolves) return;
    
    if (!sessions[currentSession] || !sessions[currentSession].times) return;
    
    const matches = sessions[currentSession].times.filter((time, idx) => {
        if (time === DNF_VALUE) return false;
        return type === 'less' ? time < value : time > value;
    });
    
    solvesCount.textContent = matches.length;
    matchingSolves.textContent = matches.map(t => formatTime(t * 1000)).join(', ');
}

// Add observer setup function
function observeRemoveSolvesUpdates() {
    // Observe history list for changes (solves added/removed/penalized)
    const historyList = document.getElementById('historyList');
    if (historyList) {
        const observer = new MutationObserver(() => {
            const toolsSelect = document.querySelector('.tools-select');
            if (toolsSelect && toolsSelect.value === 'remove') {
                updateRemoveFilter();
            }
        });
        observer.observe(historyList, { childList: true, subtree: true });
    }

    // Observe session selector for session changes
    const sessionSelector = document.getElementById('sessionSelector');
    if (sessionSelector) {
        sessionSelector.addEventListener('change', () => {
            const toolsSelect = document.querySelector('.tools-select');
            if (toolsSelect && toolsSelect.value === 'remove') {
                updateRemoveFilter();
            }
        });
    }

    // Observe scramble type changes
    document.querySelectorAll('.scramble-type-item').forEach(item => {
        item.addEventListener('click', () => {
            const toolsSelect = document.querySelector('.tools-select');
            if (toolsSelect && toolsSelect.value === 'remove') {
                updateRemoveFilter();
            }
        });
    });
}

// Initialize observers when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    observeRemoveSolvesUpdates();
    // ...existing code...
});

function executeRemove() {
    const type = document.getElementById('removeType').value;
    const value = parseFloat(document.getElementById('removeValue').value);
    
    if (!sessions[currentSession] || !sessions[currentSession].times) return;
    
    // Store the solves to be removed for undo
    const removedData = [];
    const indicesToRemove = [];
    
    sessions[currentSession].times.forEach((time, idx) => {
        if (time !== DNF_VALUE) {
            if ((type === 'less' && time < value) || 
                (type === 'greater' && time > value)) {
                indicesToRemove.push(idx);
                removedData.push({
                    index: idx,
                    time: time,
                    scramble: sessions[currentSession].scrambles[idx],
                    penalty: sessions[currentSession].penalties?.[idx]
                });
            }
        }
    });
    
    if (indicesToRemove.length === 0) return;
    
    // Remove solves in reverse order to maintain correct indices
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
        const idx = indicesToRemove[i];
        sessions[currentSession].times.splice(idx, 1);
        sessions[currentSession].scrambles.splice(idx, 1);
        if (sessions[currentSession].penalties) {
            sessions[currentSession].penalties.splice(idx, 1);
        }
    }
    
    // Show notification with undo option
    showNotification(
        `Removed ${indicesToRemove.length} solves ${type} than ${formatTime(value * 1000)}`,
        {
            undoCallback: () => {
                // Restore all removed solves
                removedData.sort((a, b) => a.index - b.index); // Sort by original index
                removedData.forEach(data => {
                    sessions[currentSession].times.splice(data.index, 0, data.time);
                    sessions[currentSession].scrambles.splice(data.index, 0, data.scramble);
                    if (data.penalty) {
                        if (!sessions[currentSession].penalties) {
                            sessions[currentSession].penalties = [];
                        }
                        sessions[currentSession].penalties[data.index] = data.penalty;
                    }
                });
                
                // Update UI
                updateHistory();
                updateHistorySummary();
                updateRemoveFilter();
                if (autoSave) saveSessionsToLocalStorage();
            }
        }
    );
    
    // Update displays
    updateHistory();
    updateHistorySummary();
    updateRemoveFilter();
    if (autoSave) saveSessionsToLocalStorage();
}

// Add after handleToolSelect
function showCustomPhaseInput() {
    const customDiv = document.getElementById('multiphaseCustomPhases');
    customDiv.style.display = '';
    customDiv.innerHTML = `
        <div class="multiphase-custom-settings">
            <label>Number of Phases: <input type="number" id="customPhaseCount" min="2" max="10" value="4" style="width:50px;"></label>
            <button id="setCustomPhasesBtn">Set</button>
            <div id="customPhaseNames"></div>
        </div>
    `;
    document.getElementById('setCustomPhasesBtn').onclick = function() {
        const count = parseInt(document.getElementById('customPhaseCount').value);
        if (isNaN(count) || count < 2 || count > 10) return;
        let namesHtml = '<div id="customPhaseNamesInner" style="width:100%;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
        for (let i = 0; i < count; i++) {
            namesHtml += `<input type="text" class="custom-phase-name" placeholder="Phase ${i+1}" value="Phase ${i+1}">`;
        }
        namesHtml += '</div><button id="saveCustomPhasesBtn">Save</button>';
        document.getElementById('customPhaseNames').innerHTML = namesHtml;
        document.getElementById('saveCustomPhasesBtn').onclick = function() {
            const names = Array.from(document.querySelectorAll('.custom-phase-name')).map(inp => inp.value.trim() || 'Phase');
            window.multiphaseTool && window.multiphaseTool.setCustomPhases(names);
        };
    };
}

