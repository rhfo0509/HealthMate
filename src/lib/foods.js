import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const foodsCollection = collection(firestore, "foods");

// foods 데이터를 추가하는 함수
export function createFoods({ userId, relatedUserId, postId, foods }) {
  return addDoc(foodsCollection, {
    userId,
    relatedUserId,
    postId,
    foods,
    createdAt: serverTimestamp(),
  });
}

// 특정 postId에 해당하는 foods 문서를 삭제하는 함수
export async function removeFoods(postId) {
  const q = query(foodsCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await deleteDoc(doc.ref);
  }
}

// 특정 postId에 해당하는 foods 문서를 가져오는 함수
export async function getFoods(postId) {
  const q = query(foodsCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
