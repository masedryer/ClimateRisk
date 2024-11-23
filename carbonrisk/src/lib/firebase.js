// Import necessary Firebase functions from Firebase SDK v9+ (modular SDK)
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Firebase config object with environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (only initialize if not already initialized)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Initialize Firebase app
} else {
  app = getApps()[0]; // Use the existing Firebase app
}

// Initialize Firestore
const db = getFirestore(app);

// Log the Firebase config values to verify they are being loaded correctly
console.log("Firebase Config Environment Variables: ", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});

// Function to test Firestore connection
const testConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "yearlydata"));
    if (!querySnapshot.empty) {
      console.log("Firestore connected successfully!");
    } else {
      console.log(
        "Firestore connection successful, but no data found in 'yearlydata' collection."
      );
    }
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
  }
};

// Run the test connection function immediately after initialization
testConnection();

// Export Firestore functions for use in other parts of the app
export { db, collection, getDocs, addDoc, app };
