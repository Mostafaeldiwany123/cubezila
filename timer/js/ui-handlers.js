let isSettingsOpen = false;
const settingsKey = "settings-ui";
let settingsUI = {};

// --- Local Storage Functions ---
function loadSettings() {
  const savedSettings = localStorage.getItem(settingsKey);
  if (savedSettings) {
    settingsUI = JSON.parse(savedSettings);
    applySettings();
  }
  
  // Timer state colors
  if (settingsUI.timerReadyColor) {
    document.getElementById('timerReadyColor').value = settingsUI.timerReadyColor;
  }
  if (settingsUI.inspectionColor) {
    document.getElementById('inspectionColor').value = settingsUI.inspectionColor;
  } else {
    settingsUI.timerTransitionDelay = 50; // Default value
    saveSetting('timerTransitionDelay', 50);
  }

  // History Layout
  if (settingsUI.historyLayout) {
    document.getElementById('historyLayout').value = settingsUI.historyLayout;
    const historyList = document.getElementById('historyList');
    historyList.classList.remove('default', 'compact-grid', 'cstimer-table');
    if (settingsUI.historyLayout === 'compact') {
      historyList.classList.add('compact-grid');
    } else if (settingsUI.historyLayout === 'cstimer') {
      historyList.classList.add('cstimer-table');
    } else {
      historyList.classList.add('default');
    }
  }

  // Load decimal places
  if (settingsUI.decimalPlaces !== undefined) {
    decimalPlaces = settingsUI.decimalPlaces;
    const decimalPlacesSelect = document.getElementById('decimalPlaces');
    if (decimalPlacesSelect) {
      decimalPlacesSelect.value = decimalPlaces;
    }
  }

  // Load inspection enabled state
  if (settingsUI.inspectionEnabled !== undefined) {
    inspectionEnabled = settingsUI.inspectionEnabled;
    const inspectionCheckbox = document.getElementById('enableInspection');
    if (inspectionCheckbox) {
      inspectionCheckbox.checked = inspectionEnabled;
    }
  }

  // Timer Elements
  if (settingsUI.timerElements) {
    const elementsSelect = document.getElementById('timerElements');
    if (elementsSelect) {
      elementsSelect.value = settingsUI.timerElements;
      changeTimerElements();
    }
  }

  // Timer Type
  if (settingsUI.timerType) {
    const timerTypeSelect = document.getElementById('timerType');
    if (timerTypeSelect) {
      timerTypeSelect.value = settingsUI.timerType;
      if (settingsUI.timerType === 'typing') {
        convertToTypingMode();
      }
    }
  }

  // Inspection Time
  if (settingsUI.inspectionTime !== undefined) {
    inspectionTime = settingsUI.inspectionTime;
    const inspectionInput = document.getElementById('inspectionTime');
    if (inspectionInput) {
      inspectionInput.value = inspectionTime;
    }
  }

  // Voice Selection
  if (settingsUI.selectedVoice) {
    selectedVoice = settingsUI.selectedVoice;
    const button = document.querySelector('.dropdown-button');
    if (button) {
      button.textContent = selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1);
    }
  }

  // Load hide timer setting
  if (settingsUI.hideTimer !== undefined) {
    hideTimer = settingsUI.hideTimer;
    const hideTimerCheckbox = document.getElementById('hideTimer');
    if (hideTimerCheckbox) {
      hideTimerCheckbox.checked = hideTimer;
    }
  }
}

function saveSetting(key, value) {
  settingsUI[key] = value;
  localStorage.setItem(settingsKey, JSON.stringify(settingsUI));
}

