let solves = [];

let timer = 0;
let isRunning = false;
let timerInterval;

function updateProgress() {
    const learned = cases.filter(c => c.learned).length;
    const total = cases.length;
    const percentage = (learned / total) * 100;
    
    document.querySelector('.progress-fill').style.width = `${percentage}%`;
    document.querySelector('.progress-count').textContent = `${learned}/${total}`;

    // Add or remove completion label
    const progressContainer = document.querySelector('.progress-container');
    const existingLabel = progressContainer.querySelector('.completion-label');
    
    if (learned === total) {
        if (!existingLabel) {
            const label = document.createElement('div');
            label.className = 'completion-label';
            label.textContent = 'DONE';
            progressContainer.appendChild(label);
        }
    } else if (existingLabel) {
        existingLabel.remove();
    }
}

function toggleLearned(index) {
    cases[index].learned = !cases[index].learned;
    const checkbox = document.querySelector(`.algorithm-status[data-index="${index}"]`);
    if (checkbox) {
        if (cases[index].learned) {
            checkbox.classList.add('learned');
        } else {
            checkbox.classList.remove('learned');
            checkbox.innerHTML = '';
        }
    }
    updateProgress();
    updateStorageData();
}

const colorSchemes = {
yellow: {
U: { value: '#FFFF00' }, // Yellow
D: { value: '#FFFFFF' }, // White
F: { value: '#0000FF' }, // Blue
B: { value: '#00FF00' }, // Green
R: { value: '#FF0000' }, // Red
L: { value: '#FFA500' }  // Orange
},
white: {
U: { value: '#FFFFFF' }, // White
D: { value: '#FFFF00' }, // Yellow
F: { value: '#00FF00' }, // Green
B: { value: '#0000FF' }, // Blue
R: { value: '#FF0000' }, // Red
L: { value: '#FFA500' }  // Orange
},
red: {
U: { value: '#FF0000' }, // Red
D: { value: '#FFA500' }, // Orange
F: { value: '#00FF00' }, // Green
B: { value: '#0000FF' }, // Blue
R: { value: '#FFFF00' }, // Yellow
L: { value: '#FFFFFF' }  // White
},
orange: {
U: { value: '#FFA500' }, // Orange
D: { value: '#FF0000' }, // Red
F: { value: '#00FF00' }, // Green
B: { value: '#0000FF' }, // Blue
R: { value: '#FFFFFF' }, // White
L: { value: '#FFFF00' }  // Yellow
},
blue: {
U: { value: '#0000FF' }, // Blue
D: { value: '#00FF00' }, // Green
F: { value: '#FFFFFF' }, // White
B: { value: '#FFFF00' }, // Yellow
R: { value: '#FF0000' },  // Red
L: { value: '#FFA500' }  // Orange              
},
green: {
U: { value: '#00FF00' }, // Green
D: { value: '#0000FF' }, // Blue
F: { value: '#FFFFFF' }, // White
B: { value: '#FFFF00' }, // Yellow
R: { value: '#FFA500' },  // Orange
L: { value: '#FF0000' }   // Red 
}
};


let currentColorScheme = 'yellow'; // Default color scheme

function updateColorScheme(color) {
    currentColorScheme = color;
    window.currentColorScheme = color; // Make it globally available

    // Close dropdown after selection
    const dropdown = document.getElementById('colorDropdown');
    dropdown.classList.remove('show');

    // Regenerate all images with new color scheme
    document.querySelectorAll('.case-image').forEach((container, index) => {
        generatePuzzleImage(cases[index].scramble, container);
    });

    // Update practice area if visible
    if (currentCase) {
        const practiceContainer = document.getElementById('caseImage');
        generatePuzzleImage(currentCase.scramble, practiceContainer);
    }

    // Update recognition tab images if it exists
    if (typeof updateRecognitionImages === 'function') {
        updateRecognitionImages();
    }

    storage.saveColorScheme(color);
}

function showDetailsPopup(caseName, casesolves) {
    const popup = document.getElementById('details-popup');
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('popup-content');
    
    const pllCase = cases.find(c => c.name === caseName);
    const scramble = pllCase ? pllCase.scramble : 'N/A';
    const algorithm = pllCase ? pllCase.selectedAlgorithm : 'N/A';
    const times = casesolves.map(solve => solve.time.toFixed(2)).join(', ');

    content.innerHTML = `
        <p><strong>Case:</strong> ${caseName}</p>
        <p><strong>Solve Count:</strong> ${casesolves.length}</p>
        <p><strong>Times:</strong> ${times}</p>
        <p><strong>Algorithm:</strong> ${algorithm}</p>
        <p><strong>Scramble:</strong> ${scramble}</p>
    `;

    popup.classList.add('visible');
    overlay.classList.add('visible');
}

