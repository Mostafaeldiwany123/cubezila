import { firestore } from './firebase-config.js';

const usersCollection = firestore.collection('users');

/**
 * Creates a new user profile in Firestore.
 * @param {string} uid - User ID from Firebase Auth.
 * @param {string} username - User's chosen username.
 * @param {string} email - User's email.
 * @param {string} role - User's role (e.g., 'free_user', 'pro_user', 'admin').
 * @param {string} coins - Placeholder for coins.
 * @param {string|null} photoURL - User's photo URL, if available (e.g., from Google).
 */
export async function createUserProfile(uid, username, email, role = 'free_user', coins = '0', photoURL = null) {
  const userProfile = {
    username,
    email,
    role,
    coins,
    photoURL, // Store photoURL
    createdAt: firebase.firestore.FieldValue.serverTimestamp() // Use Firestore server timestamp
  };
  await usersCollection.doc(uid).set(userProfile);
  return userProfile;
}

/**
 * Fetches a user's profile from Firestore.
 * @param {string} uid - User ID from Firebase Auth.
 * @returns {Promise<object|null>} User profile data or null if not found.
 */
export async function getUserProfile(uid) {
  const doc = await usersCollection.doc(uid).get();
  if (doc.exists) {
    return doc.data();
  }
  return null;
}

/**
 * Updates a user's profile in Firestore.
 * @param {string} uid - User ID from Firebase Auth.
 * @param {object} updates - Object containing fields to update.
 */
export async function updateUserProfile(uid, updates) {
  await usersCollection.doc(uid).update(updates);
}

/**
 * Fetches all user profiles from Firestore.
 * Requires Firestore rules that allow admins to read the users collection.
 * @returns {Promise<Array<object>>} Array of user profile data with their UIDs.
 */
export async function getAllUsers() {
  const snapshot = await usersCollection.get();
  const users = [];
  snapshot.forEach(doc => {
    users.push({ uid: doc.id, ...doc.data() });
  });
  return users;
}

/**
 * Deletes a user's profile from Firestore.
 * NOTE: This does NOT delete the user from Firebase Authentication.
 * That requires the Admin SDK, typically in a backend environment.
 * @param {string} uid - User ID to delete.
 */
export async function deleteUserProfile(uid) {
  await usersCollection.doc(uid).delete();
}