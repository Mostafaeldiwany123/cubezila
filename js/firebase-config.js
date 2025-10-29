// Firebase configuration (replace with your actual project config)

export const firebaseConfig = {
  apiKey: "AIzaSyA2ZiQatq3ItYAAtqKMs8xfLm7D2P3E2NE",
  authDomain: "cube-house.firebaseapp.com",
  projectId: "cube-house",
  storageBucket: "cube-house.firebasestorage.app",
  messagingSenderId: "762132214545",
  appId: "1:762132214545:web:1faef4f3c412ef7acc52b0",
  measurementId: "G-Q5CZ3J3Q6Q"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firebase services
export const auth = firebase.auth();
export const firestore = firebase.firestore(); // Initialize and export Firestore
export const googleProvider = new firebase.auth.GoogleAuthProvider();