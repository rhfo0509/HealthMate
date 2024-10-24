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
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();

// 댓글 생성 함수
export function createComment({ content, author, postId }) {
  return addDoc(collection(firestore, `posts/${postId}/comments`), {
    author,
    content,
    createdAt: serverTimestamp(),
  });
}

// 대댓글 생성 함수
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

// 게시글에 달린 댓글 불러오는 함수
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

// 댓글에 달린 대댓글 불러오는 함수
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

// 댓글 삭제 함수
export async function removeComment({ postId, commentId }) {
  await deleteDoc(
    doc(collection(firestore, `posts/${postId}/comments`), commentId)
  );
}

// 대댓글 삭제 함수
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

// 댓글 업데이트 함수
export async function updateComment({ postId, commentId, content }) {
  await updateDoc(
    doc(collection(firestore, `posts/${postId}/comments`), commentId),
    {
      content,
    }
  );
}

// 대댓글 업데이트 함수
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
