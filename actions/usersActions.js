import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

initFirebase();

const firestore = getFirestore();
const usersCollection = collection(firestore, "users");

const createUser = createAsyncThunk(
  "users/createUser",
  async ({ id, displayName, photoURL }) => {
    try {
      await setDoc(doc(usersCollection, id), {
        id,
        displayName,
        photoURL,
      });
      const userSnap = await getDoc(doc(usersCollection, id));
      return userSnap.data();
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

const getUser = createAsyncThunk("users/getUser", async (id) => {
  try {
    const userSnap = await getDoc(doc(usersCollection, id));
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.response.data);
  }
});

export { createUser, getUser };

// export function createUser({ id, displayName, photoURL }) {
//   return setDoc(doc(usersCollection, id), {
//     id,
//     displayName,
//     photoURL,
//   });
// }

// export async function getUser(id) {
//   const docRef = doc(usersCollection, id);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     return docSnap.data();
//   } else {
//     return null;
//   }
// }
