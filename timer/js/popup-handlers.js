function showDetails(index) {
    const existingPopup = document.querySelector('.detail-popup');
    if (existingPopup) {
        existingPopup.remove();
        if (existingPopup.dataset.index == index) {
            return;
        }
    }

    const popup = document.createElement('div');
    popup.className = 'detail-popup';
    popup.dataset.index = index;

    // Set initial position
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';

    // Get comment from session data
    if (!sessions[currentSession].comments) {
        sessions[currentSession].comments = [];
    }
    const existingComment = sessions[currentSession].comments[index] || "";
    const currentScrambleType = sessions[currentSession]?.scrambleType || "3x3";

    // Format time display with penalties
    let timeDisplay;
    const time = sessions[currentSession].times[index];
    const date = sessions[currentSession].dates?.[index] 
        ? new Date(sessions[currentSession].dates[index]).toLocaleString()
        : ''; // Don't show date for older solves
    const penalty = sessions[currentSession].penalties?.[index];
    const isDNF = time === Infinity || time === "DNF";
    const phaseTimes = sessions[currentSession].phaseTimes?.[index];
    const inspectionTime = sessions[currentSession].inspectionTimes?.[index] || 0;

    if (isDNF) {
        timeDisplay = 'DNF';
    } else if (penalty === '+2') {
        timeDisplay = `${formatTime(time * 1000)}+`;
    } else {
        timeDisplay = formatTime(time * 1000);
    }

    let phaseTimesHTML = '';
    if (sessions[currentSession].phaseTimes && 
        sessions[currentSession].phaseTimes[index] && 
        typeof sessions[currentSession].phaseTimes[index].cross === 'number' &&
        typeof sessions[currentSession].phaseTimes[index].f2l === 'number' &&
        typeof sessions[currentSession].phaseTimes[index].oll === 'number' &&
        typeof sessions[currentSession].phaseTimes[index].pll === 'number') {
        
        const phaseTimes = sessions[currentSession].phaseTimes[index];
        phaseTimesHTML = `
        <div class="phase-times-details">
            <div class="phase-labels">
                <span>Cross:</span>
                <span>F2L:</span>
                <span>OLL:</span>
                <span>PLL:</span>
            </div>
            <div class="phase-values">
                <span>${phaseTimes.cross.toFixed(2)}</span>
                <span>${phaseTimes.f2l.toFixed(2)}</span>
                <span>${phaseTimes.oll.toFixed(2)}</span>
                <span>${phaseTimes.pll.toFixed(2)}</span>
            </div>
        </div>`;
    }

    popup.innerHTML = `
    <div class="popup-header">
        <button class="retry-button" onclick="retryScramble(${index})" title="Retry">
           <i class="fa-solid fa-repeat"></i>
        </button>
        <span class="detail-popup-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
    </div>
    <div class="popup-content">
        <div class="time-display">
            <h1 class="popup-time">${timeDisplay}</h1>
            ${date ? `<div class="solve-date">${date}</div>` : ''}
            ${phaseTimesHTML}
        </div>
        <div class="scramble-section">
            <h3 class="section-title">Scramble:</h3>
            <p class="scramble-text">${sessions[currentSession].scrambles[index]}</p>
            <div class="scramble-visualization" id="scrambleVisualization_${index}"></div>
        </div>
        <div class="notes-section">
            <h3 class="section-title">Add a Comment:</h3>
            <textarea id="commentBox_${index}" placeholder="Write your comment...">${existingComment}</textarea>
            <div class="popup-actions">
                <div class="popup-buttons">
                    <button class="penalty" onclick="addPenalty(${index})" title="+2">+2</button>
                    <button class="dnf" onclick="markDNF(${index})" title="DNF"><i class="fas fa-ban"></i></button>
                    <button class="delete" onclick="removeSolve(${index}); this.parentElement.parentElement.parentElement.parentElement.parentElement.remove()" title="Delete"><i class="fas fa-trash"></i></button>
                    <button class="ok-btn" onclick="saveAndClose(${index})">OK</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.appendChild(popup);
    
    // Initialize draggable behavior
    makeDraggable(popup);
    
    // Remove the initial transform after a short delay
    setTimeout(() => {
        const rect = popup.getBoundingClientRect();
        popup.style.transform = 'none';
        popup.style.left = rect.left + 'px';
        popup.style.top = rect.top + 'px';
    }, 100);

    const commentBox = document.getElementById(`commentBox_${index}`);
    commentBox.addEventListener('keydown', function (event) {
        event.stopPropagation();
    });

    const scrambleVisualization = document.getElementById(`scrambleVisualization_${index}`);
    const twistyPlayer = document.createElement('twisty-player');
    twistyPlayer.setAttribute('puzzle', getTwistyPuzzleType(currentScrambleType));
    twistyPlayer.setAttribute('alg', sessions[currentSession].scrambles[index]);
    twistyPlayer.setAttribute('visualization', 'PG3D');
    twistyPlayer.setAttribute('background', 'none');
    twistyPlayer.setAttribute('control-panel', 'none');
    twistyPlayer.style.width = '270px';
    twistyPlayer.style.height = '270px';
    twistyPlayer.setAttribute('hint-facelets', 'none');
    scrambleVisualization.appendChild(twistyPlayer);
}


//making elemnts draggable
function makeDraggable(popup) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = popup.querySelector('.popup-header');
    
    if (header) {
        header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Call a function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        popup.style.top = (popup.offsetTop - pos2) + "px";
        popup.style.left = (popup.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function retryScramble(index) {
    const scramble = sessions[currentSession]?.scrambles[index];
    console.log("Retrying scramble:", scramble);

    const scrambleDisplay = document.getElementById('scrambleDisplay');
    if (scrambleDisplay) {
        scrambleDisplay.textContent = scramble;

        const twistyPlayer = document.getElementById('scramble-display-player');
        const currentScrambleType = sessions[currentSession].scrambleType;

        // Update twisty player
        twistyPlayer.setAttribute('puzzle', getTwistyPuzzleType(currentScrambleType));
        twistyPlayer.setAttribute('alg', scramble);

        console.log("Scramble display updated:", scrambleDisplay.textContent);
    } else {
        console.error("Scramble display not found.");
    }

    const popup = document.querySelector('.detail-popup');
    if (popup) {
        popup.remove();
    }
}

function saveComment(index) {
    const commentBox = document.getElementById(`commentBox_${index}`);
    const comment = commentBox.value;
    
    if (!sessions[currentSession].comments) {
        sessions[currentSession].comments = [];
    }
    sessions[currentSession].comments[index] = comment;
    
    if (autoSave) {
        saveSessionsToLocalStorage();
    }
    alert('Comment saved successfully!');
}

function saveAndClose(index) {
    const commentBox = document.getElementById(`commentBox_${index}`);
    const comment = commentBox.value;
    
    if (!sessions[currentSession].comments) {
        sessions[currentSession].comments = [];
    }
    sessions[currentSession].comments[index] = comment;
    
    if (autoSave) {
        saveSessionsToLocalStorage();
    }
    
    // Close popup
    const popup = document.querySelector('.detail-popup');
    if (popup) {
        popup.remove();
    }
}