import { auth } from '../js/firebase-config.js';
import { updateUserProfile, getUserProfile } from '../js/user-service.js';
import { onAuthStateChange } from '../js/auth-service.js';

// Initialize Firebase Auth Listener
onAuthStateChange((user) => {
    if (user && user.profile) {
        loadUserData(user);
    } else if (user === null) {
        // Not logged in - redirect
        window.location.href = '../index.html';
    }
    // user === undefined means still loading, wait
});

// Load User Data into the profile page
async function loadUserData(user) {
    // Email
    const emailEl = document.getElementById('userEmail');
    if (emailEl) emailEl.textContent = user.email || '';

    // Member since
    const memberSinceEl = document.getElementById('memberSince');
    if (memberSinceEl) {
        memberSinceEl.textContent = user.metadata && user.metadata.creationTime
            ? new Date(user.metadata.creationTime).toLocaleDateString()
            : '';
    }

    if (user.profile) {
        // Username
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = user.profile.username || user.displayName || 'Anonymous';
        }

        // Avatar: use background-image div approach
        const userAvatarEl = document.getElementById('userAvatar');
        if (userAvatarEl) {
            const avatarSrc = user.photoURL || user.profile.photoURL || user.profile.avatarUrl;
            if (avatarSrc) {
                userAvatarEl.style.backgroundImage = `url('${avatarSrc}')`;
                userAvatarEl.style.backgroundSize = 'cover';
                userAvatarEl.style.backgroundPosition = 'center';
                userAvatarEl.textContent = '';
            } else {
                // Fallback: show initials
                const initials = (user.profile.username || user.displayName || 'U')
                    .trim()
                    .split(' ')
                    .map(w => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                userAvatarEl.style.backgroundImage = 'none';
                userAvatarEl.textContent = initials;
            }
        }

        // Optional: fill displayName input if it exists
        const displayNameEl = document.getElementById('displayName');
        if (displayNameEl) displayNameEl.value = user.profile.username || '';
    }
}

// Wire up optional account management buttons (only if they exist in the DOM)
document.addEventListener('DOMContentLoaded', () => {
    const changePasswordBtn = document.getElementById('changePassword');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.email) {
                auth.sendPasswordResetEmail(currentUser.email)
                    .then(() => alert('Password reset email sent to ' + currentUser.email))
                    .catch((error) => alert('Error: ' + error.message));
            }
        });
    }

    const deleteAccountBtn = document.getElementById('deleteAccount');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    currentUser.delete()
                        .then(() => {
                            alert('Account deleted successfully.');
                            window.location.href = '../index.html';
                        })
                        .catch((error) => alert('Error: ' + error.message));
                }
            }
        });
    }

    const updateProfileBtn = document.getElementById('updateProfile');
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const displayNameEl = document.getElementById('displayName');
                const displayName = displayNameEl ? displayNameEl.value : '';
                try {
                    await updateUserProfile(currentUser.uid, { username: displayName });
                    alert('Profile updated successfully!');
                    const updatedProfile = await getUserProfile(currentUser.uid);
                    loadUserData({ ...currentUser, profile: updatedProfile });
                } catch (error) {
                    alert('Error updating profile: ' + error.message);
                }
            }
        });
    }
});