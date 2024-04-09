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

export async function addMemberToTrainer(trainerId, memberId) {
  const docRef = doc(membersCollection, memberId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await setDoc(
      doc(collection(firestore, `trainers/${trainerId}/members`), memberId),
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

export async function removeMemberByTrainer(trainerId, memberId) {
  console.log(trainerId, memberId);
  console.log(
    doc(collection(firestore, `trainers/${trainerId}/members`), memberId)
  );
  await deleteDoc(
    doc(collection(firestore, `trainers/${trainerId}/members`), memberId)
  );
}

// export async function addScheduleToMember(memberId, scheduleId) {
//   const docRef = doc(firestore, "schedules", scheduleId);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     await setDoc(
//       doc(collection(firestore, `members/${memberId}/schedules`), scheduleId),
//       docSnap.data()
//     );
//   } else {
//     console.log("회원이 존재하지 않음");
//   }
// }

// export async function addScheduleToTrainer(trainerId, scheduleId) {
//   const docRef = doc(firestore, "schedules", scheduleId);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     await setDoc(
//       doc(collection(firestore, `trainers/${trainerId}/schedules`), scheduleId),
//       docSnap.data()
//     );
//   } else {
//     console.log("트레이너가 존재하지 않음");
//   }
// }
