import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { initFirebase, getFirebaseFunctions } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const membershipsCollection = collection(firestore, "memberships");

// 회원권 생성 함수 (Cloud Function 호출)
export async function createMembership(membership) {
  const functions = getFirebaseFunctions();
  const create = httpsCallable(functions, "createMembership");
  const result = await create({ membership });
  return result.data;
}

// 회원권 가져오는 함수
export async function getMembership(memberId) {
  const q = query(membershipsCollection, where("memberId", "==", memberId));
  const snapshot = await getDocs(q);
  if (snapshot.empty)
    return console.log("해당 회원에게 회원권이 존재하지 않습니다.");
  const membershipDoc = snapshot.docs[0];
  return { ...membershipDoc.data(), id: membershipDoc.id };
}

// 트레이너에게 수강받는 회원의 회원권을 가져오는 함수
export async function getMembershipsByTrainer(trainerId) {
  const q = query(membershipsCollection, where("trainerId", "==", trainerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 회원권 잔여 횟수 1 차감 함수 (Cloud Function 호출)
export async function decreaseMembershipCount(trainerId, memberId) {
  const functions = getFirebaseFunctions();
  const decrease = httpsCallable(functions, "decreaseMembershipCount");
  const result = await decrease({ trainerId, memberId });
  return result.data;
}

// 회원권 삭제 함수 (Cloud Function 호출)
export async function removeMembership(trainerId, memberId) {
  const functions = getFirebaseFunctions();
  const remove = httpsCallable(functions, "removeMembership");
  await remove({ trainerId, memberId });
}

// 회원권 업데이트 함수 (Cloud Function 호출)
export async function updateMembership(id, updateField) {
  const functions = getFirebaseFunctions();
  const update = httpsCallable(functions, "updateMembership");
  const result = await update({ membershipId: id, updateField });
  return result.data;
}
