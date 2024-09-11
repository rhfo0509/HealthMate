import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();

export function createFoods(postId, foods) {
  const foodsCollectionRef = collection(firestore, `posts/${postId}/foods`);

  return addDoc(foodsCollectionRef, {
    foods,
    createdAt: serverTimestamp(),
  });
}
