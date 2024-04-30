import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const membershipsCollection = collection(firestore, "memberships");

export function createMembership(membership) {
  return addDoc(collection(firestore, "memberships"), membership);
}

export async function getMembership(trainerId, memberId) {
  const q = query(
    membershipsCollection,
    where("trainerId", "==", trainerId),
    where("memberId", "==", memberId)
  );
  const membershipSnapshot = await getDocs(q);
  if (!membershipSnapshot.empty) {
    const membershipDoc = membershipSnapshot.docs[0];
    return { ...membershipDoc.data(), id: membershipDoc.id };
  } else {
    console.log("해당 회원에게 회원권이 존재하지 않습니다.");
  }
}

export async function decreaseMembershipCount(trainerId, memberId) {
  try {
    const q = query(
      membershipsCollection,
      where("trainerId", "==", trainerId),
      where("memberId", "==", memberId)
    );
    const membershipSnapshot = await getDocs(q);
    if (!membershipSnapshot.empty) {
      const membershipDoc = membershipSnapshot.docs[0];

      await updateDoc(membershipDoc.ref, {
        remaining: --membershipDoc.data().remaining,
      });

      console.log("회원권 잔여횟수 차감 완료");
    } else {
      console.log("해당 회원에게 회원권이 존재하지 않습니다.");
    }
  } catch (error) {
    console.error("회원권 잔여횟수 차감 중 오류 발생:", error);
  }
}

export async function removeMembershipWithMember(trainerId, memberId) {
  try {
    const q = query(
      membershipsCollection,
      where("trainerId", "==", trainerId),
      where("memberId", "==", memberId)
    );
    const membershipSnapshot = await getDocs(q);

    if (!membershipSnapshot.empty) {
      await deleteDoc(membershipSnapshot.docs[0].ref);
      console.log("회원 및 회원권 삭제 완료");
    } else {
      console.log("해당 회원에게 회원권이 존재하지 않습니다.");
    }
  } catch (error) {
    console.error("회원 및 회원권 삭제 실패:", error);
  }
}
