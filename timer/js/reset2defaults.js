//clearing all data
function resetToDefaults() {
    if (confirm('Are you sure you want to reset everything to default settings? This will clear all sessions and settings. This action cannot be undone.')) {
        // Clear all localStorage data
        localStorage.clear();
        
        // Reload the page to reset everything to default state
        window.location.reload();
    }
}