function closeDetailsPopup() {
    const popup = document.getElementById('details-popup');
    const overlay = document.getElementById('overlay');
    popup.classList.remove('visible');
    overlay.classList.remove('visible');
}

document.getElementById("resetIcon").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all solves? This action cannot be undone.")) {
        solves = [];
        storage.clearSolveHistory();
        updateTimes();
        updateRecentSolves();
    }
});
function createAlgorithmDropdown(algorithms, selectedAlg, index) {
    const dropdown = document.createElement('div');
    dropdown.className = 'alg-dropdown';
    
    const header = document.createElement('div');
    header.className = 'alg-dropdown-header';
    header.innerHTML = `
        <span class="alg-dropdown-current">${selectedAlg}</span>
        <i class="fas fa-chevron-down alg-dropdown-arrow"></i>
    `;
    
    const menu = document.createElement('div');
    menu.className = 'alg-dropdown-menu';
    
    // Add algorithm options
    algorithms.forEach(alg => {
        const item = document.createElement('div');
        item.className = 'alg-dropdown-item';
        item.textContent = alg;
        item.onclick = (e) => {
            e.stopPropagation();
            updateSelectedAlgorithm(index, alg, header);
            dropdown.classList.remove('open');
        };
        menu.appendChild(item);
    });
    
    // Add "Add New" option
    const addNew = document.createElement('div');
    addNew.className = 'alg-dropdown-item add-new';
    addNew.innerHTML = '<i class="fas fa-plus"></i> Add New';
    addNew.onclick = (e) => {
        e.stopPropagation();
        handleNewAlgorithm(index, header);
        dropdown.classList.remove('open');
    };
    menu.appendChild(addNew);
    
    // Toggle dropdown
    header.onclick = () => {
        dropdown.classList.toggle('open');
    };
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    dropdown.appendChild(header);
    dropdown.appendChild(menu);
    return dropdown;
}

function updateSelectedAlgorithm(index, algorithm, header) {
    cases[index].selectedAlgorithm = algorithm;
    cases[index].scramble = invertAlgorithm(algorithm);
    
    // Update dropdown header
    const current = header.querySelector('.alg-dropdown-current');
    current.textContent = algorithm;
    
    // Update scramble in table
    const row = header.closest('tr');
    const scrambleCell = row.querySelector('td[data-label="Scramble"]');
    if (scrambleCell) {
        scrambleCell.textContent = cases[index].scramble;
    }
    
    // Update case image
    const caseImageContainer = document.querySelector(`#caseImage-${index}`);
    if (caseImageContainer) {
        generatePuzzleImage(cases[index].scramble, caseImageContainer);
    }
    
    updateStorageData();
}

function handleNewAlgorithm(index, header) {
    const input = prompt('Enter new algorithm (or type "delete" to remove the last added algorithm):');
    
    if (input && input.trim()) {
        if (input.trim().toLowerCase() === 'delete') {
            if (cases[index].algorithms.length > 1) {
                const algToDelete = cases[index].algorithms[cases[index].algorithms.length - 1];
                if (confirm(`Are you sure you want to delete "${algToDelete}"?`)) {
                    cases[index].algorithms.pop();
                    const newSelected = cases[index].algorithms[cases[index].algorithms.length - 1];
                    
                    // Recreate the dropdown to reflect changes
                    const algCell = header.closest('td');
                    algCell.innerHTML = '';
                    algCell.appendChild(createAlgorithmDropdown(cases[index].algorithms, newSelected, index));
                    
                    updateSelectedAlgorithm(index, newSelected, algCell.querySelector('.alg-dropdown-header'));
                }
            } else {
                alert("Cannot delete the last algorithm!");
            }
        } else {
            const newAlg = input.trim();
            cases[index].algorithms.push(newAlg);
            updateSelectedAlgorithm(index, newAlg, header);
        }
    }
}

