// --- EXPORT FUNCTION ---
function exportData() {
  // Prepare the export object for sessions and UI settings.
  const exportObj = {};
  const sessionDataObj = {};
  Object.entries(sessions).forEach(([sessionName, sessionData], index) => {
    sessionDataObj[index] = {
      name: sessionName,
      opt: {
        scrType:
          sessionData.scrambleType === '3x3'
            ? '333'
            : sessionData.scrambleType === '2x2'
            ? '222so'
            : sessionData.scrambleType === '4x4'
            ? '444wca'
            : sessionData.scrambleType === '5x5'
            ? '555wca'
            : sessionData.scrambleType === '6x6'
            ? '666wca'
            : sessionData.scrambleType === '7x7'
            ? '777wca'
            : sessionData.scrambleType === 'Pyraminx'
            ? 'pyrso'
            : sessionData.scrambleType === 'Skewb'
            ? 'skbso'
            : sessionData.scrambleType === 'Square-1'
            ? 'sqrs'
            : sessionData.scrambleType === 'Clock'
            ? 'clkwca'
            : sessionData.scrambleType === 'Megaminx'
            ? 'minxso'
            : '333'
      }
    };

    // Convert each solve to csTimer format: [ [penalty, timeInMillis], scramble, comment, timestamp ]
    const solves = sessionData.times.map((time, i) => {
      const penalty =
        sessionData.penalties[i] === '+2'
          ? 2000
          : time === DNF_VALUE
          ? -1
          : 0;
      const timeInMillis = time === DNF_VALUE ? 0 : time * 1000;
      const comment = sessionData.comments?.[i] || '';
      // Convert timestamp from milliseconds to seconds for csTimer compatibility
      const timestamp = Math.floor((sessionData.dates?.[i] || Date.now()) / 1000);

      return [
        [penalty, timeInMillis],
        sessionData.scrambles[i] || "",
        comment,
        timestamp
      ];
    });

    exportObj[sessionName] = solves;
  });

  const uiSettingsRaw = localStorage.getItem("settings-ui") || '{}';
  const uiSettings = JSON.parse(uiSettingsRaw);

  exportObj['properties'] = {
    sessionData: JSON.stringify(sessionDataObj),
    session: Object.keys(sessions).indexOf(currentSession).toString(),
    uiSettings: uiSettings
  };

  const dataStr = JSON.stringify(exportObj, null, 2);
  const blob = new Blob([dataStr], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.download = `cubezilla_backup_${date}.txt`;
  a.href = url;
  a.click();
  window.URL.revokeObjectURL(url);
}

// --- NEW FUNCTION: Export to twisty timer CSV ---
function exportTwistyData() {
  // Reverse mapping from internal scrambleType to twisty timer "Puzzle" code.
  const reverseMapping = {
    '3x3': '333',
    '2x2': '222so',
    '4x4': '444wca',
    '5x5': '555wca',
    '6x6': '666',
    '7x7': '777',
    'Pyraminx': 'pyra',
    'Skewb': 'skbso',
    'Square-1': 'sq1',
    'Clock': 'clock',
    'Megaminx': 'minxso'
  };

  if (!sessions[currentSession]) {
    alert("No current session found for twisty export.");
    return;
  }
  const session = sessions[currentSession];
  let csvRows = [];
  // Header row
  csvRows.push('Puzzle,Category,Time(millis),Date(millis),Scramble,Penalty,Comment');

  session.times.forEach((time, i) => {
    // Determine penalty value for twisty export:
    // 1 indicates a +2 penalty, 2 indicates DNF.
    let penaltyVal = 0;
    if (session.penalties[i] === '+2') {
      penaltyVal = 1;
    } else if (session.penalties[i] === -1 || time === DNF_VALUE) {
      penaltyVal = 2;
    }
    // Convert time to millis (stored times are in seconds)
    let timeMillis = (time === DNF_VALUE ? 0 : time * 1000);
    // Use the timestamp from the solve if available; otherwise, use current time.
    let timestamp = Date.now();
    if (session.originalTimes && session.originalTimes[time]) {
      timestamp = session.originalTimes[time];
    }
    const puzzle = reverseMapping[session.scrambleType] || '333';
    // Wrap each field in quotes and separate with semicolons.
    const row = [
      `"${puzzle}"`,
      `"Normal"`,
      `"${timeMillis}"`,
      `"${timestamp}"`,
      `"${session.scrambles[i] || ""}"`,
      `"${penaltyVal}"`,
      `"${localStorage.getItem(`comment_${currentSession}_${i}`) || ""}"`
    ].join(";");
    csvRows.push(row);
  });

  const csvData = csvRows.join("\n");
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.download = `cubezilla_twisty_export_${currentSession}_${date}.csv`;
  a.href = url;
  a.click();
  window.URL.revokeObjectURL(url);
}

// --- IMPORT FUNCTION ---
document.getElementById('importFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.txt') && !file.name.toLowerCase().endsWith('.csv')) {
    alert('Please select a .txt or .csv file');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileContent = e.target.result;
    let importedData;
    try {
      importedData = JSON.parse(fileContent);
      // Process as JSON backup export (existing functionality)
      processJSONImport(importedData);
    } catch (jsonError) {
      // If JSON parsing fails, try to parse as twisty timer CSV export.
      if (fileContent.startsWith("Puzzle")) {
        try {
          parseTwistyCSV(fileContent);
        } catch (csvError) {
          console.error('CSV Import error:', csvError);
          alert('Error importing CSV file: ' + csvError.message);
        }
      } else {
        alert('Invalid file format: Unable to parse file.');
      }
    }
  };
  reader.readAsText(file);
});

