import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
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
