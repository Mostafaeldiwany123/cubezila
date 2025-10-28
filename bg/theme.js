const THEMES = {
    FREE: ['light', 'dark', 'neon', 'blue', 'green', 'red', 'golden', 'kids', 'lightblue'],
    PREMIUM: [] // No premium themes, all are free
};

const availableThemes = {
    light: { isPro: false },
    dark: { isPro: false },
    neon: { isPro: false },
    blue: { isPro: false },
    green: { isPro: false },
    red: { isPro: false },
    golden: { isPro: false },
    kids: { isPro: false },
    lightblue: { isPro: false }
};

// setTheme: all themes are free, just apply and save
async function setTheme(theme) {
    if (THEMES.FREE.includes(theme)) {
        applyAndSaveTheme(theme);
    } else {
        // fallback: apply anyway (should never hit this)
        applyAndSaveTheme(theme);
    }
}

function applyAndSaveTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    broadcastTheme(theme);
}

// Initialize theme immediately on page load - UPDATED LOGIC
(function initTheme() {
    // Only use localStorage for theme
    const savedThemeLocal = localStorage.getItem('theme');
    // Apply theme or fallback to default
    document.documentElement.setAttribute('data-theme', savedThemeLocal || 'light');
})();

function broadcastTheme(theme) {
    document.querySelectorAll('iframe').forEach(iframe => {
        try {
            iframe.contentWindow.postMessage({ type: 'themeChange', theme }, '*');
        } catch(e) {}
    });

    if (window !== window.parent) {
        window.parent.postMessage({ type: 'themeChange', theme }, '*');
    }
}

// Add this function to load font preferences
function loadGlobalFontPreferences() {
    const savedRootFont = localStorage.getItem('rootFontFamily');
    if (savedRootFont) {
        document.documentElement.style.setProperty('--font-family', savedRootFont);
    }
}

// Set up theme buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = {
        'lightModeBtn': 'light',
        'darkModeBtn': 'dark',
        'neonModeBtn': 'neon',
        'blueModeBtn': 'blue',
        'greenModeBtn': 'green',
        'redModeBtn': 'red',
        'goldenModeBtn': 'golden',
        'kidsModeBtn': 'kids',
        'lightblueModeBtn': 'lightblue'
    };

    Object.entries(buttons).forEach(([btnId, theme]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => setTheme(theme));
        }
    });

    // Call it when the document loads
    loadGlobalFontPreferences();
});

// Listen for theme changes from other frames
window.addEventListener('message', (event) => {
    if (event.data?.type === 'themeChange') {
        document.documentElement.setAttribute('data-theme', event.data.theme);
    }
});

// Listen for theme changes from other tabs/windows
window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue) {
        document.documentElement.setAttribute('data-theme', event.newValue);
    }
});

// Export for global use
window.setTheme = setTheme;