document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dataDropZone');
    const fileInput = document.getElementById('importFile');

    if (dropZone && fileInput) {
        // Click handler
        dropZone.addEventListener('click', () => fileInput.click());

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length) {
                fileInput.files = files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }
});

// --- Helper: Process JSON import (existing code refactored for clarity) ---
function processJSONImport(importedData) {
  if (!importedData.properties || !importedData.properties.sessionData) {
    alert('Invalid file format: missing required properties.');
    return;
  }
  const sessionMeta = JSON.parse(importedData.properties.sessionData);
  sessions = {};

  // Check if all keys (except "properties") match "sessionX" pattern (csTimer format)
  const isCsTimerFormat = Object.keys(importedData).every(
    key => key === "properties" || /^session\d+$/.test(key)
  );

  if (isCsTimerFormat) {
    // csTimer format: Keys are "sessionX", names in sessionMeta
    Object.keys(importedData).forEach(key => {
      if (key === "properties") return;
      const match = key.match(/^session(\d+)$/);
      if (match) {
        const X = match[1];
        const meta = sessionMeta[X] || { opt: { scrType: "333" } };
        const sessionName = meta.name || key;
        sessions[sessionName] = {
          times: [],
          scrambles: [],
          penalties: [],
          comments: [],
          dates: [],
          originalTimes: {},
          scrambleType: convertScrType(meta.opt.scrType || "333")
        };
        const solves = importedData[key];
        if (Array.isArray(solves)) {
          solves.forEach(solve => {
            if (!Array.isArray(solve) || !Array.isArray(solve[0])) return;
            const [penaltyValue, timeInMillis] = solve[0];
            let originalTimeInSeconds = timeInMillis / 1000;
            let timeInSeconds = originalTimeInSeconds;
            let penaltyType = undefined;
            if (penaltyValue === 2000) {
              timeInSeconds += 2; // Apply +2 penalty
              penaltyType = '+2';
            } else if (penaltyValue === -1) {
              timeInSeconds = DNF_VALUE; // Mark as DNF
            }
            sessions[sessionName].times.push(timeInSeconds);
            const index = sessions[sessionName].times.length - 1;
            if (penaltyValue === -1) {
              sessions[sessionName].originalTimes[index] = originalTimeInSeconds; // Store original time for DNF
            }
            sessions[sessionName].scrambles.push(solve[1] || "");
            sessions[sessionName].penalties.push(penaltyType);
            sessions[sessionName].comments.push(solve[2] || "");
            // Convert csTimer timestamp (seconds) to milliseconds for compatibility
            // csTimer uses seconds since epoch, we need milliseconds
            const timestamp = solve[3] ? Number(solve[3]) * 1000 : Date.now();
            sessions[sessionName].dates.push(timestamp);
          });
        }
      }
    });
  } else {
    // CubeZilla format: Keys are session names, unchanged behavior
    Object.keys(importedData).forEach(key => {
      if (key === "properties") return;
      const meta = Object.values(sessionMeta).find(s => s.name === key) || { opt: { scrType: "333" } };
      const sessionName = key;
      sessions[sessionName] = {
        times: [],
        scrambles: [],
        penalties: [],
        comments: [],
        dates: [],
        originalTimes: {},
        scrambleType: convertScrType(meta.opt.scrType || "333")
      };
      const solves = importedData[key];
      if (Array.isArray(solves)) {
        solves.forEach(solve => {
          if (!Array.isArray(solve) || !Array.isArray(solve[0])) return;
          const [penaltyValue, timeInMillis] = solve[0];
          let timeInSeconds = timeInMillis / 1000;
          let penaltyType = 0;
          if (penaltyValue === 2000) {
            penaltyType = '+2';
            sessions[sessionName].originalTimes[timeInSeconds] = timeInSeconds;
          } else if (penaltyValue === -1) {
            timeInSeconds = DNF_VALUE;
            penaltyType = -1;
          } else {
            sessions[sessionName].originalTimes[timeInSeconds] = timeInSeconds;
          }
          sessions[sessionName].times.push(timeInSeconds);
          sessions[sessionName].scrambles.push(solve[1] || "");
          sessions[sessionName].penalties.push(penaltyType);
          sessions[sessionName].comments.push(solve[2] || "");
          // Convert csTimer timestamp (seconds) to milliseconds for compatibility
          // csTimer uses seconds since epoch, we need milliseconds
          const timestamp = solve[3] ? Number(solve[3]) * 1000 : Date.now();
          sessions[sessionName].dates.push(timestamp);
        });
      }
    });
  }

  // Set current session using sessionMeta
  const sessionIndexStr = importedData.properties.session;
  const metaForCurrent = sessionMeta[sessionIndexStr];
  if (metaForCurrent && metaForCurrent.name) {
    currentSession = metaForCurrent.name;
  } else {
    currentSession = Object.keys(sessions)[0] || "";
  }
  localStorage.setItem('mainSession', currentSession);
  localStorage.setItem('currentSession', currentSession);

  if (importedData.properties.uiSettings) {
    localStorage.setItem("settings-ui", JSON.stringify(importedData.properties.uiSettings));
    if (typeof loadSettings === "function") {
      loadSettings();
    }
  }
  updateSessionSelector();
  updateHistory();
  updateHistorySummary();
  saveSessionsToLocalStorage();
  if (typeof window.updateSessionTrigger === 'function') {
    window.updateSessionTrigger(currentSession);
  }
  alert('Import successful!');
}

