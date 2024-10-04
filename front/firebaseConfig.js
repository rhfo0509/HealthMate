import { initializeApp, getApps, getApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZhCoYUNG6pE8TOO2MrM-AHUvn1luR4BE",
  authDomain: "final-project-473cd.firebaseapp.com",
  databaseURL: "https://final-project-473cd.firebaseio.com",
  projectId: "final-project-473cd",
  storageBucket: "gs://final-project-473cd.appspot.com",
  // messagingSenderId: 'sender-id',
  // appId: 'app-id',
  // measurementId: 'G-measurement-id',
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
