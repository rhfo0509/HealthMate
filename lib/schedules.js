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
  return addDoc(schedulesCollection, {
    date,
    startTime,
    endTime,
    trainerId,
    memberId,
    createdAt: serverTimestamp(),
  });
}

export async function getMemberSchedules(memberId) {
  const memberSchedulesCollection = collection(
    firestore,
    `members/${memberId}/schedules`
  );
  // const q = query(
  //   memberSchedulesCollection,
  //   orderBy("date"),
  //   orderBy("startTime")
  // );
  // const snapshot = await getDocs(q);
  const snapshot = await getDocs(memberSchedulesCollection);

  const schedules = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return schedules;
}

export async function getTrainerSchedules(trainerId) {
  const trainerSchedulesCollection = collection(
    firestore,
    `trainers/${trainerId}/schedules`
  );
  // const q = query(
  //   trainerSchedulesCollection,
  //   orderBy("date"),
  //   orderBy("startTime")
  // );
  // const snapshot = await getDocs(q);
  const snapshot = await getDocs(trainerSchedulesCollection);

  const schedules = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return schedules;
}

export async function removeSchedule(id) {
  await deleteDoc(doc(schedulesCollection, id));
}

export async function updateSchedule({ id, description }) {
  await updateDoc(doc(schedulesCollection, id), {
    description,
  });
}
