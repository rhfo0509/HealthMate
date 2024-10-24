import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  deleteDoc,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const membershipsCollection = collection(firestore, "memberships");

// 회원권 생성 함수
export async function createMembership(membership) {
  return await addDoc(membershipsCollection, {
    ...membership,
    remaining: membership.count,
    status: "active",
    createdAt: serverTimestamp(),
  });
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

// 회원권 잔여 횟수 1 차감 함수
export async function decreaseMembershipCount(trainerId, memberId) {
  const q = query(
    membershipsCollection,
    where("trainerId", "==", trainerId),
    where("memberId", "==", memberId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("해당 회원에게 회원권이 존재하지 않습니다.");
    return;
  }

  const membershipDoc = snapshot.docs[0];
  const remaining = membershipDoc.data().remaining - 1;
  await updateDoc(membershipDoc.ref, { remaining });

  if (remaining === 0) {
    await updateMembership(membershipDoc.id, { status: "expired" });
    console.log("잔여횟수가 0이기 때문에 상태를 expired로 변경");
  }
  console.log("회원권 잔여횟수 차감 완료");
}

// 회원권 삭제 함수
export async function removeMembership(trainerId, memberId) {
  const q = query(
    membershipsCollection,
    where("trainerId", "==", trainerId),
    where("memberId", "==", memberId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("해당 회원에게 회원권이 존재하지 않습니다.");
    return;
  }
  await deleteDoc(snapshot.docs[0].ref);
  console.log("회원 및 회원권 삭제 완료");
}

// 회원권 업데이트 함수
export async function updateMembership(id, updateField) {
  await updateDoc(doc(membershipsCollection, id), {
    ...updateField,
  });
}
