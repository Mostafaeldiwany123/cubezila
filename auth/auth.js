import { registerWithEmailPassword, loginWithEmailPassword, signInWithGoogle, logoutUser, onAuthStateChange } from '../js/auth-service.js';
import { getUserProfile } from '../js/user-service.js';

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      await registerWithEmailPassword(email, password, username);
      alert('Registration successful!');
      window.location.href = '../index.html';
    } catch (error) {
      alert(error.message);
      console.error('Registration error:', error);
    }
  });
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await loginWithEmailPassword(email, password);
      alert('Login successful!');
      window.location.href = '../index.html';
    } catch (error) {
      alert(error.message);
      console.error('Login error:', error);
    }
  });
}

// Google Sign-in button
const googleSignInButton = document.getElementById('googleSignInButton');
if (googleSignInButton) {
  googleSignInButton.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
      alert('Signed in with Google successfully!');
      window.location.href = '../index.html';
    } catch (error) {
      alert(error.message);
      console.error('Google Sign-in error:', error);
    }
  });
}

// Logout functionality
window.logout = async function() {
  const confirmLogout = confirm('Are you sure you want to log out?');
  if (confirmLogout) {
    try {
      await logoutUser();
      alert('Logged out successfully');
      // Redirect to index or current page if not auth page
      if (window.location.pathname.includes('/auth/')) {
        window.location.href = '../index.html';
      } else {
        window.location.reload(); // Refresh to update UI
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out: ' + error.message);
    }
  }
};

// Update UI based on auth state
function updateUIForAuthState(user) {
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutLink = document.getElementById('logoutLink');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const userAvatar = document.getElementById('userAvatar'); // Assuming this exists for the main header

  if (user && user.profile) {
    // User is signed in
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';

    if (usernameDisplay) {
      usernameDisplay.textContent = 'Welcome, ' + user.profile.username;
      usernameDisplay.style.display = 'block';
    }
    if (userAvatar) {
        // For now, just show initials or a default image
        const initials = user.profile.username ? user.profile.username.charAt(0).toUpperCase() : '?';
        userAvatar.src = `https://via.placeholder.com/32/007bff/ffffff?text=${initials}`; // Placeholder with initials
        userAvatar.alt = user.profile.username;
    }
  } else {
    // User is signed out
    if (loginLink) loginLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
    if (usernameDisplay) usernameDisplay.style.display = 'none';
    if (userAvatar) {
        userAvatar.src = 'img/noprof.png'; // Default image
        userAvatar.alt = 'Profile';
    }
  }
}

// Auth state observer
onAuthStateChange((user) => {
  updateUIForAuthState(user);
  // Additional UI updates for specific pages can be handled here or in page-specific scripts
});

// No need for cookie utilities anymore, Firebase handles session management.
// Removed WCA ID related functions as per request.