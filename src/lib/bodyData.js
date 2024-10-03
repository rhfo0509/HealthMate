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

export async function createBodyData(data) {
  await addDoc(bodyDataCollection, {
    ...data,
    date: Timestamp.fromDate(data.date),
  });
}

export async function updateBodyData(id, data) {
  await updateDoc(doc(bodyDataCollection, id), {
    ...data,
    date: Timestamp.fromDate(data.date),
  });
}

export async function removeBodyData(id) {
  await deleteDoc(doc(bodyDataCollection, id));
}
