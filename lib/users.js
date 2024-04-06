import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const usersCollection = collection(firestore, "users");

export function createUser({ id, displayName, photoURL }) {
  return setDoc(doc(usersCollection, id), {
    id,
    displayName,
    photoURL,
  });
}

export async function getUser(id) {
  const docRef = doc(usersCollection, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}