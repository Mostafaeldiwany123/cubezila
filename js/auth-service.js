import { auth, googleProvider } from './firebase-config.js';
import { createUserProfile, getUserProfile } from './user-service.js';

/**
 * Registers a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<object>} User credential and profile data.
 */
export async function registerWithEmailPassword(email, password, username) {
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;
  const userProfile = await createUserProfile(user.uid, username, email, 'free_user', '0', user.photoURL);
  return { user, userProfile };
}

/**
 * Logs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} User credential.
 */
export async function loginWithEmailPassword(email, password) {
  return await auth.signInWithEmailAndPassword(email, password);
}

/**
 * Logs in a user with Google.
 * @returns {Promise<object>} User credential.
 */
export async function signInWithGoogle() {
  const userCredential = await auth.signInWithPopup(googleProvider);
  const user = userCredential.user;

  // Check if user profile exists, if not, create it
  const userProfile = await getUserProfile(user.uid);
  if (!userProfile) {
    await createUserProfile(user.uid, user.displayName || user.email.split('@')[0], user.email, 'free_user', '0', user.photoURL);
  }
  return userCredential;
}

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  await auth.signOut();
}

/**
 * Sets up an authentication state change listener.
 * @param {function(firebase.User|null)} callback - Function to call when auth state changes.
 */
export function onAuthStateChange(callback) {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      // Combine Firebase Auth user object with Firestore profile data
      callback({ ...user, profile: userProfile });
    } else {
      callback(null);
    }
  });
}