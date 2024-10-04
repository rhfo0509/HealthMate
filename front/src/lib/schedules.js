import {
  getFirestore,
  collection,
  addDoc,
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
import { initFirebase } from "../../firebaseConfig";
import { format } from "date-fns";
import { decreaseMembershipCount, updateMembership } from "./memberships";

initFirebase();

const firestore = getFirestore();
const schedulesCollection = collection(firestore, "schedules");

export async function createSchedulesWithMembership(membership) {
  const { trainerId, memberId, remaining, startDate, schedules, id } =
    membership;

  let currentDate = new Date(startDate);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const batch = writeBatch(firestore);

  // 스케줄이 포함된 요일의 숫자 배열
  const checkedDays = schedules.map((schedule) =>
    dayNames.indexOf(schedule.day)
  );

  for (let i = 0; i < remaining; i++) {
    // 현재 날짜의 요일이 스케줄이 있는 요일인지 확인
    while (!checkedDays.includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 현재 날짜의 요일과 일치하는 스케줄을 찾음
    const currentDayName = dayNames[currentDate.getDay()];
    const scheduleForDay = schedules.find(
      (schedule) => schedule.day === currentDayName
    );

    if (scheduleForDay) {
      // 스케줄 데이터 구성
      const schedule = {
        date: format(currentDate, "yyyy-MM-dd"),
        startTime: scheduleForDay.startTime,
        trainerId,
        memberId,
        createdAt: serverTimestamp(),
      };

      // Batch에 스케줄 추가
      batch.set(doc(schedulesCollection), schedule);
    }

    // 다음 스케줄 날짜로 이동
    currentDate.setDate(currentDate.getDate() + 1);
  }

  try {
    // Batch로 모든 스케줄 일괄 추가
    await batch.commit();
    // 회원권의 종료일을 최종 스케줄 날짜로 업데이트
    await updateMembership(id, { endDate: format(currentDate, "yyyy-MM-dd") });
    console.log("일정 추가 완료");
  } catch (error) {
    console.error("일정 추가 중 오류 발생:", error);
  }
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

export async function removeSchedule(id, isCompleted) {
  try {
    if (isCompleted) {
      const scheduleDoc = await getDoc(doc(schedulesCollection, id));
      const { trainerId, memberId } = scheduleDoc.data();
      await decreaseMembershipCount(trainerId, memberId);
    }
    await deleteDoc(doc(schedulesCollection, id));
    console.log("일정 삭제 완료");
  } catch (error) {
    console.error("일정 삭제 중 오류 발생:", error);
  }
}

export async function updateSchedule(id, updateField) {
  await updateDoc(doc(schedulesCollection, id), {
    ...updateField,
  });
}

export async function removeSchedulesWithMember(trainerId, memberId) {
  try {
    const q = query(
      schedulesCollection,
      where("trainerId", "==", trainerId),
      where("memberId", "==", memberId)
    );
    const querySnapshot = await getDocs(q);
    const scheduleDeletePromises = [];

    querySnapshot.forEach((doc) => {
      scheduleDeletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(scheduleDeletePromises);

    console.log("회원 및 연관된 일정 삭제 완료");
  } catch (error) {
    console.error("회원 및 연관된 일정 삭제 실패:", error);
  }
}
