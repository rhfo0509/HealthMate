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
const postsCollection = collection(firestore, "posts");

export function createComment({ content, user, postId }) {
  return addDoc(collection(firestore, `posts/${postId}/comments`), {
    user,
    content,
    createdAt: serverTimestamp(),
  });
}

export function createSubComment({ content, user, postId, commentId }) {
  return addDoc(
    collection(firestore, `posts/${postId}/comments/${commentId}/subcomments`),
    {
      user,
      content,
      createdAt: serverTimestamp(),
    }
  );
}

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

export async function getSubComments({ postId, commentId }) {
  let q = query(
    collection(firestore, `posts/${postId}/comments/${commentId}/subcomments`),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  const subcomments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return subcomments;
}

export async function removeComment({ postId, commentId }) {
  await deleteDoc(
    doc(collection(firestore, `posts/${postId}/comments`), commentId)
  );
}

export async function updateComment({ postId, commentId, content }) {
  await updateDoc(
    doc(collection(firestore, `posts/${postId}/comments`), commentId),
    {
      content,
    }
  );
}
