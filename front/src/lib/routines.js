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

// routines 문서를 추가하는 함수
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

// 특정 routines 문서를 수정하는 함수
export async function updateRoutine(id, routineData) {
  await updateDoc(doc(routinesCollection, id), routineData);
}

// 특정 routines 문서를 삭제하는 함수
export async function removeRoutine(id) {
  await deleteDoc(doc(routinesCollection, id));
}

// 본인이 등록한 루틴을 불러오는 함수
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