function applySettings() {
  // Timer Color
  if (settingsUI.timerColor) {
    timerDisplay.style.color = settingsUI.timerColor;
    document.getElementById('timerColor').value = settingsUI.timerColor;
  }
  // Timer Glow
  if (settingsUI.timerGlowSize !== undefined && settingsUI.timerGlowColor !== undefined) {
    const glowSize = settingsUI.timerGlowSize;
    const glowColor = settingsUI.timerGlowColor;
    timerDisplay.style.textShadow = glowSize > 0 ? `0 0 ${glowSize}px ${glowColor}` : 'none';
    document.getElementById('timerGlow').value = glowSize;
    document.getElementById('timerGlowColor').value = glowColor;
  }
  // Scramble Color
  if (settingsUI.scrambleColor) {
    scrambleDisplay.style.color = settingsUI.scrambleColor;
    document.getElementById('scrambleColor').value = settingsUI.scrambleColor;
    document.querySelector('.scramble-header').style.color = settingsUI.scrambleColor;
  }
  // Scramble Glow
  if (settingsUI.scrambleGlowSize !== undefined && settingsUI.scrambleGlowColor !== undefined) {
    const glowSize = settingsUI.scrambleGlowSize;
    const glowColor = settingsUI.scrambleGlowColor;
    const glow = glowSize > 0 ? `0 0 ${glowSize}px ${glowColor}` : 'none';
    scrambleDisplay.style.textShadow = glow;
    document.querySelector('.scramble-header').style.textShadow = glow;
    document.getElementById('scrambleGlow').value = glowSize;
    document.getElementById('scrambleGlowColor').value = glowColor;
  }
  // Background Color
  if (settingsUI.backgroundColor) {
    document.body.style.backgroundColor = settingsUI.backgroundColor;
    document.getElementById('backgroundColor').value = settingsUI.backgroundColor;
  }
  // Timer Font
  if (settingsUI.timerFont) {
    timerDisplay.style.fontFamily = settingsUI.timerFont;
    const timerFontSelect = document.getElementById('timerFont');
    let found = Array.from(timerFontSelect.options).some(
      option => option.value === settingsUI.timerFont
    );
    if (!found) {
      let newOpt = document.createElement('option');
      newOpt.value = settingsUI.timerFont;
      newOpt.textContent = settingsUI.timerFont;
      timerFontSelect.appendChild(newOpt);
    }
    timerFontSelect.value = settingsUI.timerFont;
  }
  // Scramble Font
  if (settingsUI.scrambleFont) {
    scrambleDisplay.style.fontFamily = settingsUI.scrambleFont;
    const scrambleFontSelect = document.getElementById('scrambleFont');
    let found = Array.from(scrambleFontSelect.options).some(
      option => option.value === settingsUI.scrambleFont
    );
    if (!found) {
      let newOpt = document.createElement('option');
      newOpt.value = settingsUI.scrambleFont;
      newOpt.textContent = settingsUI.scrambleFont;
      scrambleFontSelect.appendChild(newOpt);
    }
    scrambleFontSelect.value = settingsUI.scrambleFont;
  }
  // Timer Size
  if (settingsUI.timerSize) {
    document.querySelector('.timer-display').style.fontSize = `${settingsUI.timerSize}vh`;
    document.getElementById('timerSize').value = settingsUI.timerSize;
  }
  // Panel Background Color
  if (settingsUI.panelBackgroundColor) {
    document.documentElement.style.setProperty('--container-bg', settingsUI.panelBackgroundColor);
    document.getElementById('panelBackgroundColor').value = settingsUI.panelBackgroundColor;
  }
  // Panel Shadow
  if (settingsUI.panelShadowColor && settingsUI.panelShadowBlur && settingsUI.panelShadowSpread) {
    const shadow = `0 0 ${settingsUI.panelShadowBlur}px ${settingsUI.panelShadowSpread}px ${settingsUI.panelShadowColor}`;
    document.documentElement.style.setProperty('--box-shadow', shadow);
    document.getElementById('panelShadowColor').value = settingsUI.panelShadowColor;
    document.getElementById('panelShadowBlur').value = settingsUI.panelShadowBlur;
    document.getElementById('panelShadowSpread').value = settingsUI.panelShadowSpread;
  }
  // Scramble Size
  if (settingsUI.scrambleSize) {
    document.querySelector('.scramble-display').style.fontSize = `${settingsUI.scrambleSize}vh`;
    document.getElementById('scrambleSize').value = settingsUI.scrambleSize;
  }
  // Gradient Settings
  if (settingsUI.gradientEnabled !== undefined) {
    const gradientEnabled = settingsUI.gradientEnabled;
    document.getElementById('gradientEnabled').checked = gradientEnabled;
    document.getElementById('gradientStart').value = settingsUI.gradientStart || "#000000";
    document.getElementById('gradientEnd').value = settingsUI.gradientEnd || "#000000";
    document.getElementById('gradientAngle').value = settingsUI.gradientAngle || "45";
    if (gradientEnabled) {
      document.body.style.backgroundImage = `linear-gradient(${settingsUI.gradientAngle}deg, ${settingsUI.gradientStart}, ${settingsUI.gradientEnd})`;
    } else {
      document.body.style.backgroundImage = 'none';
      if (settingsUI.backgroundColor) {
        document.body.style.backgroundColor = settingsUI.backgroundColor;
      }
    }
  }
  // Highlight Background
  if (settingsUI.highlightBgColor) {
    document.documentElement.style.setProperty('--highlight-bg', settingsUI.highlightBgColor);
    document.getElementById('highlightBgColor').value = settingsUI.highlightBgColor;
  }
  // Root Font
  if (settingsUI.rootFont) {
    document.documentElement.style.setProperty('--font-family', settingsUI.rootFont);
    const rootFontSelect = document.getElementById('rootFont');
    if (rootFontSelect) rootFontSelect.value = settingsUI.rootFont;
  }
  // Primary Color
  if (settingsUI.primaryColor) {
    document.documentElement.style.setProperty('--primary-color', settingsUI.primaryColor);
    const primaryColorInput = document.getElementById('primaryColor');
    if (primaryColorInput) primaryColorInput.value = settingsUI.primaryColor;
  }
  // Button Hover Color
  if (settingsUI.buttonHoverColor) {
    document.documentElement.style.setProperty('--button-hover', settingsUI.buttonHoverColor);
    const buttonHoverInput = document.getElementById('buttonHoverColor');
    if (buttonHoverInput) buttonHoverInput.value = settingsUI.buttonHoverColor;
  }
  // Border Color
  if (settingsUI.borderColor) {
    document.documentElement.style.setProperty('--border-color', settingsUI.borderColor);
    const borderColorInput = document.getElementById('borderColor');
    if (borderColorInput) borderColorInput.value = settingsUI.borderColor;
  }
  // Typography Colors
  if (settingsUI.mainTextColor) {
    document.documentElement.style.setProperty('--text-color', settingsUI.mainTextColor);
    const mainTextInput = document.getElementById('mainTextColor');
    if (mainTextInput) mainTextInput.value = settingsUI.mainTextColor;
  }
  if (settingsUI.secondaryTextColor) {
    document.documentElement.style.setProperty('--secondary-text', settingsUI.secondaryTextColor);
    const secondaryTextInput = document.getElementById('secondaryTextColor');
    if (secondaryTextInput) secondaryTextInput.value = settingsUI.secondaryTextColor;
  }
  // Focus Mode Overlay
  if (settingsUI.focusOverlayColor) {
    document.documentElement.style.setProperty('--focus-overlay-color', settingsUI.focusOverlayColor);
    document.getElementById('focusOverlayColor').value = settingsUI.focusOverlayColor;
  }
  if (settingsUI.focusOverlayOpacity) {
    document.documentElement.style.setProperty('--focus-overlay-opacity', settingsUI.focusOverlayOpacity);
    document.getElementById('focusOverlayOpacity').value = settingsUI.focusOverlayOpacity;
  }
  // Load background previews and applied background image
  if (settingsUI.backgroundPreviews) {
    settingsUI.backgroundPreviews.forEach(addImagePreview);
  }
  if (settingsUI.backgroundImage) {
    setBackgroundImage(settingsUI.backgroundImage);
  } else {
    setBackgroundImage('none');
  }

  // Add focus mode settings
  if (settingsUI.focusModeEnabled !== undefined) {
    const focusModeCheckbox = document.getElementById('focusMode');
    if (focusModeCheckbox) {
      focusModeCheckbox.checked = settingsUI.focusModeEnabled;
      isDesktopFocusEnabled = settingsUI.focusModeEnabled;
    }
  }

  if (settingsUI.focusModeType) {
    const focusModeSelect = document.getElementById('focusModeType');
    if (focusModeSelect) {
      focusModeSelect.value = settingsUI.focusModeType;
    }
  }

  // Apply decimal places
  if (settingsUI.decimalPlaces !== undefined) {
    decimalPlaces = settingsUI.decimalPlaces;
    const decimalPlacesSelect = document.getElementById('decimalPlaces');
    if (decimalPlacesSelect) {
      decimalPlacesSelect.value = decimalPlaces;
    }
    // Update display
    updateHistory();
  }

  // Apply inspection enabled state
  if (settingsUI.inspectionEnabled !== undefined) {
    inspectionEnabled = settingsUI.inspectionEnabled;
    const inspectionCheckbox = document.getElementById('enableInspection');
    if (inspectionCheckbox) {
      inspectionCheckbox.checked = inspectionEnabled;
    }
  }

  // Apply Timer Elements
  if (settingsUI.timerElements) {
    const elementsSelect = document.getElementById('timerElements');
    if (elementsSelect) {
      elementsSelect.value = settingsUI.timerElements;
      changeTimerElements();
    }
  }

  // Apply Timer Type
  if (settingsUI.timerType) {
    const timerTypeSelect = document.getElementById('timerType');
    if (timerTypeSelect) {
      timerTypeSelect.value = settingsUI.timerType;
      if (settingsUI.timerType === 'typing') {
        convertToTypingMode();
      }
    }
  }

  // Apply Inspection Time
  if (settingsUI.inspectionTime !== undefined) {
    inspectionTime = settingsUI.inspectionTime;
    const inspectionInput = document.getElementById('inspectionTime');
    if (inspectionInput) {
      inspectionInput.value = inspectionTime;
    }
  }

  // Apply Voice Selection
  if (settingsUI.selectedVoice) {
    selectedVoice = settingsUI.selectedVoice;
    const button = document.querySelector('.dropdown-button');
    if (button) {
      button.textContent = selectedVoice.charAt(0).toUpperCase() + selectedVoice.slice(1);
    }
  }

  // Apply hide timer setting
  if (settingsUI.hideTimer !== undefined) {
    hideTimer = settingsUI.hideTimer;
    const hideTimerCheckbox = document.getElementById('hideTimer');
    if (hideTimerCheckbox) {
      hideTimerCheckbox.checked = hideTimer;
    }
  }

  // Apply voice setting
  if (settingsUI.selectedVoice) {
    selectedVoice = settingsUI.selectedVoice;
    updateVoice(); // Update voice UI and audio files
  }
}

