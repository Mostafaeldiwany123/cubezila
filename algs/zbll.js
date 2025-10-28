// ZBLL subsets configuration
const zbllSubsets = {
    T: {
        name: 'T',
        image: '../img/zbll-t.png',
        subgroups: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']
    },
    U: {
        name: 'U',
        image: '../img/zbll-u.png',
        subgroups: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6']
    },
    L: {
        name: 'L',
        image: '../img/zbll-l.png',
        subgroups: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6']
    },
    H: {
        name: 'H',
        image: '../img/zbll-h.png',
        subgroups: ['H1', 'H2', 'H3', 'H4']
    },
    Pi: {
        name: 'Pi',
        image: '../img/zbll-pi.png',
        subgroups: ['Pi1', 'Pi2', 'Pi3', 'Pi4', 'Pi5', 'Pi6']
    },
    S: {
        name: 'S',
        image: '../img/zbll-s.png',
        subgroups: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
    },
    AS: {
        name: 'AS',
        image: '../img/zbll-as.png',
        subgroups: ['AS1', 'AS2', 'AS3', 'AS4', 'AS5', 'AS6']
    }
};

let currentSubset = null;
let currentSubgroup = null;

function generateSubsetsContainer() {
    const container = document.createElement('div');
    container.className = 'zbll-subsets-container';

    const mainSubsets = document.createElement('div');
    mainSubsets.className = 'main-subsets';
    
    Object.entries(zbllSubsets).forEach(([key, subset]) => {
        const subsetBox = createSubsetBox(subset);
        mainSubsets.appendChild(subsetBox);
    });

    const subgroupContainer = document.createElement('div');
    subgroupContainer.className = 'subgroup-container';
    subgroupContainer.style.display = 'none';

    container.appendChild(mainSubsets);
    container.appendChild(subgroupContainer);

    // Insert after progress container
    const progressContainer = document.querySelector('.progress-container');
    progressContainer.parentNode.insertBefore(container, progressContainer.nextSibling);
}

function createSubsetBox(subset) {
    const box = document.createElement('div');
    box.className = 'subset-box';
    
    const stats = calculateSubsetStats(subset.name);
    
    const svgContainer = document.createElement('div');
    svgContainer.className = 'subset-image';
    
    const firstCase = pllCases.find(c => c.name === `${subset.subgroups[0]} (1)`);
    
    box.innerHTML = `
        <div class="subset-content">
            <h3>${subset.name}</h3>
            <p>${stats.learned}/${stats.total} learned</p>
        </div>
    `;
    
    box.insertBefore(svgContainer, box.firstChild);
    
    if (firstCase) {
        puzzleGen.PNG(svgContainer, 'cube-top', {
            puzzle: {
                alg: firstCase.scramble,
                mask: puzzleGen.Masks.CUBE_3.OLL
            }
        });
    }

    box.addEventListener('click', () => showSubgroups(subset));
    
    return box;
}

function calculateSubsetStats(subsetName) {
    const subset = zbllSubsets[subsetName];
    let total = 0;
    let learned = 0;

    // Count total cases and learned cases for each subgroup in this subset
    subset.subgroups.forEach(subgroup => {
        pllCases.forEach(caseData => {
            if (caseData.name.startsWith(subgroup)) {
                total++;
                if (caseData.learned) learned++;
            }
        });
    });

    return { learned, total };
}

function showSubgroups(subset) {
    // First, filter the main table to show only cases from this subset
    const rows = document.querySelectorAll('#pllTable tbody tr');
    rows.forEach(row => {
        const caseName = row.querySelector('td:first-child').textContent;
        const belongsToSubset = subset.subgroups.some(subgroup => 
            caseName.startsWith(subgroup)
        );
        row.style.display = belongsToSubset ? '' : 'none';
    });

    currentSubset = subset.name;
    const container = document.querySelector('.subgroup-container');
    container.style.display = 'grid';
    container.innerHTML = '';

    subset.subgroups.forEach(subgroup => {
        const stats = calculateSubgroupStats(subgroup);
        const box = document.createElement('div');
        box.className = 'subgroup-box';
        
        // Find first case and use its scramble
        const firstCase = pllCases.find(c => c.name === `${subgroup} (1)`);
        const svgContainer = document.createElement('div');
        svgContainer.className = 'subgroup-image';
        
        box.innerHTML = `
            <div class="subgroup-content">
                <h4>${subgroup}</h4>
                <p>${stats.learned}/${stats.total} learned</p>
            </div>
        `;
        box.insertBefore(svgContainer, box.firstChild);
        
        if (firstCase) {
            puzzleGen.PNG(svgContainer, 'cube-top', {
                puzzle: {
                    alg: firstCase.scramble,  // Use scramble instead of algorithm
                    mask: puzzleGen.Masks.CUBE_3.PLL
                }
            });
        }

        box.addEventListener('click', () => {
            document.querySelectorAll('.subgroup-box').forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            filterCasesBySubgroup(subgroup);
        });
        container.appendChild(box);
    });

    // Add back button
    const backBtn = document.createElement('button');
    backBtn.className = 'back-button';
    backBtn.textContent = 'Back to all subsets';
    backBtn.addEventListener('click', hideSubgroups);
    container.parentNode.insertBefore(backBtn, container);

    // Hide main subsets
    document.querySelector('.main-subsets').style.display = 'none';
}

function hideSubgroups() {
    currentSubset = null;
    currentSubgroup = null;
    document.querySelector('.main-subsets').style.display = 'grid';
    document.querySelector('.subgroup-container').style.display = 'none';
    document.querySelector('.back-button')?.remove();
    showAllCases();
}

function calculateSubgroupStats(subgroup) {
    let total = 0;
    let learned = 0;

    pllCases.forEach(caseData => {
        if (caseData.name.startsWith(subgroup)) {
            total++;
            if (caseData.learned) learned++;
        }
    });

    return { learned, total };
}

function filterCasesBySubgroup(subgroup) {
    currentSubgroup = subgroup;
    const rows = document.querySelectorAll('#pllTable tbody tr');
    rows.forEach(row => {
        const caseName = row.querySelector('td:first-child').textContent;
        if (caseName.startsWith(subgroup)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showAllCases() {
    const rows = document.querySelectorAll('#pllTable tbody tr');
    rows.forEach(row => row.style.display = '');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure proper viewport height for mobile
    
    generateSubsetsContainer();
});
