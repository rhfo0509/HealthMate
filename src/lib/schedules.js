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
import { format, subDays } from "date-fns";
import { decreaseMembershipCount, updateMembership } from "./memberships";

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
  await addDoc(schedulesCollection, {
    date,
    startTime,
    endTime,
    trainerId,
    memberId,
    createdAt: serverTimestamp(),
  });
}

export async function createSchedulesWithMembership(membership) {
  const { trainerId, memberId, remaining, startDate, days, id } = membership;

  let currentDate = new Date(startDate);

  const daysNumber = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };

  const batch = writeBatch(firestore);
  const schedules = [];
  const checkedDays = Object.keys(days).map((day) => daysNumber[day]);
  let i = remaining;

  // remaining만큼 스케줄 생성
  while (i) {
    // 각 요일에 대해 반복
    if (checkedDays.includes(currentDate.getDay())) {
      console.log(currentDate);
      i--;
      // 해당 요일에 대한 시작 및 종료 시간 가져오기
      const daysName = Object.keys(daysNumber).find(
        (key) => daysNumber[key] === currentDate.getDay()
      );
      const { startTime, endTime } = days[daysName];
      schedules.push({
        date: format(currentDate, "yyyy-MM-dd"),
        startTime,
        endTime,
        trainerId,
        memberId,
        createdAt: serverTimestamp(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      while (!checkedDays.includes(currentDate.getDay())) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  schedules.forEach((schedule) => {
    batch.set(doc(schedulesCollection), schedule);
  });

  batch
    .commit()
    .then(() => {
      updateMembership(id, {
        endDate: format(subDays(currentDate, 1), "yyyy-MM-dd"),
      });
      console.log("일정 일괄 추가 완료");
    })
    .catch((error) => {
      console.error("일정 일괄 추가 중 오류 발생", error);
    });
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
