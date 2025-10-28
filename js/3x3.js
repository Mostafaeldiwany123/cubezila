document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const algSections = document.querySelectorAll('.alg-section');

    function setActiveTab(tabId) {
        navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        algSections.forEach(section => section.classList.toggle('active', section.id === tabId));
    }

    document.querySelector('.alg-nav').addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-btn')) {
            setActiveTab(e.target.dataset.tab);
        }
    });

    function updateAllProgress() {
        // F2L Progress
        const f2lProgress = localStorage.getItem('1F2L_PRACTICE_TOOL_pllCasesProgress');
        if (f2lProgress) {
            try {
                const progressArray = JSON.parse(f2lProgress);
                updateCardProgress('f2l', progressArray, 41);
            } catch (error) {
                console.error('Error parsing F2L progress:', error);
            }
        }

        // 2-Look OLL Progress
        const twoLookOLLProgress = localStorage.getItem('2OLL_PRACTICE_TOOL_pllCasesProgress');
        if (twoLookOLLProgress) {
            try {
                const progressArray = JSON.parse(twoLookOLLProgress);
                updateCardProgress('2lookoll', progressArray, 10);
            } catch (error) {
                console.error('Error parsing 2-Look OLL progress:', error);
            }
        }

        // 1-Look OLL Progress
        const oneLookOLLProgress = localStorage.getItem('1OLL_PRACTICE_TOOL_pllCasesProgress');
        if (oneLookOLLProgress) {
            try {
                const progressArray = JSON.parse(oneLookOLLProgress);
                updateCardProgress('1lookoll', progressArray, 57);
            } catch (error) {
                console.error('Error parsing 1-Look OLL progress:', error);
            }
        }

        // 2-Look PLL Progress
        const twoLookPLLProgress = localStorage.getItem('2PLL_PRACTICE_TOOL_pllCasesProgress');
        if (twoLookPLLProgress) {
            try {
                const progressArray = JSON.parse(twoLookPLLProgress);
                updateCardProgress('2lookpll', progressArray, 6);
            } catch (error) {
                console.error('Error parsing 2-Look PLL progress:', error);
            }
        }

        // 1-Look PLL Progress
        const pllProgressData = localStorage.getItem('1PLL_PRACTICE_TOOL_pllCasesProgress');
        if (pllProgressData) {
            try {
                const progressArray = JSON.parse(pllProgressData);
                updateCardProgress('1lookpll', progressArray, 21);
            } catch (error) {
                console.error('Error parsing 1-Look PLL progress:', error);
            }
        }

        // ZBLL Progress
        const zbllProgress = localStorage.getItem('zbllpllCasesProgress');
        if (zbllProgress) {
            try {
                const progressArray = JSON.parse(zbllProgress);
                updateCardProgress('zbll', progressArray, 472);
            } catch (error) {
                console.error('Error parsing ZBLL progress:', error);
            }
        }

        // ZBLS Progress
        const zblsProgress = localStorage.getItem('zblspllCasesProgress');
        if (zblsProgress) {
            try {
                const progressArray = JSON.parse(zblsProgress);
                updateCardProgress('zbls', progressArray, 302);
            } catch (error) {
                console.error('Error parsing ZBLS progress:', error);
            }
        }
    }

    function updateCardProgress(cardType, progressArray, total) {
        const learned = progressArray.filter(item => item.learned).length;
        const percentage = (learned / total) * 100;
        
        const card = document.querySelector(`[data-alg-type="${cardType}"]`);
        if (card) {
            const progressBar = card.querySelector('.progress');
            const progressText = card.querySelector('.progress-text');
            
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${learned}/${total} learned`;
        }
    }

    // Call initially
    updateAllProgress();

    // Update progress every second to keep it in sync
    setInterval(updateAllProgress, 1000);
});
