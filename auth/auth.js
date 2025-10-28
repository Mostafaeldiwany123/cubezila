import { registerWithEmailPassword, loginWithEmailPassword, signInWithGoogle, logoutUser, onAuthStateChange } from '../js/auth-service.js';
import { getUserProfile } from '../js/user-service.js';

// Helper to show error messages
function showErrorMessage(message) {
  const errorMessageElement = document.getElementById('errorMessage');
  if (errorMessageElement) {
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
  }
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

    if (password !== confirmPassword) {
      showErrorMessage("Passwords don't match");
      return;
    }

    try {
      await registerWithEmailPassword(email, password, username);
      alert('Registration successful!');
      window.location.href = '../index.html'; // Redirect after successful registration
    } catch (error) {
      showErrorMessage(error.message);
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
      window.location.href = '../index.html'; // Redirect after successful login
    } catch (error) {
      showErrorMessage(error.message);
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
      window.location.href = '../index.html'; // Redirect after successful Google sign-in
    } catch (error) {
      showErrorMessage(error.message);
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
  const guestContent = document.getElementById('guest-content');
  const userContent = document.getElementById('user-content');
  const sidebarGuestContent = document.getElementById('sidebar-guest-content');
  const sidebarUserContent = document.getElementById('sidebar-user-content');
  const userNameDisplay = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');

  if (user && user.profile) {
    // User is signed in
    if (guestContent) guestContent.style.display = 'none';
    if (userContent) userContent.style.display = 'flex'; // Use flex to align items
    if (sidebarGuestContent) sidebarGuestContent.style.display = 'none';
    if (sidebarUserContent) sidebarUserContent.style.display = 'block';

    if (userNameDisplay) {
      userNameDisplay.textContent = user.profile.username || user.displayName || 'User';
    }
    if (userAvatar) {
        // Prioritize Google photoURL, then Firestore profile photoURL, then initials
        const avatarSrc = user.photoURL || user.profile.photoURL;
        if (avatarSrc) {
            userAvatar.src = avatarSrc;
            userAvatar.alt = user.profile.username || user.displayName || 'User Profile';
        } else {
            const initials = (user.profile.username || user.displayName || 'U').charAt(0).toUpperCase();
            userAvatar.src = `https://via.placeholder.com/32/007bff/ffffff?text=${initials}`; // Placeholder with initials
            userAvatar.alt = user.profile.username || user.displayName || 'User Profile';
        }
    }
  } else {
    // User is signed out
    if (guestContent) guestContent.style.display = 'flex'; // Use flex
    if (userContent) userContent.style.display = 'none';
    if (sidebarGuestContent) sidebarGuestContent.style.display = 'block';
    if (sidebarUserContent) sidebarUserContent.style.display = 'none';

    if (userNameDisplay) userNameDisplay.textContent = 'User'; // Reset to default
    if (userAvatar) {
        userAvatar.src = '../img/noprof.png'; // Default image
        userAvatar.alt = 'Profile';
    }
  }
}

// Auth state observer
onAuthStateChange((user) => {
  updateUIForAuthState(user);
  // Additional UI updates for specific pages can be handled here or in page-specific scripts
});