// Initialize Firebase Auth Listener
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadUserData(user);
        loadUserPreferences();
        updateProfileProgress();
        updateTimerStats();
        initializeChart();
    } else {
        window.location.href = '../index';
    }
});

// Load User Data
function loadUserData(user) {
    // Update basic info
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('memberSince').textContent = new Date(user.metadata.creationTime).toLocaleDateString();

    // Load user data from database
    firebase.database().ref('users/' + user.uid).once('value')
        .then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                document.getElementById('userName').textContent = userData.username || user.displayName || 'Anonymous';
                document.getElementById('displayName').value = userData.username || '';
            }
        });
}
// Account Management
document.getElementById('changePassword').addEventListener('click', () => {
    const user = firebase.auth().currentUser;
    if (user) {
        const email = user.email;
        firebase.auth().sendPasswordResetEmail(email)
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
        const user = firebase.auth().currentUser;
        if (user) {
            user.delete().then(() => {
                window.location.href = '../beg';
            }).catch((error) => {
                alert('Error: ' + error.message);
            });
        }
    }
});

// Profile Update Functions
document.getElementById('updateProfile').addEventListener('click', () => {
    const user = firebase.auth().currentUser;
    if (user) {
        const displayName = document.getElementById('displayName').value;
        firebase.database().ref('users/' + user.uid).update({
            username: displayName  // Changed from 'name' to 'username'
        }).then(() => {
            alert('Profile updated successfully!');
            loadUserData(user);
        }).catch(error => {
            alert('Error updating profile: ' + error.message);
        });
    }
});


