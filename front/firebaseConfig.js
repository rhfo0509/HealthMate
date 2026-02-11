import { initializeApp, getApps, getApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const initFirebase = () => {
  let app = null;
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
        experimentalForceLongPolling: true,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    app = getApp();
  }
};