// --- Helper: Parse twisty timer CSV export ---
function parseTwistyCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim() !== "");
  if (lines.length < 2) {
    alert('CSV file does not contain enough data.');
    return;
  }
  // Header expected: "Puzzle,Category,Time(millis),Date(millis),Scramble,Penalty,Comment"
  const header = lines[0].split(/[,;]/).map(h => h.trim().toLowerCase());
  const puzzleIdx = header.indexOf("puzzle");
  const timeIdx = header.indexOf("time(millis)");
  const dateIdx = header.indexOf("date(millis)");
  const scrambleIdx = header.indexOf("scramble");
  const penaltyIdx = header.indexOf("penalty");
  const commentIdx = header.indexOf("comment");

  if (puzzleIdx === -1 || timeIdx === -1 || dateIdx === -1 || scrambleIdx === -1 || penaltyIdx === -1) {
    alert('CSV header is missing required fields.');
    return;
  }

  // Mapping for twisty puzzle codes to internal scrambleType.
  const twistyMapping = {
    '333': '3x3',
    '222so': '2x2',
    '444wca': '4x4',
    '555wca': '5x5',
    '666': '6x6',
    '777': '7x7',
    'pyra': 'Pyraminx',
    'skbso': 'Skewb',
    'sq1': 'Square-1',
    'clock': 'Clock',
    'minxso': 'Megaminx'
  };

  // Group solves by puzzle type.
  const newSessions = {};

  for (let i = 1; i < lines.length; i++) {
    // Split using comma or semicolon and remove surrounding quotes.
    const parts = lines[i].split(/[,;]/).map(part => part.replace(/^"|"$/g, '').trim());
    if (parts.length < header.length) continue;
    const puzzleCode = parts[puzzleIdx];
    const sessionName = puzzleCode; // using the puzzle code as the session name
    if (!newSessions[sessionName]) {
      newSessions[sessionName] = {
        times: [],
        scrambles: [],
        penalties: [],
        comments: [],
        originalTimes: {},
        // Convert twisty puzzle code to internal scramble type.
        scrambleType: twistyMapping[puzzleCode] || '3x3'
      };
    }
    const timeMillis = parseInt(parts[timeIdx], 10);
    let timeInSeconds = timeMillis / 1000;
    // Adjust penalty based on twisty CSV: 
    // 1 means +2 penalty, 2 means DNF.
    let penaltyField = parseInt(parts[penaltyIdx], 10);
    let penaltyType = 0;
    if (penaltyField === 1) {
      penaltyType = '+2';
      newSessions[sessionName].originalTimes[timeInSeconds] = timeInSeconds;
      // Removed the timeInSeconds += 2 line here
    } else if (penaltyField === 2) {
      timeInSeconds = DNF_VALUE;
      penaltyType = -1;
    } else {
      newSessions[sessionName].originalTimes[timeInSeconds] = timeInSeconds;
    }
    newSessions[sessionName].times.push(timeInSeconds);
    newSessions[sessionName].scrambles.push(parts[scrambleIdx] || "");
    newSessions[sessionName].penalties.push(penaltyType);
    if (commentIdx !== -1) {
      const comment = parts[commentIdx] || "";
      if (comment !== "") {
        const commentKey = `comment_${sessionName}_${newSessions[sessionName].times.length - 1}`;
        localStorage.setItem(commentKey, comment);
      }
    }
  }
  
  // Merge the new sessions into the global sessions object.
  sessions = newSessions;
  currentSession = Object.keys(sessions)[0] || "";
  localStorage.setItem('mainSession', currentSession);
  localStorage.setItem('currentSession', currentSession);
  updateSessionSelector();
  updateHistory();
   updateHistorySummary();
  saveSessionsToLocalStorage();
  if (typeof window.updateSessionTrigger === 'function') {
    window.updateSessionTrigger(currentSession);
  }
  alert('CSV Import successful!');
}

