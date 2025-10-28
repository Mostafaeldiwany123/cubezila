const translations = {
    en: { 
    },
    ar: {
    
}
};


// Function to update the language
function setLanguage(lang) {
    const elements = document.querySelectorAll("[data-translate]");
    elements.forEach((el) => {
        const key = el.getAttribute("data-translate");
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    
    // Add or remove Arabic class from body
    if (lang === 'ar') {
        document.body.classList.add('ar');
    } else {
        document.body.classList.remove('ar');
    }
    
    localStorage.setItem("selectedLanguage", lang);
}

// Load the saved language or default to English
document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    setLanguage(savedLanguage);
    const languageSelector = document.getElementById("languageSelector");
    if (languageSelector) {
        languageSelector.value = savedLanguage;
    }
    
    // Set initial Arabic class if needed
    if (savedLanguage === 'ar') {
        document.body.classList.add('ar');
    }
});
