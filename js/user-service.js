import { database } from './firebase-config.js';

const usersRef = database.ref('users');

/**
 * Creates a new user profile in the database.
 * @param {string} uid - User ID from Firebase Auth.
 * @param {string} username - User's chosen username.
 * @param {string} email - User's email.
 * @param {string} role - User's role (e.g., 'free_user', 'pro_user', 'admin').
 * @param {string} coins - Placeholder for coins.
 */
export async function createUserProfile(uid, username, email, role = 'free_user', coins = '0') {
  const userProfile = {
    username,
    email,
    role,
    coins,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };
  await usersRef.child(uid).set(userProfile);
  return userProfile;
}

/**
 * Fetches a user's profile from the database.
 * @param {string} uid - User ID from Firebase Auth.
 * @returns {Promise<object|null>} User profile data or null if not found.
 */
export async function getUserProfile(uid) {
  const snapshot = await usersRef.child(uid).once('value');
  return snapshot.val();
}

/**
 * Updates a user's profile in the database.
 * @param {string} uid - User ID from Firebase Auth.
 * @param {object} updates - Object containing fields to update.
 */
export async function updateUserProfile(uid, updates) {
  await usersRef.child(uid).update(updates);
}