// --- HELPER FUNCTION ---
// Convert csTimer scramble types to your internal format.
function convertScrType(scrType) {
  const mapping = {
    '333': '3x3',
    '222so': '2x2',
    '444wca': '4x4',
    '555wca': '5x5',
    '666wca': '6x6',
    '777wca': '7x7',
    'pyrso': 'Pyraminx',
    'skbso': 'Skewb',
    'sqrs': 'Square-1',
    'clkwca': 'Clock',
    'minxso': 'Megaminx'
  };
  return mapping[scrType] || '3x3';
}

// ===================== Rest of your existing code =====================
// ===================== Helper Functions =====================
// ===================== Helper Functions =====================

// Sanitize a string so it can be used as a Firebase key.
function sanitizeKey(key) {
  // Replace characters ".", "#", "$", "/", "[", or "]" with an underscore.
  return key.replace(/[.#$/\[\]]/g, "_");
}

// ===================== Cloud Sync Functions =====================

// Helper: Build the export object (same format as exportData) without downloading.
function buildExportObject() {
  console.log("Building export object...");
  const exportObj = {};
  const sessionDataObj = {};

  Object.entries(sessions).forEach(([sessionName, sessionData], index) => {
    const safeSessionName = sanitizeKey(sessionName);
    sessionDataObj[index] = {
      name: sessionName,
      safeKey: safeSessionName,
      opt: {
        scrType:
          sessionData.scrambleType === '3x3'
            ? '333'
            : sessionData.scrambleType === '2x2'
            ? '222so'
            : sessionData.scrambleType === '4x4'
            ? '444wca'
            : sessionData.scrambleType === '5x5'
            ? '555wca'
            : sessionData.scrambleType === '6x6'
            ? '666wca'
            : sessionData.scrambleType === '7x7'
            ? '777wca'
            : sessionData.scrambleType === 'Pyraminx'
            ? 'pyrso'
            : sessionData.scrambleType === 'Skewb'
            ? 'skbso'
            : sessionData.scrambleType === 'Square-1'
            ? 'sqrs'
            : sessionData.scrambleType === 'Clock'
            ? 'clkwca'
            : sessionData.scrambleType === 'Megaminx'
            ? 'minxso'
            : '333'
      }
    };

    // Build each solve array with comments and dates from session data
    const solves = sessionData.times.map((time, i) => {
      const penalty =
        sessionData.penalties[i] === '+2'
          ? 2000
          : time === DNF_VALUE
          ? -1
          : 0;
      const timeInMillis = time === DNF_VALUE ? 0 : time * 1000;
      const comment = sessionData.comments?.[i] || '';
      // Convert timestamp from milliseconds to seconds for csTimer compatibility
      const timestamp = Math.floor((sessionData.dates?.[i] || Date.now()) / 1000);
      return [
        [penalty, timeInMillis],
        sessionData.scrambles[i] || "",
        comment,
        timestamp
      ];
    });
    exportObj[safeSessionName] = solves;
  });

  // Retrieve UI settings from localStorage.
  const uiSettingsRaw = localStorage.getItem("settings-ui") || '{}';
  const uiSettings = JSON.parse(uiSettingsRaw);

  exportObj['properties'] = {
    sessionData: JSON.stringify(sessionDataObj),
    session: Object.keys(sessions).indexOf(currentSession).toString(),
    uiSettings: uiSettings
  };

  console.log("Export object built:", exportObj);
  return exportObj;
}

// Sync current data to Firebase cloud.
function syncDataToCloud() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("Sync aborted: No user logged in.");
    return;
  }
  
  pendingCloudAction = 'sync';
  showSyncOverlay('Are you sure you want to sync your data to the cloud?', true);
}