// --- UI Functions ---
function toggleSettingsMenu() {
  const settingsMenu = document.getElementById('settingsMenu');
  const settingsIcon = document.querySelector('.settings-icon');
  const overlay = document.querySelector('.settings-overlay');
  isSettingsOpen = !isSettingsOpen;
  if (isSettingsOpen) {
    overlay.style.display = 'block';
    setTimeout(() => overlay.classList.add('active'), 10);
    settingsMenu.classList.add('active');
    settingsIcon.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    overlay.classList.remove('active');
    settingsMenu.classList.remove('active');
    settingsIcon.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { if (!isSettingsOpen) overlay.style.display = 'none'; }, 300);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isSettingsOpen) { toggleSettingsMenu(); }
});

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  const overlay = document.querySelector('.settings-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => { if (isSettingsOpen) toggleSettingsMenu(); });
  }
  
  const panel = document.querySelector('.left-panel');
  panel.classList.add('expanded');
  const panelHandle = document.querySelector('.panel-handle');
  if (panelHandle) { panelHandle.addEventListener('click', toggleHistoryPanel); }
  
  document.querySelectorAll('.scramble-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.scramble-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('scrambleType').value = this.dataset.value;
      document.getElementById('scrambleType').dispatchEvent(new Event('change'));
    });
  });
  initializeBackgroundUpload();
  if (document.getElementById('gradientEnabled').checked) {
    updateBackgroundGradient();
  }

  initializeThemeTemplates();
});

