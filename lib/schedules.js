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

export async function deleteMemberWithSchedules(trainerId, memberId) {
  try {
    // 1. 회원과 연관된 일정을 쿼리하여 해당 일정의 문서 ID 목록을 가져옵니다.
    const q = query(
      schedulesCollection,
      where("trainerId", "==", trainerId),
      where("memberId", "==", memberId)
    );
    const querySnapshot = await getDocs(q);
    const scheduleDeletePromises = [];

    // 2. 각 일정 문서를 순회하면서 삭제 작업을 수행합니다.
    querySnapshot.forEach((doc) => {
      scheduleDeletePromises.push(deleteDoc(doc.ref));
    });

    // 모든 일정 삭제 작업을 병렬로 실행합니다.
    await Promise.all(scheduleDeletePromises);

    console.log("회원 및 연관된 일정 삭제 완료");
  } catch (error) {
    console.error("회원 및 연관된 일정 삭제 실패:", error);
  }
}
