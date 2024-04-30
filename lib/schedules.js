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
  writeBatch,
  // limit,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";
import { format } from "date-fns";

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
  const { trainerId, memberId, count, startDate, days } = membership;

  // 각 해당하는 요일에 대해 스케줄을 생성해야 돼.
  // 스케줄 생성은 startDate로 지정한 날짜부터 시작이 돼.
  // 하나의 스케줄 당 count가 하나가 차감이 되고,
  // 만약 한 주가 끝났는데 count가 아직 0이 아니라면
  // 다음 주로 넘어가서 또 해당하는 요일에 대해 스케줄을 생성하면 돼.

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
  let i = count;

  // count만큼 스케줄 생성
  while (i) {
    // 각 요일에 대해 반복
    if (checkedDays.includes(currentDate.getDay())) {
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
        console.log(currentDate);
      }
    }
  }

  schedules.forEach((schedule) => {
    batch.set(doc(schedulesCollection), schedule);
  });

  batch
    .commit()
    .then(() => {
      console.log("일정 일괄 추가 완료");
    })
    .catch((error) => {
      console.error("일정 일괄 추가 중 오류 발생", error);
    });
}

export async function getMemberSchedules(memberId) {
  const q = query(
    schedulesCollection,
    where("memberId", "==", memberId),
    orderBy("date"),
    orderBy("startTime"),
    orderBy("endTime")
  );
  const snapshot = await getDocs(q);

  const schedules = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return schedules;
}

export async function getTrainerSchedules(trainerId) {
  const q = query(
    schedulesCollection,
    where("trainerId", "==", trainerId)
    // orderBy("date"),
    // orderBy("startTime"),
    // orderBy("endTime")
  );
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

export async function removeSchedulesWithMember(trainerId, memberId) {
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
