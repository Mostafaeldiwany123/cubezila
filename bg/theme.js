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

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) {
        try {
            return JSON.parse(decodeURIComponent(match[2]));
        } catch (e) {
            return null;
        }
    }
    return null;
}

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
    setCookie('currentTheme', { name: theme, timestamp: Date.now() }, 30);
    localStorage.setItem('theme', theme);
    broadcastTheme(theme);
}

// Initialize theme immediately on page load - UPDATED LOGIC
(function initTheme() {
    // Check cookie first (more secure)
    const savedThemeCookie = getCookie('currentTheme');
    // Check localStorage as fallback (for backward compatibility)
    const savedThemeLocal = localStorage.getItem('theme');
    
    let themeToApply;
    
    if (savedThemeCookie?.name) {
        themeToApply = savedThemeCookie.name;
    } else if (savedThemeLocal) {
        // If theme is in localStorage but not in cookie, restore it
        themeToApply = savedThemeLocal;
        // Save to cookie for future
        setCookie('currentTheme', { name: savedThemeLocal, timestamp: Date.now() }, 30);
    }

    // Apply theme or fallback to default
    document.documentElement.setAttribute('data-theme', themeToApply || 'light');
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

// Export for global use
window.setTheme = setTheme;