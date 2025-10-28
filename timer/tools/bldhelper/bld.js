document.addEventListener('DOMContentLoaded', function() {
  // Create the BLD helper panel
  var panel = document.createElement('div');
  panel.id = 'bld-helper-panel';
  panel.innerHTML = `
    <div id="bld-helper-header">
      <span>BLD Helper</span>
      <button id="close-bld-helper" class="close-button">×</button>
    </div>
    <div id="bld-helper-content">
      <div id="buffer-selection">
        <div class="buffer-selectors">
          <div class="buffer-input-group">
            <label>Edge Buffer</label>
            <select id="edge-buffer" class="buffer-select">
              ${Array.from({length: 24}, (_, i) => String.fromCharCode(65 + i)).map(letter => 
                `<option value="${letter}"${letter === 'U' ? ' selected' : ''}>${letter}</option>`
              ).join('')}
            </select>
          </div>
          <div class="buffer-input-group">
            <label>Corner Buffer</label>
            <select id="corner-buffer" class="buffer-select">
              ${Array.from({length: 24}, (_, i) => String.fromCharCode(65 + i)).map(letter => 
                `<option value="${letter}"${letter === 'A' ? ' selected' : ''}>${letter}</option>`
              ).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="solutions-container">
        <div class="solution-box">
          <div id="solutionEdges"></div>
        </div>
        <div class="solution-box">
          <div id="solutionCorners"></div>
        </div>
      </div>
    </div>
  `;
  
  // Get the tools box element and append the panel
  const toolsBox = document.querySelector('.tools-box') || document.body;
  toolsBox.appendChild(panel);
  panel.style.display = 'none';

  // Create puzzle object
  var puzzle = new cube3x3bld();
  
  // Initialize solution immediately after creating panel
  setTimeout(updateBLDSolution, 0);

  function updateBLDSolution() {
    var scrambleElem = document.getElementById("scrambleDisplay");
    if (scrambleElem && scrambleElem.textContent.trim() !== "") {
      var scrambleText = scrambleElem.textContent;
      var scrambleArray = scrambleText.split(" ");
      puzzle.scrambles = [scrambleArray];
      puzzle.scrambleIndex = 0;
      puzzle.doScramble();
      document.getElementById("solutionEdges").innerHTML = getLineOfEdgesSolution();
      document.getElementById("solutionCorners").innerHTML = getLineOfCornersSolution();
    }
  }

  // Buffer selection event listeners
  document.getElementById("edge-buffer").addEventListener("change", function() {
    try {
      puzzle.setBuffers(this.value, document.getElementById("corner-buffer").value);
      updateBLDSolution();
    } catch (error) {
      alert("Invalid buffer selection");
    }
  });

  document.getElementById("corner-buffer").addEventListener("change", function() {
    try {
      puzzle.setBuffers(document.getElementById("edge-buffer").value, this.value);
      updateBLDSolution();
    } catch (error) {
      alert("Invalid buffer selection");
    }
  });

  // Watch for scramble changes
  var scrambleDisplay = document.getElementById("scrambleDisplay");
  if (scrambleDisplay) {
    var observer = new MutationObserver(function(mutations) {
      updateBLDSolution();
    });
    observer.observe(scrambleDisplay, { childList: true, characterData: true, subtree: true });
  }

  // Toggle panel visibility
  document.getElementById("close-bld-helper").addEventListener("click", function() {
    panel.style.display = "none";
    document.getElementById("bldHelper").checked = false;
  });



  function getLineOfEdgesSolution() {
    const edgesSolution = puzzle.strigifySolutionEdges(puzzle.getBldSolutionEdges());
    if (!edgesSolution) return "No edge solution available";
    
    return `
      <div class="solution-header">Solution for edges:</div>
      <div class="letter-sequence">${edgesSolution}</div>`;
  }

  function getLineOfCornersSolution() {
    const cornersSolution = puzzle.strigifySolutionCorners(puzzle.getBldSolutionCorners());
    if (!cornersSolution) return "No corner solution available";
    
    return `
      <div class="solution-header">Solution for corners:</div>
      <div class="letter-sequence">${cornersSolution}</div>`;
  }
});