function openTab(event, tabName) {
  const tabContents = document.getElementsByClassName('tab-content');
  const tabs = document.getElementsByClassName('tab');
  Array.from(tabs).forEach(tab => tab.classList.remove('active'));
  Array.from(tabContents).forEach(content => {
    content.style.opacity = '0';
    content.style.display = 'none';
    content.classList.remove('active');
  });
  const selectedTab = document.getElementById(tabName);
  selectedTab.style.display = 'block';
  setTimeout(() => { selectedTab.style.opacity = '1'; selectedTab.classList.add('active'); }, 50);
  event.currentTarget.classList.add('active');
}

function toggleTab(tabId) {
  const tab = document.querySelector(`.tab[onclick*="${tabId}"]`);
  const content = document.getElementById(tabId);
  const wasActive = content.classList.contains('active');
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (!wasActive) { content.classList.add('active'); tab.classList.add('active'); }
}

function changeTimerColor() { 
  const newColor = document.getElementById('timerColor').value;
  timerDisplay.style.color = newColor;
  saveSetting('timerColor', newColor);
}

function changeTimerGlow() {
  const glowSize = document.getElementById('timerGlow').value;
  const glowColor = document.getElementById('timerGlowColor').value;
  timerDisplay.style.textShadow = glowSize > 0 
    ? `0 0 ${glowSize}px ${glowColor}` 
    : 'none';
  saveSetting('timerGlowSize', glowSize);
  saveSetting('timerGlowColor', glowColor);
}