function initializeTable() {
    const tableBody = document.querySelector("#pllTable tbody");
    tableBody.innerHTML = '';

    const savedSelectedCases = storage.getSelectedCases() || [];

    cases.forEach((pllCase, index) => {
        const row = document.createElement("tr");
        const caseImageContainer = document.createElement("div");
        caseImageContainer.id = `caseImage-${index}`;
        caseImageContainer.className = "case-image";
        if (savedSelectedCases.includes(index)) {
            caseImageContainer.classList.add('selected');
        }
        caseImageContainer.setAttribute('data-index', index);
        caseImageContainer.onclick = () => toggleCaseSelection(index, caseImageContainer);

        row.innerHTML = `
            <td data-label="Case">${pllCase.name}</td>
            <td data-label="Visual"></td>
            <td data-label="Algorithm"></td>
            <td data-label="Scramble">${pllCase.scramble}</td>
            <td data-label="Best Time" class="best-time">-</td>
            <td data-label="Average Time" class="avg-time">-</td>
            <td data-label="Status">
                <div class="algorithm-status ${pllCase.learned ? 'learned' : ''}" 
                     data-index="${index}" 
                     onclick="toggleLearned(${index})">
                </div>
            </td>
        `;

        tableBody.appendChild(row);
        row.querySelector('td:nth-child(2)').appendChild(caseImageContainer);
        
        // Add the custom dropdown
        const algCell = row.querySelector('td:nth-child(3)');
        algCell.appendChild(createAlgorithmDropdown(pllCase.algorithms, pllCase.selectedAlgorithm, index));
        
        generatePuzzleImage(pllCase.scramble, caseImageContainer);
    });
    updateTimes();
}
const selectedCases = [];

function updateSelectedCounter() {
    const counter = document.getElementById('selectedCounter');
    if (counter) {
        counter.textContent = `${selectedCases.length}/${cases.length}`;
    }
}

function handleAlgorithmChange(event, index) {
    if (event.target.value === 'add_new') {
        const input = prompt('Enter new algorithm (or type "delete" to remove the last added algorithm):');

        if (input && input.trim()) {
            if (input.trim().toLowerCase() === 'delete') {
                if (cases[index].algorithms.length > 1) {
                    const algToDelete = cases[index].algorithms[cases[index].algorithms.length - 1];
                    const confirmDelete = confirm(`Are you sure you want to delete "${algToDelete}"?`);
                    
                    if (confirmDelete) {
                        cases[index].algorithms.pop();
                        cases[index].selectedAlgorithm = cases[index].algorithms[cases[index].algorithms.length - 1];
                        cases[index].scramble = invertAlgorithm(cases[index].selectedAlgorithm);
                        
                        const select = event.target;
                        select.innerHTML = cases[index].algorithms.map(algo => 
                            `<option value="${algo}" ${algo === cases[index].selectedAlgorithm ? 'selected' : ''}>${algo}</option>`
                        ).join("") + '<option value="add_new">+ Add New</option>';
                        
                        const caseImageContainer = document.querySelector(`#caseImage-${index}`);
                        if (caseImageContainer) {
                            generatePuzzleImage(cases[index].scramble, caseImageContainer);
                        }
                        
                        const row = event.target.closest('tr');
                        const scrambleCell = row.querySelector('td:nth-child(4)');
                        if (scrambleCell) {
                            scrambleCell.textContent = cases[index].scramble;
                        }
                    }
                } else {
                    alert("Cannot delete the last algorithm!");
                }
            } else {
                cases[index].algorithms.push(input.trim());
                cases[index].selectedAlgorithm = input.trim();
                cases[index].scramble = invertAlgorithm(input.trim());
                
                const select = event.target;
                select.innerHTML = cases[index].algorithms.map(algo => 
                    `<option value="${algo}" ${algo === input.trim() ? 'selected' : ''}>${algo}</option>`
                ).join("") + '<option value="add_new">+ Add New</option>';
                
                const caseImageContainer = document.querySelector(`#caseImage-${index}`);
                if (caseImageContainer) {
                    generatePuzzleImage(cases[index].scramble, caseImageContainer);
                }
                
                const row = event.target.closest('tr');
                const scrambleCell = row.querySelector('td:nth-child(4)');
                if (scrambleCell) {
                    scrambleCell.textContent = cases[index].scramble;
                }
            }
        }
        event.target.value = cases[index].selectedAlgorithm;
    } else {
        cases[index].selectedAlgorithm = event.target.value;
        cases[index].scramble = invertAlgorithm(event.target.value);
        
        const caseImageContainer = document.querySelector(`#caseImage-${index}`);
        if (caseImageContainer) {
            generatePuzzleImage(cases[index].scramble, caseImageContainer);
        }
        
        const row = event.target.closest('tr');
        const scrambleCell = row.querySelector('td:nth-child(4)');
        if (scrambleCell) {
            scrambleCell.textContent = cases[index].scramble;
        }
    }
    updateStorageData();
}

