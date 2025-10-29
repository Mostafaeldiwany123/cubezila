import { onAuthStateChange } from '../js/auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const userAvatarEl = document.getElementById('userAvatar');
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const userRoleEl = document.getElementById('userRole');
    const memberSinceEl = document.getElementById('memberSince');

    onAuthStateChange((user) => {
        if (user && user.profile) {
            // User is logged in, populate the data
            const profile = user.profile;
            const username = profile.username || user.displayName || 'Anonymous';
            
            userNameEl.textContent = username;
            userEmailEl.textContent = user.email;
            userRoleEl.textContent = profile.role.replace('_', ' ');
            memberSinceEl.textContent = user.metadata.creationTime 
                ? new Date(user.metadata.creationTime).toLocaleDateString() 
                : 'N/A';

            // Handle avatar
            const avatarSrc = user.photoURL || profile.photoURL;
            if (avatarSrc) {
                userAvatarEl.style.backgroundImage = `url('${avatarSrc}')`;
                userAvatarEl.textContent = ''; // Clear initials if image is present
            } else {
                const initials = username.charAt(0).toUpperCase();
                userAvatarEl.style.backgroundImage = 'none';
                userAvatarEl.textContent = initials;
            }

        } else {
            // User is not logged in, redirect to login page
            console.log('User not logged in. Redirecting...');
            window.location.href = '../auth/login.html';
        }
    });
});