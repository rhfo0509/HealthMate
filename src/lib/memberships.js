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

export async function createMembership(membership) {
  return await addDoc(collection(firestore, "memberships"), {
    ...membership,
    remaining: membership.count,
    status: "active",
    createdAt: serverTimestamp(),
  });
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

export async function getMembershipsByTrainer(trainerId) {
  const q = query(membershipsCollection, where("trainerId", "==", trainerId));
  const snapshot = await getDocs(q);

  const memberships = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return memberships;
}

export async function getMembershipsByMember(memberId) {
  const q = query(membershipsCollection, where("memberId", "==", memberId));
  const snapshot = await getDocs(q);

  const memberships = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return memberships;
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
      const remaining = membershipDoc.data().remaining - 1;

      await updateDoc(membershipDoc.ref, { remaining });

      if (remaining === 0) {
        await updateMembership(membershipDoc.id, { status: "expired" });
        console.log("잔여횟수가 0이기 때문에 상태를 expired로 변경");
      }
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

export async function updateMembership(id, updateField) {
  await updateDoc(doc(membershipsCollection, id), {
    ...updateField,
  });
}
