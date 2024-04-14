import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const postsCollection = collection(firestore, "posts");

// export function createPost({
//   user,
//   photoURL,
//   content,
//   memberId,
//   postType,
// }) {
//   return addDoc(postsCollection, {
//     user,
//     photoURL,
//     content,
//     memberId,
//     postType,
//     createdAt: serverTimestamp(),
//   });
// }

export function createComment({ content, user, postId }) {
  return addDoc(collection(firestore, `posts/${postId}/comments`), {
    user,
    content,
    createdAt: serverTimestamp(),
  });
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

export async function getComments(postId) {
  let q = query(
    collection(firestore, `posts/${postId}/comments`),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const comments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return comments;
}

// export async function removePost(id) {
//   await deleteDoc(doc(postsCollection, id));
// }

export async function removeComment(id) {
  await deleteDoc(doc(collection(firestore, `posts/${postId}/comments`), id));
}

// export async function updatePost({ id, content }) {
//   await updateDoc(doc(postsCollection, id), {
//     content,
//   });
// }

export async function updateComment({ id, content }) {
  await updateDoc(doc(collection(firestore, `posts/${postId}/comments`), id), {
    content,
  });
}
