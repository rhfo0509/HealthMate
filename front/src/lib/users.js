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

initFirebase();

const firestore = getFirestore();
const membersCollection = collection(firestore, "members");
const trainersCollection = collection(firestore, "trainers");

// 사용자 등록 함수 (회원/트레이너 구분)
export function createUser(user, role) {
  return setDoc(
    doc(role === "Member" ? membersCollection : trainersCollection, user.id),
    user
  );
}

// 사용자 조회 함수 (회원/트레이너 구분) - 사용자 ID
export async function getUser(id) {
  let user = await getDoc(doc(membersCollection, id));
  if (user.exists()) return user.data();

  user = await getDoc(doc(trainersCollection, id));
  return user.exists() ? user.data() : null;
}

// 회원 조회 함수 - 이름/전화번호
export async function getMember({ displayName, phoneNumber }) {
  try {
    const q = query(
      membersCollection,
      where("displayName", "==", displayName),
      where("phoneNumber", "==", phoneNumber)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty ? snapshot.docs[0].data() : null;
  } catch (error) {
    console.error("회원 정보 확인 중 오류 발생:", error);
    return null;
  }
}

// 사용자 역할 조회 함수
export async function getRole(id) {
  const snapshot = await getDoc(doc(membersCollection, id));
  return snapshot.exists() ? "member" : "trainer";
}

// 사용자 업데이트 함수
export async function updateUser({ userId, updateField }) {
  const role = await getRole(userId);
  await updateDoc(
    doc(role === "member" ? membersCollection : trainersCollection, userId),
    { ...updateField }
  );
}

// 트레이너에게 회원 추가하는 함수
export async function addMemberToTrainer(trainerId, memberId) {
  try {
    const snapshot = await getDoc(doc(membersCollection, memberId));

    const trainerMembersCollection = collection(
      firestore,
      `trainers/${trainerId}/members`
    );

    await setDoc(doc(trainerMembersCollection, memberId), snapshot.data());
  } catch (error) {
    console.error("회원 추가 중 오류 발생", error);
  }
}

// 트레이너의 회원 목록 불러오는 함수
export async function getMembersByTrainer(trainerId) {
  const trainerMembersCollection = collection(
    firestore,
    `trainers/${trainerId}/members`
  );
  const snapshot = await getDocs(trainerMembersCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 트레이너에게 회원 삭제하는 함수
export async function removeMemberByTrainer(trainerId, memberId) {
  await deleteDoc(
    doc(collection(firestore, `trainers/${trainerId}/members`), memberId)
  );
}
