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
      localStorage.removeItem('user_profile'); // Explicitly remove on logout action
      localStorage.removeItem('user_role'); // Also remove role
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
    if (userContent) userContent.style.display = 'flex'; // Ensure it uses flex for dropdown
    if (sidebarGuestContent) sidebarGuestContent.style.display = 'none';
    if (sidebarUserContent) sidebarUserContent.style.display = 'block';

    const username = user.profile.username || user.displayName || 'User';
    if (userNameDisplay) {
      userNameDisplay.textContent = username;
    }
    if (userAvatar) {
        const avatarSrc = user.photoURL || user.profile.photoURL;
        let finalAvatarUrl;
        if (avatarSrc) {
            userAvatar.src = avatarSrc;
            finalAvatarUrl = avatarSrc;
        } else {
            const initials = (username).charAt(0).toUpperCase();
            const placeholderUrl = `https://via.placeholder.com/32/007bff/ffffff?text=${initials}`;
            userAvatar.src = placeholderUrl;
            finalAvatarUrl = placeholderUrl;
        }
        userAvatar.alt = username;

        // Store in localStorage
        const profileData = {
            username: username,
            avatarUrl: finalAvatarUrl,
            role: user.profile.role // Store role here too
        };
        localStorage.setItem('user_profile', JSON.stringify(profileData));
        localStorage.setItem('user_role', user.profile.role); // Store role separately for quick access
    }
  } else {
    // User is signed out
    if (guestContent) guestContent.style.display = 'flex'; // Use flex
    if (userContent) userContent.style.display = 'none';
    if (sidebarGuestContent) sidebarGuestContent.style.display = 'block';
    if (sidebarUserContent) sidebarUserContent.style.display = 'none';

    if (userNameDisplay) userNameDisplay.textContent = 'User'; // Reset to default
    if (userAvatar) {
        userAvatar.src = '/img/noprof.png'; // Default image with root-relative path
        userAvatar.alt = 'Profile';
    }
    // Remove from localStorage
    localStorage.removeItem('user_profile');
    localStorage.removeItem('user_role');
  }
}

// Function to check localStorage and update UI immediately
function initializeUIFromLocalStorage() {
    try {
        const profileData = JSON.parse(localStorage.getItem('user_profile'));
        if (profileData && profileData.username) {
            // Simulate a user object structure for immediate UI update
            const mockUser = {
                profile: profileData,
                displayName: profileData.username,
                photoURL: profileData.avatarUrl
            };
            updateUIForAuthState(mockUser);
        }
    } catch (e) {
        console.error("Error reading profile from localStorage:", e);
    }
}

// 1. Run immediate UI update
initializeUIFromLocalStorage();

// 2. Auth state observer (runs asynchronously and overwrites local data if needed)
onAuthStateChange((user) => {
  updateUIForAuthState(user);
  // Additional UI updates for specific pages can be handled here or in page-specific scripts
});