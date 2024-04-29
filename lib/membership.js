import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
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

// export async function updatePost({ id, content }) {
//   await updateDoc(doc(postsCollection, id), {
//     content,
//   });
// }
