import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";
import { createMembership } from "./memberships";
import { createSchedulesWithMembership } from "./schedules";

initFirebase();

const firestore = getFirestore();
const membersCollection = collection(firestore, "members");
const trainersCollection = collection(firestore, "trainers");

// 사용자 등록 (회원/트레이너 구분)
export function createUser(user, role) {
  const targetCollection =
    role === "Member" ? membersCollection : trainersCollection;
  return setDoc(doc(targetCollection, user.id), user);
}

// 사용자 정보 조회 (회원/트레이너 구분)
export async function getUser(id) {
  let user = await getDoc(doc(membersCollection, id));
  if (user.exists()) return user.data();

  user = await getDoc(doc(trainersCollection, id));
  return user.exists() ? user.data() : null;
}

// 이름과 전화번호로 회원 조회
export async function getMember(profile) {
  const { displayName, phoneNumber } = profile;
  try {
    const q = query(
      membersCollection,
      where("displayName", "==", displayName),
      where("phoneNumber", "==", phoneNumber)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
  } catch (error) {
    console.error("회원 정보 확인 중 오류 발생:", error);
    return null;
  }
}

// 사용자 역할 조회
export async function getRole(id) {
  const docRef = doc(membersCollection, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? "member" : "trainer";
}

// 사용자 정보 업데이트
export async function updateUser({ userId, updateField }) {
  const role = await getRole(userId);
  await updateDoc(
    doc(role === "member" ? membersCollection : trainersCollection, userId),
    { ...updateField }
  );
}

// 트레이너에 회원 추가
export async function addMemberToTrainer(trainerId, memberId) {
  try {
    const docRef = doc(membersCollection, memberId);
    const docSnap = await getDoc(docRef);

    const trainerMembersCollection = collection(
      firestore,
      `trainers/${trainerId}/members`
    );

    await setDoc(doc(trainerMembersCollection, memberId), docSnap.data());
  } catch (error) {
    console.error("회원 추가 중 오류 발생", error);
  }
}

// 트레이너의 회원 목록 조회
export async function getMembersByTrainer(trainerId) {
  const trainerMembersCollection = collection(
    firestore,
    `trainers/${trainerId}/members`
  );
  const docSnap = await getDocs(trainerMembersCollection);
  return docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 트레이너의 회원 삭제
export async function removeMemberByTrainer(trainerId, memberId) {
  await deleteDoc(
    doc(collection(firestore, `trainers/${trainerId}/members`), memberId)
  );
}
