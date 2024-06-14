import { getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: "AIzaSyC40SUoo4Dxrs6gNbROYCCRi1cPoOFxPgo",
  authDomain: "seas-the-day-54d78.firebaseapp.com",
  projectId: "seas-the-day-54d78",
  storageBucket: "seas-the-day-54d78.appspot.com",
  messagingSenderId: "933871428092",
  appId: "1:933871428092:web:03f246ff0439d544635279",
  measurementId: "G-VFSH6139GM"
};

const app = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


export const FIREBASE_APP = app;
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
//const analytics = getAnalytics(app);
