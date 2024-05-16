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
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const bodyHistoriesCollection = collection(firestore, "bodyHistories");

export async function createBodyHistory({ memberId, date, bodyData }) {
  await addDoc(bodyHistoriesCollection, {
    memberId,
    date: Timestamp.fromDate(date),
    weight: bodyData.weight,
    SMM: bodyData.SMM,
    PBF: bodyData.PBF,
  });
}

export async function getBodyHistories(memberId) {
  let q = query(
    bodyHistoriesCollection,
    orderBy("date", "asc"),
    where("memberId", "==", memberId)
  );
  const snapshot = await getDocs(q);
  const bodyHistories = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bodyHistories;
}