function performCloudSync() {
  showSyncOverlay('Syncing your data to cloud...');
  
  const exportObj = buildExportObject();
  firebase.database().ref("cloudSync/" + firebase.auth().currentUser.uid)
    .set(exportObj)
    .then(() => {
      showSyncOverlay('Data synced successfully!');
      // Mark that cloud data has been loaded/synced.
      localStorage.setItem("cloudDataLoaded", "true");
      setTimeout(hideSyncOverlay, 1500);
    })
    .catch((error) => {
      showSyncOverlay('Sync failed: ' + error.message);
      setTimeout(hideSyncOverlay, 2000);
    });
}

// Load cloud data from Firebase.
function loadDataFromCloud() {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("No user logged in. Cannot load cloud data.");
    return;
  }
  
  // Check if cloud data was already loaded for this account.
  if (localStorage.getItem("cloudDataLoaded") === "true") {
    console.log("Cloud data already loaded; skipping prompt.");
    return;
  }
  
  console.log("Checking for cloud data for user:", user.uid);
  firebase.database().ref("cloudSync/" + user.uid)
    .once("value")
    .then((snapshot) => {
      const cloudData = snapshot.val();
      hideSyncOverlay();
      
      if (cloudData) {
          pendingCloudAction = 'load';
          showSyncOverlay('Cloud data found. Load data from cloud?', true);
      } else {
          showSyncOverlay('No cloud data found');
          setTimeout(hideSyncOverlay, 1500);
      }
    })
    .catch((error) => {
      showSyncOverlay('Error checking cloud data: ' + error.message);
      setTimeout(hideSyncOverlay, 2000);
    });
}

function performCloudLoad() {
  showSyncOverlay('Loading data from cloud...');
  
  firebase.database().ref("cloudSync/" + firebase.auth().currentUser.uid)
      .once("value")
      .then((snapshot) => {
          const cloudData = snapshot.val();
          if (cloudData) {
              processImportedData(cloudData);
              // Update dropdown trigger after cloud sync
              if (typeof window.updateSessionTrigger === 'function' && currentSession) {
                window.updateSessionTrigger(currentSession);
              }
              // Mark that cloud data has been loaded so prompt won't appear again.
              localStorage.setItem("cloudDataLoaded", "true");
              showSyncOverlay('Data loaded successfully!');
              setTimeout(hideSyncOverlay, 1500);
          }
      })
      .catch((error) => {
          showSyncOverlay('Error loading data: ' + error.message);
          setTimeout(hideSyncOverlay, 2000);
      });
}

