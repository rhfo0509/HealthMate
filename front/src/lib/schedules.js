import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { format } from "date-fns";
import { decreaseMembershipCount, updateMembership } from "./memberships";
import { initFirebase, getFirebaseFunctions } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const schedulesCollection = collection(firestore, "schedules");

/**
 * 회원권 정보를 기반으로 일정을 생성 (Cloud Function 호출)
 */
export async function createSchedulesWithMembership(membership) {
  const functions = getFirebaseFunctions();
  const create = httpsCallable(functions, "createSchedulesWithMembership");
  const result = await create({ membership });
  return result.data;
}

// 회원의 모든 일정을 불러오는 함수
export async function getMemberSchedules(memberId) {
  const q = query(schedulesCollection, where("memberId", "==", memberId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// 트레이너의 모든 일정을 불러오는 함수
export async function getTrainerSchedules(trainerId) {
  const q = query(schedulesCollection, where("trainerId", "==", trainerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// 일정 삭제 함수 (Cloud Function 호출)
export async function removeSchedule(id, isCompleted) {
  const functions = getFirebaseFunctions();
  const remove = httpsCallable(functions, "removeSchedule");
  await remove({ scheduleId: id, isCompleted });
}

// 회원의 모든 일정을 삭제하는 함수 (직접 Firestore)
export async function removeSchedules(memberId) {
  try {
    const q = query(schedulesCollection, where("memberId", "==", memberId));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("회원 및 연관된 일정 삭제 완료");
  } catch (error) {
    console.error("회원 및 연관된 일정 삭제 실패:", error);
  }
}

// 일정 업데이트 함수 (Cloud Function 호출)
export async function updateSchedule(id, updateField) {
  const functions = getFirebaseFunctions();
  const update = httpsCallable(functions, "updateSchedule");
  await update({ scheduleId: id, updateField });
}
