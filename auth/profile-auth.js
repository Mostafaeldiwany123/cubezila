import { auth } from '../js/firebase-config.js';
import { getUserProfile, updateUserProfile } from '../js/user-service.js';
import { onAuthStateChange } from '../js/auth-service.js';

// Initialize Firebase Auth Listener
onAuthStateChange((user) => {
    if (user && user.profile) {
        loadUserData(user);
        loadUserPreferences(); // Keep existing non-auth related functions
        updateProfileProgress(); // Keep existing non-auth related functions
        updateTimerStats(); // Keep existing non-auth related functions
        initializeChart(); // Keep existing non-auth related functions
    } else {
        window.location.href = '../index.html';
    }
});

// Load User Data
async function loadUserData(user) {
    // Update basic info
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('memberSince').textContent = new Date(user.metadata.creationTime).toLocaleDateString();

    // Load user data from database (already attached to user object by onAuthStateChange)
    if (user.profile) {
        document.getElementById('userName').textContent = user.profile.username || user.displayName || 'Anonymous';
        document.getElementById('displayName').value = user.profile.username || '';
    }
}

// Account Management
document.getElementById('changePassword').addEventListener('click', () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const email = currentUser.email;
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert('Password reset email sent to ' + email);
            })
            .catch((error) => {
                alert('Error: ' + error.message);
            });
    }
});

document.getElementById('deleteAccount').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const currentUser = auth.currentUser;
        if (currentUser) {
            currentUser.delete().then(() => {
                alert('Account deleted successfully.');
                window.location.href = '../index.html'; // Redirect after deletion
            }).catch((error) => {
                alert('Error: ' + error.message);
            });
        }
    }
});

// Profile Update Functions
document.getElementById('updateProfile').addEventListener('click', async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        const displayName = document.getElementById('displayName').value;
        try {
            await updateUserProfile(currentUser.uid, { username: displayName });
            alert('Profile updated successfully!');
            // Reload user data to reflect changes
            const updatedUser = await getUserProfile(currentUser.uid);
            loadUserData({ ...currentUser, profile: updatedUser });
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    }
});

// Stubs for functions not part of auth rewrite, assuming they are defined elsewhere or will be removed.
function loadUserPreferences() { /* ... */ }
function updateProfileProgress() { /* ... */ }
function updateTimerStats() { /* ... */ }
function initializeChart() { /* ... */ }