function changeScrambleColor() { 
  const color = document.getElementById('scrambleColor').value;
  scrambleDisplay.style.color = color;
  document.querySelector('.scramble-header').style.color = color;
  saveSetting('scrambleColor', color);
}

function changeScrambleGlow() {
  const glowSize = document.getElementById('scrambleGlow').value;
  const glowColor = document.getElementById('scrambleGlowColor').value;
  const glow = glowSize > 0 ? `0 0 ${glowSize}px ${glowColor}` : 'none';
  scrambleDisplay.style.textShadow = glow;
  document.querySelector('.scramble-header').style.textShadow = glow;
  saveSetting('scrambleGlowSize', glowSize);
  saveSetting('scrambleGlowColor', glowColor);
}

function changeBackgroundColor() { 
  const color = document.getElementById('backgroundColor').value;
  document.body.style.backgroundColor = color;
  saveSetting('backgroundColor', color);
}

function changeTimerFont() { 
  const font = document.getElementById('timerFont').value;
  timerDisplay.style.fontFamily = font;
  saveSetting('timerFont', font);
}

function changeScrambleFont() { 
  const font = document.getElementById('scrambleFont').value;
  scrambleDisplay.style.fontFamily = font;
  saveSetting('scrambleFont', font);
}

function changeTimerSize() {
  const size = document.getElementById('timerSize').value;
  document.querySelector('.timer-display').style.fontSize = `${size}vh`;
  saveSetting('timerSize', size);
}

function toggleHighlightBest() { 
  highlightBest = document.getElementById('highlightBest').checked; 
  saveSetting('highlightBest', highlightBest);
  updateHistory(); 
}

function toggleSoundEffects() { 
  soundEffects = document.getElementById('soundEffects').checked; 
  saveSetting('soundEffects', soundEffects);
}

function toggleKeyboardShortcuts() { 
  keyboardShortcuts = document.getElementById('keyboardShortcuts').checked; 
  saveSetting('keyboardShortcuts', keyboardShortcuts);
}

function toggleHideTimer() { 
  hideTimer = document.getElementById('hideTimer').checked; 
  saveSetting('hideTimer', hideTimer);
  if (hideTimer) showNotification('Hide timer enabled. Start the timer to see the difference', { duration: 3000 });
}

function toggleShowMilliseconds() { 
  showMilliseconds = document.getElementById('showMilliseconds').checked; 
  saveSetting('showMilliseconds', showMilliseconds);
  updateHistory(); 
  updateStatistics(); 
}

function toggleAutoSave() { 
  autoSave = document.getElementById('autoSave').checked; 
  saveSetting('autoSave', autoSave);
  if (autoSave) saveSessionsToLocalStorage(); 
}

function toggleBLDHelper() {
  const panel = document.getElementById('bld-helper-panel');
  const isChecked = document.getElementById('bldHelper').checked;
  panel.style.display = isChecked ? 'block' : 'none';
  saveSetting('bldHelper', isChecked);
  if (isChecked) { document.getElementById('update-buffers').dispatchEvent(new Event('change')); }
}

function toggleHistoryPanel() {
  const panel = document.querySelector('.left-panel');
  panel.classList.toggle('expanded');
}

function removeBackgroundImage() {
  setBackgroundImage('none');
  document.getElementById('customBackground').value = '';
}

function initializeBackgroundUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('customBackground');
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
  dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('drag-over'); });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) { handleBackgroundImage(file); }
  });
  fileInput.addEventListener('change', (e) => { if (e.target.files[0]) { handleBackgroundImage(e.target.files[0]); } });

  const themeDropZone = document.getElementById('themeDropZone');
  const themeInput = document.getElementById('themeImport');
  
  themeDropZone.addEventListener('click', () => themeInput.click());
  themeDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    themeDropZone.classList.add('drag-over');
  });
  themeDropZone.addEventListener('dragleave', () => {
    themeDropZone.classList.remove('drag-over');
  });
  themeDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    themeDropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      handleThemeImport(file);
    }
  });
  themeInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleThemeImport(e.target.files[0]);
  });
}

function handleBackgroundImage(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Image = e.target.result;
    addImagePreview(base64Image);
    setBackgroundImage(base64Image);
    if (!settingsUI.backgroundPreviews) {
      settingsUI.backgroundPreviews = [];
    }
    settingsUI.backgroundPreviews.push(base64Image);
    saveSetting('backgroundPreviews', settingsUI.backgroundPreviews);
  };
  reader.readAsDataURL(file);
}

function addImagePreview(base64Image) {
  const previewsContainer = document.querySelector('.background-previews');
  if (!previewsContainer) return;
  const previewItem = document.createElement('div');
  previewItem.className = 'preview-item';
  previewItem.innerHTML = `
    <img src="${base64Image}" alt="Background preview">
    <button class="remove-preview" onclick="removeBackground('${base64Image}')">
      <i class="fas fa-times"></i>
    </button>
  `;
  previewItem.addEventListener('click', () => setBackgroundImage(base64Image));
  previewsContainer.appendChild(previewItem);
}

