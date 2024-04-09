import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  updateDoc,
  doc,
  // limit,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const schedulesCollection = collection(firestore, "schedules");

export async function createSchedule({
  memberId,
  trainerId,
  date,
  startTime,
  endTime,
}) {
  const schedule = await addDoc(schedulesCollection, {
    date,
    startTime,
    endTime,
    trainerId,
    memberId,
    createdAt: serverTimestamp(),
  });
  return schedule;
}

export async function getMemberSchedules(memberId) {
  const q = query(schedulesCollection, where("memberId", "==", memberId));
  const snapshot = await getDocs(q);

  const schedules = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return schedules;
}

export async function getTrainerSchedules(trainerId) {
  const q = query(schedulesCollection, where("trainerId", "==", trainerId));
  const snapshot = await getDocs(q);

  const schedules = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return schedules;
}

export async function removeSchedule(id) {
  await deleteDoc(doc(schedulesCollection, id));
}

export async function updateSchedule(id, updateField) {
  await updateDoc(doc(schedulesCollection, id), {
    ...updateField,
  });
}
