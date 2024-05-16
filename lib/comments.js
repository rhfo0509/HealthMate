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

export function createComment({ content, author, postId }) {
  return addDoc(collection(firestore, `posts/${postId}/comments`), {
    author,
    content,
    createdAt: serverTimestamp(),
  });
}

export function createSubComment({ content, author, postId, commentId }) {
  return addDoc(
    collection(firestore, `posts/${postId}/comments/${commentId}/subcomments`),
    {
      author,
      content,
      createdAt: serverTimestamp(),
    }
  );
}

export async function getComments(postId) {
  let q = query(
    collection(firestore, `posts/${postId}/comments`),
    orderBy("createdAt", "asc")
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

export async function removeSubComment({ postId, commentId, subCommentId }) {
  await deleteDoc(
    doc(
      collection(
        firestore,
        `posts/${postId}/comments/${commentId}/subcomments`
      ),
      subCommentId
    )
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

export async function updateSubComment({
  postId,
  commentId,
  subCommentId,
  content,
}) {
  await updateDoc(
    doc(
      collection(
        firestore,
        `posts/${postId}/comments/${commentId}/subcomments`
      ),
      subCommentId
    ),
    {
      content,
    }
  );
}