function toggleCaseSelection(index, element) {
    const caseIndex = selectedCases.indexOf(index);

    if (caseIndex === -1) {
        selectedCases.push(index);
        element.classList.add('selected');
    } else {
        selectedCases.splice(caseIndex, 1);
        element.classList.remove('selected');
    }

    updateSelectedCounter();
    updatePracticeArea();
    storage.saveSelectedCases(selectedCases);  // Save immediately after any change
}

let lastScrambleIndex = -1;

function updatePracticeArea() {
    const availableCases = selectedCases.length > 0 
        ? selectedCases.map(index => cases[index]) 
        : cases;

    if (availableCases.length === 0) {
        document.getElementById('currentCase').textContent = "No case selected";
        document.getElementById('caseImage').innerHTML = "";
        document.getElementById('scramble').textContent = "Select cases in the 'Learn' tab to practice.";
        return;
    }

    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * availableCases.length);
    } while (availableCases.length > 1 && newIndex === lastScrambleIndex);
    
    lastScrambleIndex = newIndex;
    currentCase = availableCases[newIndex];
    
    document.getElementById('currentCase').textContent = currentCase.name;
    document.getElementById('scramble').textContent = currentCase.scramble; // Remove "Scramble: " prefix
    
    const caseImageContainer = document.getElementById('caseImage');
    caseImageContainer.innerHTML = ''; // Clear previous image
    generatePuzzleImage(currentCase.scramble, caseImageContainer);

}

function setNewCase() {
    const availableCases = selectedCases.length > 0 
        ? selectedCases.map(index => cases[index]) 
        : cases;

    if (availableCases.length === 0) {
        alert("No cases selected for practice. Please select cases in the 'Learn' tab.");
        return;
    }

    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * availableCases.length);
    } while (availableCases.length > 1 && newIndex === lastScrambleIndex);
    
    lastScrambleIndex = newIndex;
    currentCase = availableCases[newIndex];
    
    document.getElementById('currentCase').textContent = currentCase.name;
    document.getElementById('scramble').textContent = currentCase.scramble; // Remove "Scramble: " prefix
    document.getElementById('hint').textContent = '';
    
    const caseImageContainer = document.getElementById('caseImage');
    caseImageContainer.innerHTML = ''; // Clear previous image
    generatePuzzleImage(currentCase.scramble, caseImageContainer);
}

function updateAlgorithm(event, caseIndex) {
    const select = event.target;
    cases[caseIndex].selectedAlgorithm = select.value;
    updateStorageData();
}

function showTab(tabName) {
    // Only try to update tabs that exist in current page
    const tabContent = document.getElementById(tabName);
    if (!tabContent) return; // Exit if tab doesn't exist

    // Remove active class from all tab contents that exist
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content) content.classList.remove('active');
    });

    // Remove active class from all tabs that exist
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab) tab.classList.remove('active');
    });

    // Add active class to selected tab content
    tabContent.classList.add('active');

    // Try to activate the tab button if it exists
    const tabButton = document.querySelector(`.tab[onclick="showTab('${tabName}')"]`);
    if (tabButton) tabButton.classList.add('active');

    // Handle specific tab content
    if (tabName === "practice") {
        updatePracticeArea();
    }
}

function startTimer() {
    if (!isRunning) {
        timer = 0;
        isRunning = true;
        enterDesktopFocusMode();
        document.getElementById("timer").style.color = 'var(--primary-color)';
        timerInterval = setInterval(() => {
            timer += 0.01;
            document.getElementById("timer").textContent = timer.toFixed(2);
        }, 10);
    } else {
        stopTimer();
    }
}

function stopTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        exitDesktopFocusMode();
        document.getElementById("timer").style.color = 'var(--text-color)';
        const newSolve = { case: currentCase.name, time: timer };
        solves.unshift(newSolve);
        storage.addSolve(newSolve);
        updateTimes();
        updateRecentSolves();
        setNewCase();
    }
}

