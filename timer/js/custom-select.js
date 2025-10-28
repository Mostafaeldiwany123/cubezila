document.addEventListener('DOMContentLoaded', function() {
    const puzzleIcons = {
        '2x2': 'event-222',
        '3x3': 'event-333',
        '4x4': 'event-444',
        '5x5': 'event-555',
        '6x6': 'event-666',
        '7x7': 'event-777',
        'pyra': 'event-pyram',
        'pyraminx': 'event-pyram',
        'skewb': 'event-skewb',
        'sq1': 'event-sq1',
        'square-1': 'event-sq1',
        'square1': 'event-sq1',
        'clock': 'event-clock',
        'mega': 'event-minx',
        'megaminx': 'event-minx',
        'oh': 'event-333oh',
        'onehanded': 'event-333oh',
        'blind': 'event-333bf',
        'bld': 'event-333bf',
        'blindfolded': 'event-333bf',
        'fmc': 'event-333fm',
        'feet': 'event-333ft',
        '4bld': 'event-444bf',
        '5bld': 'event-555bf',
        'mbld': 'event-333mbf'
    };

    function getIconForSession(sessionName) {
        const name = sessionName.toLowerCase();
        for (const [keyword, iconClass] of Object.entries(puzzleIcons)) {
            if (name.includes(keyword)) {
                return `cubing-icon ${iconClass}`;
            }
        }
        return 'cubing-icon event-333'; // Default to 3x3 icon
    }

    const select = document.getElementById('sessionSelector');
    const container = document.querySelector('.session-selector-container');
    const trigger = container.querySelector('.session-dropdown-trigger');
    
    // Create menu container
    const menu = document.createElement('div');
    menu.className = 'session-menu';
    container.appendChild(menu);

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'session-backdrop';
    container.appendChild(backdrop);

    function toggleMenu() {
        menu.classList.toggle('active');
        trigger.classList.toggle('active');
        backdrop.classList.toggle('active');
        
        if (menu.classList.contains('active')) {
            updateMenuOptions();
        }
    }

    function updateMenuOptions() {
        // Add search and new session section at the top
        menu.innerHTML = `
            <div class="session-menu-header">
                <div class="search-container">
                    <input type="text" id="sessionSearch" placeholder="Search sessions...">
                </div>
                <button class="new-session-btn">
                    <i class="fas fa-plus"></i>
                    New Session
                </button>
            </div>
            <div class="menu-handle"></div>
        `;

        // Create sessions container
        const sessionsContainer = document.createElement('div');
        sessionsContainer.className = 'sessions-container';
        menu.appendChild(sessionsContainer);

        // Add session options
        Array.from(select.options).forEach((option, index) => {
            const sessionOption = document.createElement('div');
            sessionOption.className = 'session-option';
            sessionOption.style.animation = `sessionOptionEntrance 0.4s ease ${index * 0.1}s forwards`;
            
            // Create main content wrapper
            const content = document.createElement('div');
            content.className = 'session-option-content';
            content.innerHTML = `
                <i class="${getIconForSession(option.value)}"></i>
                <span>${option.textContent}</span>
            `;
            
            // Add click event to entire session option instead of just content
            sessionOption.addEventListener('click', (e) => {
                // Only trigger if not clicking action buttons
                if (!e.target.closest('.session-option-actions')) {
                    select.value = option.value;
                    trigger.innerHTML = `
                        <div class="trigger-flex">
                            <div class="trigger-main">
                                <i class="${getIconForSession(option.value)}"></i>
                                <span class="selected-session">${option.value}</span>
                            </div>
                            <div class="chevron-icon">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    `;
                    toggleMenu();
                    // Trigger change event and explicitly call changeSession
                    select.dispatchEvent(new Event('change'));
                    if (typeof changeSession === 'function') {
                        changeSession();
                    }
                }
            });
            
            // Create action buttons wrapper
            const actions = document.createElement('div');
            actions.className = 'session-option-actions';
            
            // Only add rename/delete buttons if not the default "3x3" session
            if (option.value.toLowerCase() !== '3x3') {
                actions.innerHTML = `
                    <button class="rename-btn" title="Rename Session">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="Delete Session">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
            }
            
            sessionOption.appendChild(content);
            sessionOption.appendChild(actions);
            
            // Event listeners
            content.addEventListener('click', () => {
                select.value = option.value;
                trigger.innerHTML = `
                    <div class="trigger-flex">
                        <div class="trigger-main">
                            <i class="${getIconForSession(option.value)}"></i>
                            <span class="selected-session">${option.value}</span>
                        </div>
                        <div class="chevron-icon">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                `;
                toggleMenu();
                select.dispatchEvent(new Event('change'));
            });
            
            // Add rename and delete functionality
            const renameBtn = actions.querySelector('.rename-btn');
            const deleteBtn = actions.querySelector('.delete-btn');
            
            if (renameBtn) {
                renameBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Call renameSession with current session name
                    renameSession(option.value);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Do not show confirmation here, just call deleteSession with the specific session
                    deleteSession(option.value);
                });
            }
            
            sessionsContainer.appendChild(sessionOption);
        });

        // Add search functionality
        const searchInput = document.getElementById('sessionSearch');
        searchInput.addEventListener('input', (e) => {
            const searchValue = e.target.value.toLowerCase();
            const sessionOptions = sessionsContainer.querySelectorAll('.session-option');
            
            sessionOptions.forEach(option => {
                const sessionName = option.querySelector('span').textContent.toLowerCase();
                option.style.display = sessionName.includes(searchValue) ? 'flex' : 'none';
            });
        });

        // Add new session button functionality
        const newSessionBtn = menu.querySelector('.new-session-btn');
        newSessionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            createNewSessionPopup();
        });
    }

    function updateTrigger() {
        trigger.innerHTML = `
            <div class="trigger-flex">
                <div class="trigger-main">
                    <i class="${getIconForSession(select.value)}"></i>
                    <span class="selected-session">${select.value}</span>
                </div>
                <div class="chevron-icon">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
        `;
    }

    let isPopupOpen = false; // Add this flag at the top

    function createNewSessionPopup() {
        // If popup is already open, close it and return
        if (isPopupOpen) {
            const existingPopup = document.querySelector('.new-session-popup');
            const existingBackdrop = document.querySelector('.new-session-backdrop');
            if (existingPopup && existingBackdrop) {
                existingPopup.classList.remove('active');
                existingBackdrop.classList.remove('active');
                setTimeout(() => {
                    existingPopup.remove();
                    existingBackdrop.remove();
                    isPopupOpen = false;
                }, 300);
            }
            return;
        }

        const backdrop = document.createElement('div');
        backdrop.className = 'new-session-backdrop';
        
        const popup = document.createElement('div');
        popup.className = 'new-session-popup';
        
        const cubeTypes = [
            { id: '222', name: '2x2', icon: 'event-222' },
            { id: '333', name: '3x3', icon: 'event-333' },
            { id: '444', name: '4x4', icon: 'event-444' },
            { id: '555', name: '5x5', icon: 'event-555' },
            { id: '666', name: '6x6', icon: 'event-666' },
            { id: '777', name: '7x7', icon: 'event-777' },
            { id: 'pyraminx', name: 'Pyraminx', icon: 'event-pyram' },
            { id: 'skewb', name: 'Skewb', icon: 'event-skewb' },
            { id: 'clock', name: 'Clock', icon: 'event-clock' },
            { id: 'megaminx', name: 'Megaminx', icon: 'event-minx' },
            { id: 'square1', name: 'Square-1', icon: 'event-sq1' },
            { id: '333oh', name: 'One-Handed', icon: 'event-333oh' },
            { id: '333bf', name: 'Blindfolded', icon: 'event-333bf' }
        ];

        popup.innerHTML = `
            <h3>Create New Session</h3>
            <div class="cube-grid">
                ${cubeTypes.map(cube => `
                    <div class="cube-option" data-type="${cube.id}">
                        <i class="cubing-icon ${cube.icon}"></i>
                        <span>${cube.name}</span>
                    </div>
                `).join('')}
            </div>
            <input type="text" class="session-name-input" placeholder="Session name" autocomplete="off">
            <div class="session-suggestion"></div>
            <div class="session-popup-buttons">
                <button class="session-popup-button popup-cancel">Cancel</button>
                <button class="session-popup-button popup-create">Create</button>
            </div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(popup);
        isPopupOpen = true;

        // Show popup with animation
        requestAnimationFrame(() => {
            backdrop.classList.add('active');
            popup.classList.add('active');
        });

        // Handle cube selection
        let selectedType = null;
        const cubeOptions = popup.querySelectorAll('.cube-option');
        cubeOptions.forEach(option => {
            option.addEventListener('click', () => {
                cubeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedType = option.dataset.type;
                const input = popup.querySelector('.session-name-input');
                input.value = option.querySelector('span').textContent;
                handleSessionInputAutocomplete({ target: input });
            });
        });

        // Handle input suggestions
        const input = popup.querySelector('.session-name-input');
        const suggestionDiv = popup.querySelector('.session-suggestion');
        
        input.addEventListener('input', (e) => {
            handleSessionInputAutocomplete(e, suggestionDiv);
        });

        input.addEventListener('keydown', (e) => {
            handleTabCompletion(e, suggestionDiv);
        });

        // Handle buttons
        const closePopup = () => {
            backdrop.classList.remove('active');
            popup.classList.remove('active');
            setTimeout(() => {
                backdrop.remove();
                popup.remove();
                isPopupOpen = false;
            }, 300);
        };

        popup.querySelector('.popup-cancel').onclick = closePopup;
        backdrop.onclick = closePopup;

        popup.querySelector('.popup-create').onclick = () => {
            const sessionName = input.value.trim();
            if (sessionName) {
                let input = document.getElementById('newSessionName');
                if (!input) {
                    input = document.createElement('input');
                    input.style.display = 'none';
                    document.body.appendChild(input);
                }
                input.value = sessionName;
                createNewSession();
                closePopup();
                toggleMenu(); // Close the session menu
            }
        };
    }

    // Event listeners
    trigger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Update menu when select options change
    const observer = new MutationObserver(updateMenuOptions);
    observer.observe(select, { childList: true });

    // Update trigger when select value changes
    select.addEventListener('change', updateTrigger);

    // Add this helper function near the top of the file
    function updateSessionTrigger(sessionName) {
        const trigger = document.querySelector('.session-dropdown-trigger');
        if (trigger) {
            trigger.innerHTML = `
                <div class="trigger-flex">
                    <div class="trigger-main">
                        <i class="${getIconForSession(sessionName)}"></i>
                        <span class="selected-session">${sessionName}</span>
                    </div>
                    <div class="chevron-icon">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
            `;
        }
    }

    // Add this observer to watch for session changes
    const sessionSelector = document.getElementById('sessionSelector');
    if (sessionSelector) {
        // Update trigger immediately if there's a saved session
        const savedSession = localStorage.getItem('currentTimerSession');
        if (savedSession && sessions[savedSession]) {
            updateSessionTrigger(savedSession);
        }
        
        // Watch for future changes
        sessionSelector.addEventListener('change', () => {
            updateSessionTrigger(sessionSelector.value);
        });
    }

    // Make functions globally available
    window.getIconForSession = getIconForSession;
    window.updateSessionTrigger = updateSessionTrigger;
});
