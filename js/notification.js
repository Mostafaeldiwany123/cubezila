/**
 * Shows a temporary notification at the bottom of the screen.
 * @param {string} message - The message to display.
 * @param {string} iconClass - Font Awesome class for the icon (e.g., 'fas fa-lock').
 * @param {number} duration - Duration in milliseconds (default 3000).
 */
export function showNotification(message, iconClass = 'fas fa-info-circle', duration = 3000) {
    let notification = document.getElementById('global-notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'global-notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    // Clear previous timeout
    clearTimeout(notification.timeoutId);

    notification.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;

    // Show notification
    notification.classList.add('show');

    // Hide after duration
    notification.timeoutId = setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}