import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const membersCollection = collection(firestore, "members");
const trainersCollection = collection(firestore, "trainers");

export function createUser(user, role) {
  return role === "Member"
    ? setDoc(doc(membersCollection, user.id), user)
    : setDoc(doc(trainersCollection, user.id), user);
}

export async function getUser(id) {
  let docRef = doc(membersCollection, id);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    docRef = doc(trainersCollection, id);
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }
}

export async function addMemberToTrainer(trainerId, member) {
  const { name, phoneNumber } = member;
  const q = query(
    membersCollection,
    where("displayName", "==", name),
    where("phoneNumber", "==", phoneNumber)
  );
  const docSnap = await getDocs(q);

  if (!docSnap.empty) {
    const memberDoc = docSnap.docs[0];
    const trainerMembersCollection = collection(
      firestore,
      `trainers/${trainerId}/members`
    );
    setDoc(doc(trainerMembersCollection, memberDoc.id), memberDoc.data())
      .then(() => {
        console.log(`회원 추가 완료`, memberDoc.id);
      })
      .catch((e) => console.error("회원 추가 실패:", e));
  } else {
    console.log("회원이 존재하지 않음");
  }
}

export async function getMembersByTrainer(trainerId) {
  // let q = query(
  //   collection(firestore, `trainers/${trainerId}/members`),
  //   orderBy("createdAt", "desc")
  // );
  const docRef = collection(firestore, `trainers/${trainerId}/members`);
  const docSnap = await getDocs(docRef);
  const members = docSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return members;
}

export async function removeMemberByTrainer(trainerId, memberId) {
  await deleteDoc(
    doc(collection(firestore, `trainers/${trainerId}/members`), memberId)
  );
}
