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
        // Ortega OLL Progress
        const ortollProgress = localStorage.getItem('ortoll_PRACTICE_TOOL_pllCasesProgress');
        if (ortollProgress) {
            try {
                const progressArray = JSON.parse(ortollProgress);
                updateCardProgress('ort-oll', progressArray, 7);
            } catch (error) {
                console.error('Error parsing Ortega OLL progress:', error);
            }
        }

        // PBL Progress
        const pblProgress = localStorage.getItem('ortpbl_PRACTICE_TOOL_pllCasesProgress');
        if (pblProgress) {
            try {
                const progressArray = JSON.parse(pblProgress);
                updateCardProgress('pbl', progressArray, 6);
            } catch (error) {
                console.error('Error parsing PBL progress:', error);
            }
        }

        // CLL Progress
        const cllProgress = localStorage.getItem('ortcll_PRACTICE_TOOL_pllCasesProgress');
        if (cllProgress) {
            try {
                const progressArray = JSON.parse(cllProgress);
                updateCardProgress('cll', progressArray, 42);
            } catch (error) {
                console.error('Error parsing CLL progress:', error);
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

function handleCLLAccess(event) {
    event.preventDefault();
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userRef = firebase.database().ref('users/' + user.uid);
                const snapshot = await userRef.once('value');
                const userData = snapshot.val();
                
                if (userData && (userData.role === 'pro_user' || userData.role === 'admin')) {
                    window.location.href = 'ortcll';
                } else {
                    alert('CLL algorithms are only available for Pro users. Please upgrade to access.');
                    window.location.href = '../pricing/pricing';
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                alert('An error occurred while checking access permissions.');
            }
        } else {
            alert('Please login and upgrade to Pro to access CLL algorithms.');
        }
    });
}