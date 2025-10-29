import { translations } from './lang.js';

// Function to update the language
function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((el) => {
        const key = el.getAttribute("data-translate");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Update the language toggle button text
    const langToggleBtn = document.getElementById('languageToggleBtn');
    if (langToggleBtn) {
        // Set the button text to the name of the *other* language
        langToggleBtn.textContent = translations[lang === 'en' ? 'ar' : 'en'].lang_toggle;
    }

    // Add or remove Arabic class from body and set direction
    if (lang === 'ar') {
        document.body.classList.add('ar');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.body.classList.remove('ar');
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    localStorage.setItem("selectedLanguage", lang);
}

// Function to toggle between English and Arabic
window.toggleLanguage = function() {
    const currentLang = localStorage.getItem("selectedLanguage") || "en";
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
};

// Load the saved language or default to English
document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    setLanguage(savedLanguage);
});

// Make setLanguage globally accessible for other scripts if needed
window.setLanguage = setLanguage;