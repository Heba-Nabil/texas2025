import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
// importScripts '../../public/firebase-messaging-sw'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "texas-chicken-arabia.firebaseapp.com",
  databaseURL: "https://texas-chicken-arabia.firebaseio.com",
  projectId: "texas-chicken-arabia",
  storageBucket: "texas-chicken-arabia.firebasestorage.app",
  messagingSenderId: "815437862439",
  appId: "1:815437862439:web:786578eaef87a3b139e002",
  measurementId: "G-JEF087KVQV",
};

// Initialize the Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get the Firebase Messaging instance
const messaging = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log("Firebase messaging is not supported");
      return null;
    }
    if (typeof window !== "undefined") {
      return getMessaging(app);
    }
    return null;
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return null;
  }
};

// Function to fetch the FCM token
export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      console.log("token", token);
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
