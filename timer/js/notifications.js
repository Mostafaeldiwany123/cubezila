let activeTimeout;
let activeNotification;

function showNotification(message, options = {}) {
    if (activeTimeout) {
        clearTimeout(activeTimeout);
    }
    
    if (activeNotification) {
        activeNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.zIndex = '999999'; // Add extremely high z-index
    
    // Add icon based on type
    const icon = document.createElement('i');
    icon.className = `fas ${options.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`;
    icon.style.color = 'var(--primary-color)';
    notification.appendChild(icon);

    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    notification.appendChild(messageSpan);

    // Add undo button if callback provided
    if (options.undoCallback) {
        const undoButton = document.createElement('button');
        undoButton.className = 'undo-button';
        undoButton.style.background = 'var(--container-bg)';
        undoButton.style.border = '1px solid var(--border-color)'; // Added border
        
        undoButton.innerHTML = '<i class="fas fa-undo"></i> Undo';
        undoButton.onclick = () => {
            options.undoCallback();
            hideNotification(notification);
        };
        notification.appendChild(undoButton);
    }

    document.body.appendChild(notification);
    activeNotification = notification;

    // Trigger animation
    requestAnimationFrame(() => notification.classList.add('show'));

    // Auto-hide
    activeTimeout = setTimeout(() => hideNotification(notification), options.duration || 3000);

    // Click to dismiss
    notification.onclick = (e) => {
        if (!e.target.classList.contains('undo-button')) {
            hideNotification(notification);
        }
    };
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 200);
}