// Add focus mode functions directly from timer.js
function enterDesktopFocusMode() {
    const overlay = document.createElement('div');
    overlay.className = 'focus-mode-overlay';
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
        overlay.classList.add('fade-in');
    });
    
    document.querySelectorAll('.recent-solves, .practice-header, #scramble')
        .forEach(el => el.classList.add('desktop-focus-hidden'));
}

function exitDesktopFocusMode() {
    const overlay = document.querySelector('.focus-mode-overlay');
    if (overlay) {
        overlay.classList.add('fade-out');
        overlay.addEventListener('transitionend', () => {
            overlay.remove();
        });
    }

    document.querySelectorAll('.desktop-focus-hidden')
        .forEach(el => el.classList.remove('desktop-focus-hidden'));
}

function updateTimes() {
    cases.forEach(pllCase => {
        const caseSolves = solves.filter(solve => solve.case === pllCase.name);
        const bestTime = caseSolves.length > 0 ? Math.min(...caseSolves.map(solve => solve.time)).toFixed(2) : "-";
        const avgTime = caseSolves.length >= 5 ? (caseSolves.slice(0, 5).reduce((sum, solve) => sum + solve.time, 0) / 5).toFixed(2) : "-";

        const row = document.querySelector(`#pllTable tbody tr:nth-child(${cases.indexOf(pllCase) + 1})`);
        if (row) {
            row.querySelector(".best-time").textContent = bestTime;
            row.querySelector(".avg-time").textContent = avgTime;
        }
    });
}

function updateRecentSolves() {
    const solvesContainer = document.querySelector(".solve-cards");
    const noHistoryMessage = document.querySelector(".no-history-message");
    solvesContainer.innerHTML = "";
    
    if (solves.length === 0) {
        solvesContainer.style.display = 'none';
        noHistoryMessage.classList.add('show');
        return;
    }

    // Group solves by case
    const solveGroups = {};
    solves.forEach((solve) => {
        if (!solveGroups[solve.case]) {
            solveGroups[solve.case] = [];
        }
        solveGroups[solve.case].push(solve);
    });

    solvesContainer.style.display = 'grid';
    noHistoryMessage.classList.remove('show');
    
    // Create cards for unique cases
    Object.entries(solveGroups).forEach(([caseName, casesolves]) => {
        const latestSolve = casesolves[0];
        const solveCount = casesolves.length;
        
        const card = document.createElement("div");
        card.className = "solve-card";
        card.onclick = () => showDetailsPopup(caseName, casesolves);
        
        card.innerHTML = `
            <div class="solve-time">${latestSolve.time.toFixed(2)}s</div>
            <div class="solve-case">${caseName}</div>
            ${solveCount > 1 ? `<span class="solve-count">${solveCount}</span>` : ''}
        `;
        
        solvesContainer.appendChild(card);
    });
}

function deleteSolve(index) {
    solves.splice(index, 1);
    updateTimes();
    updateRecentSolves();
    updateStorageData();
}

function showHint() {
    const hint = currentCase.selectedAlgorithm 
        ? currentCase.selectedAlgorithm.slice(0, 4) 
        : currentCase.algorithms[0].slice(0, 4);
    document.getElementById('hint').textContent = `Hint: ${hint}`;
}


function toggleDropdown(event) {
console.log('Toggle dropdown clicked');
event.stopPropagation();
const dropdown = document.getElementById('colorDropdown');
console.log('Dropdown element:', dropdown);
dropdown.classList.toggle('show');
console.log('Toggle applied');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
console.log('Document clicked');
const dropdowns = document.getElementsByClassName('dropdown-content');
for (const dropdown of dropdowns) {
if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
}
}
});

