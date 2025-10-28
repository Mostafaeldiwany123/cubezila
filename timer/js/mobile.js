// Define history elements reference
const historyElements = {
    '.left-panel': 'block',
    '.history-scroll': 'block',
    '.history-list': 'flex'
};

function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.mobile-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to selected tab
    document.querySelector(`.mobile-tab[data-tab="${tabName}"]`).classList.add('active');

    // Array of timer-only elements
    const timerElements = {
        '.scramble-display': 'block',
        '.scramble-icons': 'flex',
        '.cube-display': 'block',
        '.timer-display': 'block',
        '.mobile-actions': 'flex',
        '.mobile-mini-stats': 'flex', // Changed from 'block' to 'flex'
        '.scramble-visualization-box': 'block',
        '#inspectionDisplay': 'block',
    };

    // Handle history tab visibility
    if (tabName === 'history') {
        // Hide timer elements
        Object.keys(timerElements).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = 'none';
        });

        // Reset mobile stats layout
        const mobileStats = document.querySelector('.mobile-mini-stats');
        if (mobileStats) {
            mobileStats.style.display = 'none';
        }

        // Hide header and summary, show only list
        const leftPanel = document.querySelector('.left-panel');
        const historyHeader = document.querySelector('.history-header');
        const historySummary = document.querySelector('.history-summary');
        const historyScroll = document.querySelector('.history-scroll');
        const historyList = document.querySelector('.history-list');

        if (leftPanel) {
            leftPanel.style.display = 'block';
            leftPanel.style.position = 'fixed';
            leftPanel.style.width = '100%';
            leftPanel.style.height = 'calc(100vh - 6vh)';
            leftPanel.style.background = 'none';
            leftPanel.style.transform = 'none';
            leftPanel.style.padding = '70px 0 0 0'; // Add top padding for spacing
        }

        if (historyHeader) historyHeader.style.display = 'none';
        if (historySummary) historySummary.style.display = 'none';
        if (historyScroll) {
            historyScroll.style.display = 'block';
            historyScroll.style.height = 'calc(100vh - 6vh)';
            historyScroll.style.overflowY = 'auto';
            historyScroll.style.width = '100%'; // Add full width
        }
        if (historyList) {
            historyList.style.display = historyList.classList.contains('compact-grid') ? 'grid' : 'flex';
            if (historyList.classList.contains('compact-grid')) {
                historyList.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }
        }
    } else if (tabName === 'timer') {
        // Show timer elements with their original display values
        for (const [selector, displayValue] of Object.entries(timerElements)) {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = displayValue;
            }
        }

        // Ensure mobile stats are properly laid out
        const mobileStats = document.querySelector('.mobile-mini-stats');
        if (mobileStats) {
            mobileStats.style.display = 'flex';
            mobileStats.style.justifyContent = 'space-between';
            
            const leftStats = mobileStats.querySelector('.mobile-mini-stats-left');
            const rightStats = mobileStats.querySelector('.mobile-mini-stats-right');
            
            if (leftStats) {
                leftStats.style.display = 'flex';
                leftStats.style.flexDirection = 'column';
            }
            
            if (rightStats) {
                rightStats.style.display = 'flex';
                rightStats.style.flexDirection = 'column';
            }
        }

        // Hide history elements
        Object.keys(historyElements).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
                if (selector === '.left-panel') {
                    element.style.position = '';
                    element.style.width = '';
                    element.style.height = '';
                    element.style.transform = '';
                }
            }
        });
    }
}

// Initialize mobile tabs
document.addEventListener('DOMContentLoaded', () => {
    // Set timer tab as active by default
    document.querySelector('.mobile-tab[data-tab="timer"]')?.classList.add('active');
    document.body.classList.add('mobile-view-active');

    // Set compact mode as default on mobile
    if (window.innerWidth <= 1024) {
        const historyList = document.getElementById('historyList');
        if (historyList) {
            historyList.classList.add('compact-grid');
            document.getElementById('historyLayout').value = 'compact';
            // Save the setting
            settingsUI.historyLayout = 'compact';
            localStorage.setItem('settings-ui', JSON.stringify(settingsUI));
        }
    }

    let longPressTimer;
    let isLongPress = false;
    let touchStartY = 0;
    let isSwiping = false;

    // Add long press handling for compact mode
    document.querySelector('.history-list').addEventListener('touchstart', e => {
        if (!e.target.closest('.history-list.compact-grid li')) return;
        
        touchStartY = e.touches[0].clientY;
        isLongPress = false;
        isSwiping = false;
        
        longPressTimer = setTimeout(() => {
            if (!isSwiping) {
                isLongPress = true;
                const solve = e.target.closest('li');
                const solveIndex = parseInt(solve.querySelector('.solve-number').textContent.slice(1)) - 1;
                showActionSheet(solveIndex);
            }
        }, 500);
    });

    document.querySelector('.history-list').addEventListener('touchmove', e => {
        const touchDiffY = Math.abs(e.touches[0].clientY - touchStartY);
        if (touchDiffY > 10) { // If scrolled more than 10px
            isSwiping = true;
            clearTimeout(longPressTimer);
        }
    });

    document.querySelector('.history-list').addEventListener('touchend', e => {
        clearTimeout(longPressTimer);
        const solve = e.target.closest('.history-list.compact-grid li');
        if (!isLongPress && !isSwiping && solve) {
            const solveIndex = parseInt(solve.querySelector('.solve-number').textContent.slice(1)) - 1;
            showDetails(solveIndex);
        }
    });
});

function showActionSheet(solveIndex) {
    // Create action sheet container
    const actionSheet = document.createElement('div');
    actionSheet.className = 'mobile-action-sheet';
    
    actionSheet.innerHTML = `
        <div class="action-sheet-options">
            <button class="action-delete">Delete Solve</button>
            <button class="action-clear">Clear All Solves</button>
            <button class="action-cancel">Cancel</button>
        </div>
    `;

    // Add event listeners
    actionSheet.querySelector('.action-delete').onclick = () => {
        removeSolve(solveIndex);
        actionSheet.remove();
    };

    actionSheet.querySelector('.action-clear').onclick = () => {
        resetHistory();
        actionSheet.remove();
    };

    actionSheet.querySelector('.action-cancel').onclick = () => {
        actionSheet.remove();
    };

    // Add click outside to dismiss
    actionSheet.onclick = e => {
        if (e.target === actionSheet) actionSheet.remove();
    };

    document.body.appendChild(actionSheet);
    
    // Animate in
    requestAnimationFrame(() => {
        actionSheet.classList.add('active');
    });
}

function handleMobileAction(action) {
    if (isRunning) return; // Don't allow actions while timer is running
    
    const lastIndex = sessions[currentSession].times.length - 1;
    if (lastIndex < 0) return;

    switch(action) {
        case '+2':
            addPenalty(lastIndex);
            break;
        case 'DNF':
            markDNF(lastIndex);
            break;
        case 'remove':
            if (confirm('Are you sure you want to remove this solve?')) {
                removeSolve(lastIndex);
            }
            break;
    }

    // Update displays
    updateHistory();
    updateStatistics();
    updateTimerDisplay();
    
    // Save if auto-save is enabled
    if (autoSave) saveSessionsToLocalStorage();
}