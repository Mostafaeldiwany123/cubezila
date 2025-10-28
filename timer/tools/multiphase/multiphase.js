// Multiphase Timer Tool Logic
// This file manages phase names, split times, and integration with timer.js

(function() {
    // Default presets
    const PRESETS = {
        cfop: ['Cross', 'F2L', 'OLL', 'PLL'],
        roux: ['First Block', 'Second Block', 'CMLL', 'LSE'],
        bld: ['Memo', 'Execution']
    };

    let phaseNames = [...PRESETS.cfop];
    let splitTimes = [];
    let currentPhase = 0;
    let isActive = false;
    let startTimestamp = null;
    let lastSplitTimestamp = null;
    let totalTime = 0;

    function setPreset(preset) {
        phaseNames = [...(PRESETS[preset] || PRESETS.cfop)];
        reset();
        renderPhases();
        // Show phase list, hide custom settings if present
        const phaseListDiv = document.getElementById('multiphasePhasesList');
        const customDiv = document.getElementById('multiphaseCustomPhases');
        if (phaseListDiv) phaseListDiv.style.display = '';
        if (customDiv) customDiv.style.display = 'none';
    }

    function setCustomPhases(names) {
        phaseNames = [...names];
        reset();
        renderPhases();
        // Hide custom settings, show phase list
        const phaseListDiv = document.getElementById('multiphasePhasesList');
        const customDiv = document.getElementById('multiphaseCustomPhases');
        if (phaseListDiv) phaseListDiv.style.display = '';
        if (customDiv) customDiv.style.display = 'none';
    }

    function reset() {
        splitTimes = [];
        currentPhase = 0;
        isActive = false;
        startTimestamp = null;
        lastSplitTimestamp = null;
        totalTime = 0;
        renderPhases();
    }

    function start() {
        reset();
        isActive = true;
        startTimestamp = Date.now();
        lastSplitTimestamp = startTimestamp;
        renderPhases();
    }

    function split() {
        if (!isActive) return;
        if (currentPhase >= phaseNames.length) return; // Prevent extra split
        const now = Date.now();
        const elapsed = (now - lastSplitTimestamp) / 1000;
        splitTimes.push(elapsed);
        lastSplitTimestamp = now;
        currentPhase++;
        renderPhases();
        // If last phase, auto-finish
        if (currentPhase >= phaseNames.length) {
            finish();
        }
    }

    function finish() {
        if (!isActive) return;
        const now = Date.now();
        totalTime = (now - startTimestamp) / 1000;
        // Fill in remaining phases as 0 if user didn't split enough
        while (splitTimes.length < phaseNames.length) splitTimes.push(0);
        isActive = false;
        renderPhases();
        if (window.onMultiphaseFinish) window.onMultiphaseFinish(getPhaseTimes(), totalTime);
    }

    function getPhaseTimes() {
        return phaseNames.map((name, i) => ({
            phase: name,
            time: splitTimes[i] || 0
        }));
    }

    function renderPhases() {
        const list = document.getElementById('multiphasePhasesList');
        if (!list) return;
        let html = '';
        for (let i = 0; i < phaseNames.length; i++) {
            html += `<div class="multiphase-phase-row">
                <span class="multiphase-phase-label">${phaseNames[i]}</span>
                <span class="multiphase-phase-time">${splitTimes[i] > 0 ? splitTimes[i].toFixed(2) + 's' : '--'}</span>
            </div>`;
        }
        if (!isActive && splitTimes.length) {
            html += `<div class=\"multiphase-total\">Total: <b>${totalTime > 0 ? totalTime.toFixed(2) + 's' : '--'}</b></div>`;
        }
        if (isActive && currentPhase < phaseNames.length) {
            html += `<div class=\"multiphase-instructions\">Click to record split for <b>${phaseNames[currentPhase]}</b></div>`;
        }
        list.innerHTML = html;
    }

    function initUI() {
        renderPhases();
    }

    // Expose API globally for timer.js and tools.js
    window.multiphaseTool = {
        setPreset,
        setCustomPhases,
        reset,
        start,
        split,
        finish,
        getPhaseTimes,
        initUI,
        isActive: () => isActive,
        getCurrentPhase: () => currentPhase,
        getPhaseCount: () => phaseNames.length
    };
})();
