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
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const routinesCollection = collection(firestore, "routines");

// routines 데이터를 추가하는 함수
export function createRoutines({
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

// 특정 routines 문서를 삭제하는 함수
export async function removeRoutines(id) {
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
