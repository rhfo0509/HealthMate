import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const foodsCollection = collection(firestore, "foods");

// 음식 데이터 생성 함수
export function createFoods({ userId, relatedUserId, postId, foods }) {
  return addDoc(foodsCollection, {
    userId,
    relatedUserId,
    postId,
    foods,
    createdAt: serverTimestamp(),
  });
}

// 특정 게시글에 해당하는 음식 데이터 삭제 함수
export async function removeFoods(postId) {
  const q = query(foodsCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await deleteDoc(doc.ref);
  }
}

// 특정 게시글에 해당하는 음식 데이터 업데이트 함수
export async function updateFoods(postId, foods) {
  const q = query(foodsCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    await updateDoc(doc.ref, { foods });
  }
}

// 특정 게시글에 해당하는 음식 데이터 가져오는 함수
export async function getFoods(postId) {
  const q = query(foodsCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
