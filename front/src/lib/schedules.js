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
import { format } from "date-fns";
import { decreaseMembershipCount, updateMembership } from "./memberships";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const schedulesCollection = collection(firestore, "schedules");

/**
 * 회원권 정보를 기반으로 일정을 생성하고,
 * 생성된 일정에 따라 회원권 종료일을 업데이트하는 함수
 */
export async function createSchedulesWithMembership(membership) {
  const { trainerId, memberId, remaining, startDate, schedules, id } =
    membership;
  const batch = writeBatch(firestore);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const checkedDays = schedules.map((schedule) =>
    dayNames.indexOf(schedule.day)
  );
  let currentDate = new Date(startDate);

  for (let i = 0; i < remaining; i++) {
    // 해당 스케줄 요일이 나올 때까지 날짜를 이동
    while (!checkedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const scheduleForDay = schedules.find(
      (schedule) => schedule.day === dayNames[currentDate.getDay()]
    );
    if (scheduleForDay) {
      batch.set(doc(schedulesCollection), {
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: scheduleForDay.startTime,
        trainerId,
        memberId,
        createdAt: serverTimestamp(),
      });
    }
    // 다음 스케줄을 위해 날짜 이동
    currentDate.setDate(currentDate.getDate() + 1);
  }

  try {
    await batch.commit();
    await updateMembership(id, { endDate: format(currentDate, "yyyy-MM-dd") });
    console.log("일정 추가 완료");
  } catch (error) {
    console.error("일정 추가 중 오류 발생:", error);
  }
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

// 일정 삭제 함수
export async function removeSchedule(id, isCompleted) {
  try {
    if (isCompleted) {
      const scheduleDoc = await getDoc(doc(schedulesCollection, id));
      const { trainerId, memberId } = scheduleDoc.data();
      // 완료된 일정인 경우 회원권 잔여 횟수를 차감함
      await decreaseMembershipCount(trainerId, memberId);
    }
    await deleteDoc(doc(schedulesCollection, id));
    console.log("일정 삭제 완료");
  } catch (error) {
    console.error("일정 삭제 중 오류 발생:", error);
  }
}

// 회원의 모든 일정을 삭제하는 함수
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

// 일정 업데이트 함수
export async function updateSchedule(id, updateField) {
  await updateDoc(doc(schedulesCollection, id), {
    ...updateField,
  });
}
