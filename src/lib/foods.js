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
import { Timestamp } from "firebase/firestore";

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

// 모든 foods 데이터를 가져오는 함수
export async function getFoods(userId, relatedUserId) {
  let q = query(
    foodsCollection,
    where("userId", "in", [userId, relatedUserId]),
    where("relatedUserId", "in", [userId, relatedUserId])
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
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

// 특정 날짜의 foods 데이터를 가져오는 함수
export async function getFoodsByDate(targetDate) {
  const startOfDay = Timestamp.fromDate(
    new Date(targetDate.setHours(0, 0, 0, 0))
  );
  const endOfDay = Timestamp.fromDate(
    new Date(targetDate.setHours(23, 59, 59, 999))
  );

  // 특정 날짜의 createdAt이 startOfDay와 endOfDay 사이에 있는 문서들을 가져오는 쿼리
  const q = query(
    foodsCollection,
    where("createdAt", ">=", startOfDay),
    where("createdAt", "<=", endOfDay)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data());
}
