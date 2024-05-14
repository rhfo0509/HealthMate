import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";
import { createMembership } from "./memberships";
import { createSchedulesWithMembership } from "./schedules";

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

export async function getRole(id) {
  let docRef = doc(membersCollection, id);
  let docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return "member";
  } else {
    return "trainer";
  }
}

export async function addMemberToTrainer(trainerId, member) {
  const { name, phoneNumber, membershipInfo } = member;
  try {
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
      await setDoc(
        doc(trainerMembersCollection, memberDoc.id),
        memberDoc.data()
      ).then(() => {
        const { count, startYear, startMonth, startDay, days } = membershipInfo;
        const formatDays = {};
        Object.entries(days).forEach(([day, data]) => {
          if (data.checked) {
            formatDays[day] = {
              startTime: `${data.startHours}:${data.startMinutes}`,
              endTime: `${data.endHours}:${data.endMinutes}`,
            };
          }
        });
        const formatMembership = {
          count,
          remaining: count,
          startDate: `${startYear}-${startMonth}-${startDay}`,
          days: formatDays,
          memberId: memberDoc.id,
          trainerId,
        };
        createMembership(formatMembership).then(async (membershipDoc) => {
          const snapshot = await getDoc(membershipDoc);
          createSchedulesWithMembership({
            ...snapshot.data(),
            id: membershipDoc.id,
          });
        });
      });
    } else {
      console.log("회원이 존재하지 않음");
    }
  } catch (error) {
    console.error("회원 추가 중 오류 발생", error);
  }
}

export async function getMembersByTrainer(trainerId) {
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
