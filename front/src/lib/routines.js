import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const routinesCollection = collection(firestore, "routines");

// 루틴 추가 함수
export function createRoutine({
  userId,
  relatedUserId,
  routineName,
  exercises,
}) {
  return addDoc(routinesCollection, {
    userId,
    relatedUserId,
    routineName,
    exercises,
    createdAt: serverTimestamp(),
  });
}

// 루틴 불러오는 함수
export async function getRoutines(id) {
  const q = query(
    routinesCollection,
    where("userId", "==", id),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  const routines = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return routines;
}

// 루틴 삭제 함수
export async function removeRoutine(id) {
  await deleteDoc(doc(routinesCollection, id));
}

// 루틴 업데이트 함수
export async function updateRoutine(id, routineData) {
  await updateDoc(doc(routinesCollection, id), routineData);
}