function initializeSelectedAlgorithms() {
    const savedAlgorithms = storage.getAlgorithms();
    if (savedAlgorithms && savedAlgorithms.length > 0) {
        cases.forEach((pllCase, index) => {
            if (savedAlgorithms[index]) {
                pllCase.algorithms = savedAlgorithms[index].algorithms || pllCase.algorithms;
                pllCase.selectedAlgorithm = savedAlgorithms[index].selected || pllCase.algorithms[0];
                // Update scramble based on the selected algorithm
                pllCase.scramble = invertAlgorithm(pllCase.selectedAlgorithm);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        // Load saved data
        initializeSelectedAlgorithms();
        const savedCases = storage.getSelectedCases() || [];
        const savedStatuses = storage.getCaseStatuses();
        const savedColorScheme = storage.getColorScheme();
        const savedHistory = storage.getSolveHistory();

        // Apply saved selected cases
        selectedCases.length = 0; // Clear existing
        selectedCases.push(...savedCases);

        // Apply saved case statuses
        if (Object.keys(savedStatuses).length > 0) {
            cases.forEach((pllCase, index) => {
                pllCase.learned = savedStatuses[index] || false;
            });
        }

        // Apply saved color scheme
        if (savedColorScheme) {
            currentColorScheme = savedColorScheme;
        }

        // Apply saved solve history
        if (savedHistory.length > 0) {
            solves = savedHistory;
        }

        initializeTable();  // Move this after loading saved cases
        setNewCase();
        updateProgress();
        updateSelectedCounter();
        updateRecentSolves();

        // Add recognition initialization if on recognition page
        if (typeof initializeRecognition === 'function') {
            initializeRecognition();
        }

        // Ensure colorScheme is available globally
        window.currentColorScheme = currentColorScheme;
        window.colorSchemes = colorSchemes;

        const timerElement = document.getElementById("timer");

        let touchStartTime;
        let longPressTimer;

        timerElement.addEventListener("touchstart", function(e) {
            e.preventDefault();
            touchStartTime = Date.now();
            longPressTimer = setTimeout(() => {
                timerElement.style.color = '#3498db';
            }, 300);
        });

        timerElement.addEventListener("touchend", function(e) {
            e.preventDefault();
            clearTimeout(longPressTimer);
            const touchDuration = Date.now() - touchStartTime;

            if (touchDuration >= 300) {
                if (!isRunning) {
                    startTimer();
                }
            } else {
                startTimer();
            }
        });

        document.getElementById("newCaseButton").addEventListener("click", setNewCase);

        const hintButton = document.getElementById("hintButton");
        hintButton.addEventListener("click", (e) => {
            e.preventDefault(); 
            showHint();
            hintButton.blur();
        });

        const animatedElements = document.querySelectorAll('.fade-in-down');
        animatedElements.forEach((element) => {
            element.classList.add('animate');
        });

        setTimeout(() => {
            animatedElements.forEach((element) => {
                element.classList.remove('fade-in-down', 'animate');
            });
        }, 1000);

        // Add click handler to the palette icon
        const dropdownIcon = document.querySelector('.dropdown-icon');
        if (dropdownIcon) {
            dropdownIcon.addEventListener('click', toggleDropdown);
        }
        
        // Add click handlers to color options
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                console.log('Color option clicked:', e.target.dataset.color);
                updateColorScheme(e.target.dataset.color);
            });
        });

    } catch (error) {
        console.error("Error in initialization:", error);
    }
});

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
    }
});

document.addEventListener("keyup", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        if (!document.activeElement.closest('#hintButton')) {
            startTimer();
        }
    }
});

document.getElementById("hintButton").addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
    }
});                       

function cleanAlgorithm(alg) {
    return alg.replace(/[\[\](){}]/g, '').trim();
}

function invertMove(move) {
    if (!move) return '';
    const baseMove = move[0];
    const modifier = move.slice(1);
    
    // Handle U2' case - return as is
    if (modifier === "2'") return move;
    if (modifier === "2") return move;
    if (modifier === "'") return baseMove;
    return baseMove + "'";
}

function invertAlgorithm(algorithm) {
    // First clean the algorithm
    const cleanedAlg = cleanAlgorithm(algorithm);
    
    // Add spaces between moves if they don't exist
    const withSpaces = cleanedAlg.replace(/([A-Z])(?=[A-Z])/g, '$1 ');
    
    // Split into moves and invert
    const moves = withSpaces.split(/\s+/);
    return moves.reverse().map(move => invertMove(move)).join(' ');
}

function updateStorageData() {
    // Save algorithms with their selected variants and scrambles
    const algorithmList = cases.map(caseData => ({
        algorithms: caseData.algorithms,
        selected: caseData.selectedAlgorithm,
        scramble: caseData.scramble
    }));
    storage.saveAlgorithms(algorithmList);

    // Save case statuses
    const statusList = cases.reduce((acc, caseData, index) => {
        acc[index] = caseData.learned;
        return acc;
    }, {});
    storage.saveCaseStatuses(statusList);

    // Save selected cases
    storage.saveSelectedCases(selectedCases);

    // Save color scheme
    storage.saveColorScheme(currentColorScheme);

    // Save solve history
    storage.saveSolveHistory(solves);
}