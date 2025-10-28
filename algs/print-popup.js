// Print SVGs/PNGs Modal Logic for 1lookoll
// Assumes: window.cases, window.currentColorScheme, window.colorSchemes, window.puzzleGen, window.generatePuzzleImage

// Dynamically load html2canvas and JSZip if not present
function loadScript(url) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src='${url}']`)) return resolve();
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

const printPopup = document.getElementById('print-popup');
const printSVGsBtn = document.getElementById('printSVGsBtn');
const printPNGsBtn = document.getElementById('printPNGsBtn');
const printFontSelect = document.getElementById('printFontSelect');
const printTextColor = document.getElementById('printTextColor');
const printPreviewGrid = document.getElementById('print-preview-grid');
const printLayoutSelect = document.getElementById('printLayoutSelect');

let printPreviewOrder = [];
let printLayout = printLayoutSelect ? printLayoutSelect.value : 'svg-left';

// Add font size control for algorithm
let printAlgFontSize = 20;
const printControls = document.querySelector('.print-controls');
if (printControls && !document.getElementById('printAlgFontSize')) {
    const fontSizeLabel = document.createElement('label');
    fontSizeLabel.textContent = 'Alg Font Size:';
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'number';
    fontSizeInput.id = 'printAlgFontSize';
    fontSizeInput.value = printAlgFontSize;
    fontSizeInput.min = 10;
    fontSizeInput.max = 60;
    fontSizeInput.style.width = '60px';
    fontSizeInput.style.marginLeft = '8px';
    fontSizeInput.oninput = function() {
        printAlgFontSize = parseInt(fontSizeInput.value, 10) || 20;
        applyPrintStyles();
    };
    fontSizeLabel.appendChild(fontSizeInput);
    printControls.appendChild(fontSizeLabel);
}

function openPrintPopup() {
    printPopup.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderPrintPreview();
}

function closePrintPopup() {
    printPopup.classList.remove('open');
    document.body.style.overflow = '';
}

if (printSVGsBtn) printSVGsBtn.onclick = openPrintPopup;
window.closePrintPopup = closePrintPopup;

function renderPrintPreview() {
    printPreviewGrid.innerHTML = '';
    if (printPreviewOrder.length !== cases.length) {
        printPreviewOrder = cases.map((_, i) => i);
    }
    printPreviewOrder.forEach((i) => {
        const caseData = cases[i];
        const card = document.createElement('div');
        card.className = 'print-preview-card';
        card.draggable = true;
        card.dataset.index = i;
        card.style.display = 'flex';
        card.style.flexDirection = 'row';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'flex-start';
        card.style.gap = '24px';
        card.style.background = 'none';
        card.style.border = 'none';
        card.style.boxShadow = 'none';
        card.style.padding = '0';
        card.style.width = 'auto';
        card.style.minWidth = '320px';
        card.style.maxWidth = 'none';
        card.style.height = '120px';

        // SVG + name column
        const svgNameCol = document.createElement('div');
        svgNameCol.style.display = 'flex';
        svgNameCol.style.flexDirection = 'column';
        svgNameCol.style.alignItems = 'center';
        svgNameCol.style.justifyContent = 'center';
        svgNameCol.style.background = 'none';
        svgNameCol.style.flex = '0 0 120px';
        svgNameCol.style.height = '100%';
        svgNameCol.style.padding = '0';

        // SVG container (fixed size)
        const svgDiv = document.createElement('div');
        svgDiv.className = 'print-preview-svg';
        svgDiv.id = `print-svg-${i}`;
        svgDiv.style.background = 'none';
        svgDiv.style.display = 'flex';
        svgDiv.style.alignItems = 'center';
        svgDiv.style.justifyContent = 'center';
        svgDiv.style.width = '100px';
        svgDiv.style.height = '100px';
        svgDiv.style.minWidth = '100px';
        svgDiv.style.minHeight = '100px';
        svgDiv.style.maxWidth = '100px';
        svgDiv.style.maxHeight = '100px';
        svgDiv.style.padding = '0';
        svgNameCol.appendChild(svgDiv);

        // Name under SVG
        const nameDiv = document.createElement('div');
        nameDiv.className = 'print-preview-name';
        nameDiv.textContent = caseData.name;
        nameDiv.style.marginTop = '8px';
        nameDiv.style.marginBottom = '0';
        nameDiv.style.padding = '0';
        nameDiv.style.textAlign = 'center';
        svgNameCol.appendChild(nameDiv);

        // Text container for alg (right, vertically centered)
        const textContainer = document.createElement('div');
        textContainer.style.display = 'flex';
        textContainer.style.flexDirection = 'column';
        textContainer.style.justifyContent = 'center';
        textContainer.style.alignItems = 'flex-start';
        textContainer.style.background = 'none';
        textContainer.style.height = '100%';
        textContainer.style.flex = '1';
        textContainer.style.minWidth = '0';
        textContainer.style.maxWidth = 'none';
        textContainer.style.padding = '0';

        // Alg to the right, full width, wrap if needed
        const algDiv = document.createElement('div');
        algDiv.className = 'print-preview-alg';
        algDiv.textContent = caseData.selectedAlgorithm || caseData.algorithms[0];
        algDiv.style.display = 'block';
        algDiv.style.textAlign = 'left';
        algDiv.style.whiteSpace = 'normal';
        algDiv.style.overflow = 'visible';
        algDiv.style.textOverflow = 'unset';
        algDiv.style.fontSize = printAlgFontSize + 'px';
        algDiv.style.wordBreak = 'break-word';
        algDiv.style.lineHeight = '1.2';
        algDiv.style.maxWidth = 'none';
        algDiv.style.margin = '0';
        algDiv.style.padding = '0';
        textContainer.appendChild(algDiv);

        // Layout: [SVG+Name] [TextContainer]
        card.appendChild(svgNameCol);
        card.appendChild(textContainer);

        // Drag events
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', i);
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', function() {
            card.classList.remove('dragging');
        });
        card.addEventListener('dragover', function(e) {
            e.preventDefault();
            card.classList.add('drag-over');
        });
        card.addEventListener('dragleave', function() {
            card.classList.remove('drag-over');
        });
        card.addEventListener('drop', function(e) {
            e.preventDefault();
            card.classList.remove('drag-over');
            const from = +e.dataTransfer.getData('text/plain');
            const to = printPreviewOrder.indexOf(i);
            reorderPrintPreview(from, to);
        });
        printPreviewGrid.appendChild(card);
        // Generate SVG
        setTimeout(function() {
            generatePuzzleImage(caseData.scramble, svgDiv);
            // Ensure SVG inside svgDiv is also fixed size
            const svg = svgDiv.querySelector('svg');
            if (svg) {
                svg.setAttribute('width', '100');
                svg.setAttribute('height', '100');
                svg.style.width = '100px';
                svg.style.height = '100px';
                svg.style.display = 'block';
            }
        }, 0);
    });
    applyPrintStyles();
}

function reorderPrintPreview(from, to) {
    if (from === to) return;
    const idx = printPreviewOrder.indexOf(from);
    printPreviewOrder.splice(idx, 1);
    printPreviewOrder.splice(to, 0, from);
    // Always re-render the grid from scratch
    renderPrintPreview();
}

function applyPrintStyles() {
    const font = printFontSelect.value;
    const color = printTextColor.value;
    printPreviewGrid.querySelectorAll('.print-preview-name, .print-preview-alg').forEach(function(el) {
        el.style.fontFamily = font;
        el.style.color = color;
    });
    printPreviewGrid.querySelectorAll('.print-preview-alg').forEach(function(el) {
        el.style.fontSize = printAlgFontSize + 'px';
    });
}

if (printFontSelect) printFontSelect.onchange = applyPrintStyles;
if (printTextColor) printTextColor.oninput = applyPrintStyles;
if (printLayoutSelect) printLayoutSelect.onchange = function() {
    printLayout = printLayoutSelect.value;
    renderPrintPreview();
};
if (printPNGsBtn) printPNGsBtn.onclick = async function() {
    const cards = Array.from(printPreviewGrid.querySelectorAll('.print-preview-card'));
    if (cards.length === 0) {
        alert('No cases to export.');
        return;
    }
    printPNGsBtn.disabled = true;
    printPNGsBtn.textContent = 'Processing...';
    let progressMsg = document.createElement('div');
    progressMsg.id = 'print-progress-msg';
    progressMsg.style.margin = '16px 0';
    progressMsg.style.fontWeight = 'bold';
    progressMsg.style.color = '#3498db';
    printPNGsBtn.parentNode.appendChild(progressMsg);
    const estSec = Math.ceil(cards.length * 0.5);
    progressMsg.textContent = `Generating PNGs... (Estimated wait: ${estSec} seconds)`;

    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const zip = new JSZip();
    let generated = 0;

    for (let i = 0; i < cards.length; ++i) {
        const card = cards[i];

        // Store original styles
        const originalCardHeight = card.style.height;
        const svgNameCol = card.querySelector('.print-preview-svg').parentNode;
        const originalSvgNameColHeight = svgNameCol.style.height;
        const textContainer = card.querySelector('.print-preview-alg').parentNode;
        const originalTextContainerHeight = textContainer.style.height;

        // Apply export styles
        card.classList.add('exporting');
        card.style.height = 'auto';
        svgNameCol.style.height = 'auto';
        textContainer.style.height = 'auto';
        card.style.background = 'none';
        card.querySelectorAll('*').forEach(el => el.style.background = 'none');

        progressMsg.textContent = `Rendering ${i+1} / ${cards.length}...`;
        try {
            const canvas = await html2canvas(card, { backgroundColor: null, scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const base64 = dataUrl.split(',')[1];
            const caseName = cases[+card.dataset.index].name.replace(/[^a-z0-9]/gi, '_');
            zip.file(`${i+1}_${caseName}.png`, base64, { base64: true });
            generated++;
        } catch (err) {
            console.error(`Failed to render card ${i}:`, err);
            // Continue with next card
        }

        // Restore original styles
        card.classList.remove('exporting');
        card.style.height = originalCardHeight;
        svgNameCol.style.height = originalSvgNameColHeight;
        textContainer.style.height = originalTextContainerHeight;
        card.style.background = '';
        card.querySelectorAll('*').forEach(el => el.style.background = '');
    }

    if (generated === 0) {
        progressMsg.textContent = 'Error: No PNGs were generated.';
        printPNGsBtn.disabled = false;
        printPNGsBtn.textContent = 'Print PNGs (ZIP)';
        setTimeout(() => progressMsg.remove(), 3000);
        return;
    }

    progressMsg.textContent = 'Zipping files...';
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '1lookoll_export.zip';
    a.click();
    printPNGsBtn.disabled = false;
    printPNGsBtn.textContent = 'Print PNGs (ZIP)';
    progressMsg.textContent = 'Done! Download should start.';
    setTimeout(() => progressMsg.remove(), 3000);
};
// --- CSS MIME error note ---
// If you see a MIME type error for a CSS file, check that the file exists and the <link rel="stylesheet"> path is correct in your HTML.
// The server must return the actual CSS, not an HTML 404 page.
