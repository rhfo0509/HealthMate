import { initializeApp, getApps, getApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

let functions = null;
let auth = null;

export const initFirebase = () => {
  let app = null;
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
        experimentalForceLongPolling: true,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }
  // us-central1 region 설정
  functions = getFunctions(app, 'us-central1');
};

export const getFirebaseFunctions = () => {
  if (!functions) {
    initFirebase();
  }
  return functions;
};

export const getFirebaseAuth = () => {
  if (!auth) {
    initFirebase();
  }
  return auth;
};
