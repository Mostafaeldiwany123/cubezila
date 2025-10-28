// Styles for the popup and navigation (if needed for consistency)
const STYLES = `
    .how-to-use-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--container-bg);
        color: var(--text-color);
        padding: 20px;
        border-radius: var(--border-radius);
        max-width: min(800px, 90vw);
        max-height: 85vh;
        overflow-y: auto;
        z-index: 100000;
        box-shadow: var(--box-shadow);
    }

    .how-to-use-popup h2 {
        color: var(--primary-color);
        margin-bottom: 15px;
    }

    .how-to-use-popup section {
        margin-bottom: 20px;
        padding: 15px;
        background: var(--highlight-bg);
        border-radius: var(--border-radius);
        border: 1px solid var(--border-color);
    }

    .how-to-use-popup h3 {
        color: var(--accent-color);
        margin-bottom: 10px;
    }

    .how-to-use-popup table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
    }

    .how-to-use-popup th,
    .how-to-use-popup td {
        padding: 8px;
        border: 1px solid var(--border-color);
    }

    .how-to-use-popup code {
        background: var(--highlight-bg);
        padding: 2px 5px;
        border-radius: 3px;
        font-family: monospace;
    }

    .how-to-use-popup .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 24px;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .how-to-use-popup {
            padding: 15px;
            max-height: 80vh;
            width: 95vw;
        }

        .how-to-use-popup h2 {
            font-size: 1.5em;
        }

        .how-to-use-popup h3 {
            font-size: 1.2em;
        }

        .how-to-use-popup table {
            font-size: 0.9em;
        }

        .how-to-use-popup code {
            font-size: 0.9em;
            padding: 1px 3px;
        }

        .how-to-use-popup .close-btn {
            padding: 10px;
            font-size: 24px;
        }
    }

    @media (max-width: 480px) {
        .how-to-use-popup {
            padding: 10px;
        }

        .how-to-use-popup table td {
            padding: 6px;
            font-size: 0.85em;
        }

        .how-to-use-popup section {
            padding: 10px;
            margin-bottom: 15px;
        }
    }

    .how-to-use-popup::-webkit-scrollbar {
        width: 8px;
    }

    .how-to-use-popup::-webkit-scrollbar-track {
        background: var(--highlight-bg);
        border-radius: 4px;
    }

    .how-to-use-popup::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 4px;
    }

    .how-to-use-popup::-webkit-scrollbar-thumb:hover {
        background: var(--primary-color);
    }
`;

// Inject the styles into the document head
(function injectStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = STYLES;
    document.head.appendChild(styleSheet);
})();

// Function to show the "How to Use" popup
function showHowToUse() {
    const popup = document.createElement('div');
    popup.className = 'how-to-use-popup';
    popup.innerHTML = `
        <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
        <h2>How to Use the Timer</h2>

        <section>
            <h3>Basic Controls</h3>
            <ul>
                <li>Press <code>Space</code> to start/stop the timer</li>
                <li>Press <code>I</code> to open the details of the last solve</li>
                <li>Press <code>Ctrl + Ctrl / Shift + Shift</code> for alternative start/stop</li>
            </ul>
        </section>

        <section>
            <h3>Session Commands</h3>
            <table>
                <tr><td><code>type</code></td><td>Enter manual time input mode</td></tr>
                <tr><td><code>delete</code></td><td>Delete current session</td></tr>
                <tr><td><code>rename</code></td><td>Rename current session</td></tr>
            </table>
        </section>

        <section>
            <h3>Quick Session Creation</h3>
            <table>
                <tr><td><code>2-7</code></td><td>Create 2x2-7x7 sessions</td></tr>
                <tr><td><code>o</code></td><td>Create One-Handed session</td></tr>
                <tr><td><code>b</code></td><td>Create Blindfolded session</td></tr>
                <tr><td><code>p</code></td><td>Create Pyraminx session</td></tr>
                <tr><td><code>s</code></td><td>Create Skewb session</td></tr>
                <tr><td><code>m</code></td><td>Create Megaminx session</td></tr>
            </table>
        </section>

        <section>
            <h3>Solve Actions</h3>
            <table>
                <tr><td><code>2</code></td><td>Add +2 penalty to last solve</td></tr>
                <tr><td><code>D</code></td><td>Mark last solve as DNF</td></tr>
                <tr><td><code>P</code></td><td>Remove last solve</td></tr>
                <tr><td><code>R</code></td><td>Reset session history</td></tr>
                <tr><td><code>Ctrl/⌘ + Z</code></td><td>Undo last removal</td></tr>
            </table>
        </section>

        <section>
            <h3>Time Input Format</h3>
            <table>
                <tr><td><code>12.34</code></td><td>Enter 12.34 seconds</td></tr>
                <tr><td><code>1:23.45</code></td><td>Enter 1 minute 23.45 seconds</td></tr>
                <tr><td><code>12.34+</code></td><td>Enter 12.34 seconds with +2</td></tr>
                <tr><td><code>DNF</code></td><td>Enter DNF result</td></tr>
            </table>
        </section>

        <section>
            <h3>Pro Features</h3>
            <ul>
                <li>Custom inspection time settings</li>
                <li>Multi-phase timing</li>
                <li>Additional voice options</li>
                <li>Advanced statistics</li>
            </ul>
        </section>

        <section>
            <h3>Tips</h3>
            <ul>
                <li>Click the cube display to switch between 2D and 3D views</li>
                <li>Use the mobile action buttons for quick penalties on touch devices</li>
                <li>Enable auto-save to keep your times safe</li>
                <li>Export your times regularly for backup</li>
            </ul>
        </section>
    `;
    document.body.appendChild(popup);
    // makeDraggable should be defined elsewhere to enable dragging the popup
    if (typeof makeDraggable === 'function') {
        makeDraggable(popup);
    }
}

// Make the showHowToUse function globally accessible
window.showHowToUse = showHowToUse;
