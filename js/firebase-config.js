// Firebase configuration (replace with your actual project config)
const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY", // IMPORTANT: Replace with your actual Firebase API Key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const firestore = firebase.firestore(); // Initialize and export Firestore
export const googleProvider = new firebase.auth.GoogleAuthProvider();