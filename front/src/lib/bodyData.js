import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const bodyDataCollection = collection(firestore, "bodyData");

// 체성분 데이터 생성 함수
export async function createBodyData(data) {
  await addDoc(bodyDataCollection, {
    ...data,
    date: Timestamp.fromDate(data.date),
  });
}

// 체성분 데이터 업데이트 함수
export async function updateBodyData(id, data) {
  await updateDoc(doc(bodyDataCollection, id), {
    ...data,
    date: Timestamp.fromDate(data.date),
  });
}

// 체성분 데이터 삭제 함수
export async function removeBodyData(id) {
  await deleteDoc(doc(bodyDataCollection, id));
}