// Process and apply imported cloud data (preserving session order).
function processImportedData(importedData) {
  console.log("Processing imported cloud data...");
  if (!importedData.properties || !importedData.properties.sessionData) {
    console.error("Cloud data format error:", importedData);
    return;
  }
  
  const sessionMeta = JSON.parse(importedData.properties.sessionData);
  sessions = {};
  
  // Get sorted indices from sessionMeta (to preserve order).
  const sortedIndices = Object.keys(sessionMeta)
    .map(key => parseInt(key, 10))
    .sort((a, b) => a - b);
  
  // Iterate in order through the session meta.
  sortedIndices.forEach(index => {
    const meta = sessionMeta[index];
    const safeKey = meta.safeKey;
    const originalName = meta.name;
    const solves = importedData[safeKey];
    if (!Array.isArray(solves)) {
      console.warn(`No solves found for session ${originalName}`);
      return;
    }
  
    sessions[originalName] = {
      times: [],
      scrambles: [],
      penalties: [],
      comments: [],
      originalTimes: {},
      phaseTimes: [],
      scrambleType: convertScrType(meta.opt.scrType)
    };
  
    solves.forEach((solve) => {
      if (!Array.isArray(solve) || !Array.isArray(solve[0])) return;
      const [penaltyValue, timeInMillis] = solve[0];
      let timeInSeconds = timeInMillis / 1000;
      let penaltyType = 0;
      
      if (penaltyValue === 2000) {
        penaltyType = '+2';
        sessions[originalName].originalTimes[timeInSeconds] = timeInSeconds;
      } else if (penaltyValue === -1) {
        timeInSeconds = DNF_VALUE;
        penaltyType = -1;
      } else {
        sessions[originalName].originalTimes[timeInSeconds] = timeInSeconds;
      }
      
      sessions[originalName].times.push(timeInSeconds);
      sessions[originalName].scrambles.push(solve[1] || "");
      sessions[originalName].penalties.push(penaltyType);
      sessions[originalName].comments.push(solve[2] || "");
    });
  });
  
  // Set current session based on stored index.
  const sessionIndex = parseInt(importedData.properties.session, 10);
  const sessionNames = Object.keys(sessions);
  currentSession = sessionNames[sessionIndex] || sessionNames[0] || "";
  localStorage.setItem('mainSession', currentSession);
  localStorage.setItem('currentSession', currentSession);

  // Update dropdown trigger with current session
  if (typeof window.updateSessionTrigger === 'function') {
    window.updateSessionTrigger(currentSession);
  }
  
  // Restore UI settings from cloud.
  if (importedData.properties.uiSettings) {
    localStorage.setItem("settings-ui", JSON.stringify(importedData.properties.uiSettings));
    if (typeof loadSettings === "function") {
      loadSettings();
      console.log("UI settings applied from cloud data.");
    }
  }
  
  updateSessionSelector();
  updateHistory();
   updateHistorySummary();
  saveSessionsToLocalStorage();
  console.log("Cloud data processed and applied successfully.");
}

 // Helper: Convert csTimer scramble type to your internal format.
function convertScrType(scrType) {
  const mapping = {
    '333': '3x3',
    '222so': '2x2',
    '444wca': '4x4',
    '555wca': '5x5',
    '666wca': '6x6',
    '777wca': '7x7',
    'pyrso': 'Pyraminx',
    'skbso': 'Skewb',
    'sqrs': 'Square-1',
    'clkwca': 'Clock',
    'minxso': 'Megaminx'
  };
  return mapping[scrType] || '3x3';
}

// ===================== Auto-Load Cloud Data on Login =====================

// When a user logs in, automatically check for cloud data after a short delay.
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in. UID:", user.uid);
    setTimeout(loadDataFromCloud, 2000);
  } else {
    console.log("No user logged in.");
  }
});

// ===================== Overlay Utility Functions =====================

function showSyncOverlay(message, showConfirm = false) {
  // Create overlay if it doesn't exist
  let overlay = document.querySelector('.sync-overlay');
  if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sync-overlay';
      document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
      <div class="sync-modal">
          <div class="sync-spinner"></div>
          <div class="sync-message">${message}</div>
          ${showConfirm ? `
              <div class="sync-actions">
                  <button class="sync-btn confirm" onclick="confirmCloudAction()">Confirm</button>
                  <button class="sync-btn cancel" onclick="hideSyncOverlay()">Cancel</button>
              </div>
          ` : ''}
      </div>
  `;
  
  overlay.classList.add('active');
}

function hideSyncOverlay() {
  const overlay = document.querySelector('.sync-overlay');
  if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
  }
}

function confirmCloudAction() {
  hideSyncOverlay();
  processPendingCloudAction();
}

let pendingCloudAction = null;

function processPendingCloudAction() {
  if (!pendingCloudAction) return;
  
  const action = pendingCloudAction;
  pendingCloudAction = null;
  
  if (action === 'sync') {
      performCloudSync();
  } else if (action === 'load') {
      performCloudLoad();
  }
}
