import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { initFirebase } from "../firebaseConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

initFirebase();

const auth = getAuth();

const logIn = createAsyncThunk("auth/logIn", async (info) => {
  try {
    const { email, password } = info;
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // return credential;
    console.log('credential.user', credential.user);
    return credential.user;
  } catch (error) {
    throw new Error(error.response.data);
  }
});

const logOut = createAsyncThunk("auth/logOut", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.response.data);
  }
});

const signUp = createAsyncThunk("auth/signUp", async (info) => {
  try {
    const { email, password } = info;
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // return credential;
    return credential.user;
  } catch (error) {
    throw new Error(error.response.data);
  }
});

export { logIn, logOut, signUp };