function setBackgroundImage(base64Image) {
  if (base64Image === 'none') {
    document.body.style.backgroundImage = 'none';
  } else {
    // Pre-load image before setting
    const img = new Image();
    img.onload = function() {
      document.body.style.backgroundImage = `url(${base64Image})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed'; // Add this to fix background
    };
    img.src = base64Image;
  }

  // Handle preview item selection
  document.querySelectorAll('.preview-item, .background-preview').forEach(preview => {
    preview.classList.remove('active');
    const img = preview.querySelector('img');
    if (img && img.src === base64Image) {
      preview.classList.add('active');
    }
    if (base64Image === 'none' && preview.querySelector('.none-preview')) {
      preview.classList.add('active');
    }
  });

  settingsUI.backgroundImage = base64Image;
  saveSetting('backgroundImage', base64Image);
}

function removeBackground(base64Image) {
  if (document.body.style.backgroundImage.includes(base64Image)) { setBackgroundImage('none'); }
  const previewItem = document.querySelector(`.preview-item img[src="${base64Image}"]`)?.parentElement;
  if (previewItem) { 
    previewItem.remove(); 
    settingsUI.backgroundPreviews = settingsUI.backgroundPreviews.filter(img => img !== base64Image);
    saveSetting('backgroundPreviews', settingsUI.backgroundPreviews);
  }
}

function changePanelBackground() {
  const color = document.getElementById('panelBackgroundColor').value;
  document.documentElement.style.setProperty('--container-bg', color);
  saveSetting('panelBackgroundColor', color);
}

function changePanelShadow() {
  const color = document.getElementById('panelShadowColor').value;
  const blur = document.getElementById('panelShadowBlur').value;
  const spread = document.getElementById('panelShadowSpread').value;
  const shadow = `0 0 ${blur}px ${spread}px ${color}`;
  document.documentElement.style.setProperty('--box-shadow', shadow);
  saveSetting('panelShadowColor', color);
  saveSetting('panelShadowBlur', blur);
  saveSetting('panelShadowSpread', spread);
}

function changeScrambleSize() {
  const size = document.getElementById('scrambleSize').value;
  document.querySelector('.scramble-display').style.fontSize = `${size}vh`;
  saveSetting('scrambleSize', size);
}

function updateBackgroundGradient() {
  const enabled = document.getElementById('gradientEnabled').checked;
  const start = document.getElementById('gradientStart').value;
  const end = document.getElementById('gradientEnd').value;
  const angle = document.getElementById('gradientAngle').value;
  
  if (enabled) {
    document.body.style.backgroundImage = `linear-gradient(${angle}deg, ${start}, ${end})`;
  } else {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = document.getElementById('backgroundColor').value;
  }
  saveSetting('gradientEnabled', enabled);
  saveSetting('gradientStart', start);
  saveSetting('gradientEnd', end);
  saveSetting('gradientAngle', angle);
}

function changeHighlightBackground() {
  const color = document.getElementById('highlightBgColor').value;
  document.documentElement.style.setProperty('--highlight-bg', color);
  saveSetting('highlightBgColor', color);
}

function changeRootFont() {
  const font = document.getElementById('rootFont').value;
  document.documentElement.style.setProperty('--font-family', font);
  saveSetting('rootFont', font);
}

function changePrimaryColor() {
  const color = document.getElementById('primaryColor').value;
  document.documentElement.style.setProperty('--primary-color', color);
  saveSetting('primaryColor', color);
}

function changeButtonHoverColor() {
  const color = document.getElementById('buttonHoverColor').value;
  document.documentElement.style.setProperty('--button-hover', color);
  saveSetting('buttonHoverColor', color);
}

function changeBorderColor() {
  const color = document.getElementById('borderColor').value;
  document.documentElement.style.setProperty('--border-color', color);
  saveSetting('borderColor', color);
}

function changeMainTextColor() {
  const color = document.getElementById('mainTextColor').value;
  document.documentElement.style.setProperty('--text-color', color);
  saveSetting('mainTextColor', color);
}

function changeSecondaryTextColor() {
  const color = document.getElementById('secondaryTextColor').value;
  document.documentElement.style.setProperty('--secondary-text', color);
  saveSetting('secondaryTextColor', color);
}

function changeFocusOverlayColor() {
  const color = document.getElementById('focusOverlayColor').value;
  document.documentElement.style.setProperty('--focus-overlay-color', color);
  saveSetting('focusOverlayColor', color);
}

function changeFocusOverlayOpacity() {
  const opacity = document.getElementById('focusOverlayOpacity').value;
  document.documentElement.style.setProperty('--focus-overlay-opacity', opacity);
  saveSetting('focusOverlayOpacity', opacity);
}

// --- Theme Export/Import Functions ---
function exportTheme() {
  const themeData = localStorage.getItem(settingsKey);
  if (!themeData) {
    alert('No theme data found to export!');
    return;
  }
  const blob = new Blob([themeData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'theme.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importTheme() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json';
  fileInput.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedTheme = JSON.parse(e.target.result);
        localStorage.setItem(settingsKey, JSON.stringify(importedTheme));
        settingsUI = importedTheme;
        applySettings();
        alert('Theme imported successfully!');
      } catch (error) {
        console.error(error);
        alert('Failed to import theme. Please ensure the file is valid JSON.');
      }
    };
    reader.readAsText(file);
  };
  fileInput.click();
}

function handleThemeImport(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedTheme = JSON.parse(e.target.result);
      localStorage.setItem(settingsKey, JSON.stringify(importedTheme));
      settingsUI = importedTheme;
      applySettings();
      showNotification('Theme imported successfully');
    } catch (error) {
      console.error(error);
      showNotification('Failed to import theme. Please ensure the file is valid.', { type: 'error' });
    }
  };
  reader.readAsText(file);
}

function resetUI() {
  if (confirm('Are you sure you want to reset all UI settings? This cannot be undone.')) {
    localStorage.removeItem(settingsKey);
    window.location.reload();
  }
}

function showSubsets() {
  document.querySelector('.scramble-category.main-puzzles').classList.add('hidden');
  document.querySelector('.scramble-category.subsets').classList.add('active');
  document.querySelector('.scramble-category.move-subsets').classList.add('active');
  document.querySelector('.back-to-main').style.display = 'flex';
}

function showMainPuzzles() {
  document.querySelector('.scramble-category.main-puzzles').classList.remove('hidden');
  document.querySelector('.scramble-category.subsets').classList.remove('active');
  document.querySelector('.scramble-category.move-subsets').classList.remove('active');
  document.querySelector('.back-to-main').style.display = 'none';
}

function changeTimerReadyColor() {
  const color = document.getElementById('timerReadyColor').value;
  saveSetting('timerReadyColor', color);
}

function changeInspectionColor() {
  const color = document.getElementById('inspectionColor').value;
  saveSetting('inspectionColor', color);
}

function changeHistoryLayout() {
  const layout = document.getElementById('historyLayout').value;
  const historyList = document.getElementById('historyList');
  
  // Remove existing layout classes
  historyList.classList.remove('default', 'compact-grid', 'cstimer-table');
  
  // Add new layout class
  if (layout === 'compact') {
      historyList.classList.add('compact-grid');
  } else if (layout === 'cstimer') {
      historyList.classList.add('cstimer-table');
  } else {
      historyList.classList.add('default');
  }
  
  // Save setting
  saveSetting('historyLayout', layout);
  
  // Force history update
  updateHistory();
}

function initializeThemeTemplates() {
  const container = document.querySelector('.theme-templates-grid');
  if (!container) return;

  Object.entries(themeTemplates).forEach(([key, theme]) => {
    const previewCard = document.createElement('div');
    previewCard.className = 'theme-preview-card';
    previewCard.style.backgroundColor = theme.panelBackgroundColor;
    previewCard.style.border = `1px solid ${theme.borderColor}`;
    previewCard.onclick = () => applyThemeTemplate(key);

    previewCard.innerHTML = `
      <div class="theme-preview-content" style="background-color: ${theme.backgroundColor}">
        <div class="preview-timer" style="color: ${theme.timerColor}; font-family: ${theme.timerFont}">
          12.34
        </div>
        <div class="preview-scramble" style="color: ${theme.scrambleColor}; font-family: ${theme.rootFont}">
          R U R' U'
        </div>
      </div>
    `;

    container.appendChild(previewCard);
  });
}

const style = document.createElement('style');
style.textContent = `
.theme-templates-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.5rem;
}

.theme-preview-card {
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  height: 45px;
  transition: transform 0.15s;
}

.theme-preview-card:hover {
  transform: scale(1.02);
}

.theme-preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.preview-timer {
  font-size: 0.95rem;
  line-height: 1;
}

.preview-scramble {
  font-size: 0.6rem;
  opacity: 0.7;
  line-height: 1;
}

@media (max-width: 768px) {
  .theme-templates-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .theme-preview-card {
    height: 36px;
  }
  .preview-timer {
    font-size: 0.75rem;
  }
  .preview-scramble {
    font-size: 0.48rem;
  }
}
`;

document.head.appendChild(style);

function resetThemeStyles() {
  // Reset all relevant CSS custom properties and inline styles to defaults
  document.documentElement.style.setProperty('--container-bg', '');
  document.documentElement.style.setProperty('--box-shadow', '');
  document.documentElement.style.setProperty('--highlight-bg', '');
  document.documentElement.style.setProperty('--font-family', '');
  document.documentElement.style.setProperty('--primary-color', '');
  document.documentElement.style.setProperty('--button-hover', '');
  document.documentElement.style.setProperty('--border-color', '');
  document.documentElement.style.setProperty('--text-color', '');
  document.documentElement.style.setProperty('--secondary-text', '');
  document.documentElement.style.setProperty('--focus-overlay-color', '');
  document.documentElement.style.setProperty('--focus-overlay-opacity', '');
  // Reset background
  document.body.style.backgroundColor = '';
  document.body.style.backgroundImage = '';
  // Reset timer and scramble display styles
  if (window.timerDisplay) {
    timerDisplay.style.color = '';
    timerDisplay.style.fontFamily = '';
    timerDisplay.style.fontSize = '';
    timerDisplay.style.textShadow = '';
  }
  if (window.scrambleDisplay) {
    scrambleDisplay.style.color = '';
    scrambleDisplay.style.fontFamily = '';
    scrambleDisplay.style.fontSize = '';
    scrambleDisplay.style.textShadow = '';
  }
  // Reset scramble header
  const scrambleHeader = document.querySelector('.scramble-header');
  if (scrambleHeader) {
    scrambleHeader.style.color = '';
    scrambleHeader.style.textShadow = '';
  }
}

function applyThemeTemplate(templateKey) {
  const theme = themeTemplates[templateKey];
  if (!theme) return;

  resetThemeStyles();

  settingsUI = { ...theme };
  applySettings();
  localStorage.setItem(settingsKey, JSON.stringify(settingsUI));
  
  showNotification(`Applied ${theme.name} theme`);
}

