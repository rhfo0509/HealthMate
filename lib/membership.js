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

// export async function getPosts(userId, memberId, postType) {
//   // let q = query(postsCollection, orderBy("createdAt", "desc"));
//   // if (userId) {
//   q = query(
//     postsCollection,
//     orderBy("createdAt", "desc"),
//     where("user.id", "==", userId),
//     where("memberId", "==", memberId),
//     where("postType", "==", postType)
//   );
//   // }
//   const snapshot = await getDocs(q);
//   const posts = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   return posts;
// }

// export async function removePost(id) {
//   await deleteDoc(doc(postsCollection, id));
// }

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

// export async function updatePost({ id, content }) {
//   await updateDoc(doc(postsCollection, id), {
//     content,
//   });
// }
