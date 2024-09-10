import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const bodyDataCollection = collection(firestore, "bodyData");

export async function createBodyData({ memberId, date, bodyData }) {
  await addDoc(bodyDataCollection, {
    memberId,
    date: Timestamp.fromDate(date),
    weight: bodyData.weight,
    SMM: bodyData.SMM,
    PBF: bodyData.PBF,
  });
}

export async function removeBodyData(id) {
  await deleteDoc(doc(bodyDataCollection, id));
}
