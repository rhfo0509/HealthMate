import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
// const usersCollection = collection(firestore, "users");
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

export async function addMemberToTrainer(trainerId, memberId) {
  let docRef = doc(membersCollection, memberId);
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await addDoc(
      collection(firestore, `trainers/${trainerId}/members`),
      docSnap.data()
    );
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
