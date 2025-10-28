// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpKSZGv4QLLDfc0vzsZUNjE9lX9Yy9BSo",
  authDomain: "myauthapp-2697e.firebaseapp.com",
  projectId: "myauthapp-2697e",
  storageBucket: "myauthapp-2697e",
  messagingSenderId: "866944015917",
  appId: "1:866944015917:web:03d640f207aaf1594722a4",
  measurementId: "G-3ERDJNMDF7"
};

firebase.initializeApp(firebaseConfig);

// Add cookie utilities at the top after Firebase config
const cookieConfig = {
    userInfo: { days: 7 }, // Cache user info for 7 days
    role: { days: 1 },     // Cache role for 1 day
    session: { days: 1 }   // Cache session for 1 day
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

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const wcaId = document.getElementById('wcaId').value.trim().toUpperCase();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Create updates object for atomic update
      const updates = {};

      // Update users and wca_profiles atomically
      if (wcaId) {
        updates[`users/${user.uid}`] = {
          username: username,
          email: email,
          wcaId: wcaId,
          role: 'free_user',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        updates[`wca_profiles/${user.uid}`] = {
          wcaId: wcaId,
          userId: user.uid,
          username: username,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        };
      } else {
        updates[`users/${user.uid}`] = {
          username: username,
          email: email,
          role: 'free_user',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        };
      }

      // Perform atomic update
      await firebase.database().ref().update(updates);

      alert('Registration successful!');
      window.location.href = '../index';
    } catch (error) {
      alert(error.message);
      console.error('Registration error:', error);
    }
  });
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Set session cookie immediately
        setCookie('session', true, cookieConfig.session.days);
        alert('Login successful!');
        window.location.href = '../index';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  });
}

// Modify the logout functionality
function logout() {
  const confirmLogout = confirm('Are you sure you want to log out?');
  if (confirmLogout) {
    clearAllCookies();
    firebase.auth().signOut().then(() => {
      alert('Logged out successfully');
      updateUIForAuthState(null);
      // Use window.location.href with the correct path
      if (window.location.pathname.includes('/auth/')) {
        window.location.href = '../index';
      } else {
        window.location.href = 'index';
      }
    }).catch((error) => {
      console.error('Logout error:', error);
      alert('Error logging out: ' + error.message);
    });
  }
}

// Check auth state and update UI
function updateUIForAuthState(user) {
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutLink = document.getElementById('logoutLink');
  const usernameDisplay = document.getElementById('usernameDisplay');

  if (user) {
    // User is signed in
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';

    // Fetch and display username
    firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.username && usernameDisplay) {
        usernameDisplay.textContent = 'Welcome, ' + userData.username;
        usernameDisplay.style.display = 'block';
      }
    });
  } else {
    // User is signed out
    if (loginLink) loginLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
    if (usernameDisplay) usernameDisplay.style.display = 'none';
  }
}

// Updated auth state observer
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Check for cached data first
    const cachedUser = getCookie('userInfo');
    const cachedRole = getCookie('role');

    // Immediately update UI with cached data if available
    if (cachedUser) {
        updateUIWithUserData(cachedUser);
        if (cachedRole) {
            updateUIForRole(cachedRole);
            updateProButton(cachedRole);
        }
    }

    // Only fetch from Firebase if cache is missing or expired
    if (!cachedUser || !getCookie('session')) {
        Promise.all([
            firebase.database().ref('users/' + user.uid).once('value'),
            firebase.database().ref('wca_profiles/' + user.uid).once('value')
        ]).then(([userSnapshot, wcaSnapshot]) => {
            const userData = userSnapshot.val();
            const wcaData = wcaSnapshot.val();

            if (userData) {
                // Cache the user data
                setCookie('userInfo', userData, cookieConfig.userInfo.days);
                setCookie('role', userData.role, cookieConfig.role.days);
                setCookie('session', true, cookieConfig.session.days);

                // Only update UI if it's different from cached data
                if (!cachedUser || cachedUser.username !== userData.username) {
                    updateUIWithUserData(userData);
                }
                if (!cachedRole || cachedRole !== userData.role) {
                    updateUIForRole(userData.role);
                    updateProButton(userData.role);
                }

                // Cache WCA data if exists
                if (wcaData) {
                    setCookie('wcaProfile', wcaData, cookieConfig.userInfo.days);
                    updateAvatarUI(wcaData);
                }
            }
        });
    }
  } else {
    // Clear all cookies on logout
    clearAllCookies();
  }
});

// Helper function to clear all cookies
function clearAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/');
    });
}

// Helper function to update UI with user data
function updateUIWithUserData(userData) {
    document.querySelectorAll('#userName').forEach(el => 
        el.textContent = userData.username || userData.email);
    
    document.querySelectorAll('#guest-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#user-content').forEach(el => el.style.display = 'block');
    document.querySelectorAll('#guest-footer-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#user-footer-content').forEach(el => el.style.display = 'block');
}

// Helper function for updating avatar
function updateAvatarUI(wcaData) {
    if (wcaData?.wcaId) {
        document.querySelectorAll('#userAvatar').forEach(img => {
            img.src = `https://www.worldcubeassociation.org/uploads/user/${wcaData.wcaId}.jpg`;
            img.onerror = () => img.src = 'img/noprof.png';
        });
    }
}

// Add this new function after the existing functions
function getWCAProfileImageUrl(wcaId) {
  return `https://www.worldcubeassociation.org/assets/missing_avatar_thumb-12654dd6f1aa6d458e80d02d6eed8b1fbf340a67d185a3ff975a6f54e2b2c0d9.png`;
}

// Call updateUIForAuthState on page load
document.addEventListener('DOMContentLoaded', () => {
  const user = firebase.auth().currentUser;
  updateUIForAuthState(user);
});

// Add this new function after the existing functions
function navigateToProfile() {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please log in to view your profile');
    return;
  }

  firebase.database().ref('wca_profiles/' + user.uid).once('value')
    .then(snapshot => {
      const wcaProfile = snapshot.val();
      if (wcaProfile && wcaProfile.wcaId) {
        window.location.href = 'profile?wcaId=' + wcaProfile.wcaId;
      } else {
        alert('Please add your WCA ID in settings first');
        navigateToSettings();
      }
    })
    .catch(error => {
      console.error('Error checking WCA profile:', error);
      alert('Error loading profile. Please try again.');
    });
}

// Update saveWCAId function
async function saveWCAId() {
    const wcaIdInput = document.getElementById('wcaIdInput');
    const wcaId = wcaIdInput.value.trim().toUpperCase();
    
    if (!/^\d{4}[A-Z]{4}\d{2}$/.test(wcaId)) {
        alert('Please enter a valid WCA ID');
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please log in first');
        return;
    }

    try {
        // Verify WCA ID exists
        const response = await fetch(`https://www.worldcubeassociation.org/api/v0/persons/${wcaId}`);
        if (!response.ok) {
            throw new Error('WCA ID not found');
        }
        
        // Create updates object for atomic update
        const updates = {};
        updates[`users/${user.uid}/wcaId`] = wcaId;
        updates[`wca_profiles/${user.uid}`] = {
            wcaId: wcaId,
            userId: user.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        // Perform atomic update
        await firebase.database().ref().update(updates);
        
        // Reload page to show profile
        window.location.reload();
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Save WCA ID error:', error);
    }
}