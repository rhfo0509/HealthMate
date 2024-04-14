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
  // limit,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

// export const PAGE_SIZE = 3;
const firestore = getFirestore();
const postsCollection = collection(firestore, "posts");

export function createPost({ user, photoURL, content, memberId, postType }) {
  return addDoc(postsCollection, {
    user,
    photoURL,
    content,
    memberId,
    postType,
    createdAt: serverTimestamp(),
  });
}

export async function getPosts(userId, memberId, postType) {
  // let q = query(postsCollection, orderBy("createdAt", "desc"));
  // if (userId) {
  q = query(
    postsCollection,
    orderBy("createdAt", "desc"),
    where("user.id", "==", userId),
    where("memberId", "==", memberId),
    where("postType", "==", postType)
  );
  // }
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return posts;
}

export async function removePost(id) {
  await deleteDoc(doc(postsCollection, id));
}

export async function updatePost({ id, content }) {
  await updateDoc(doc(postsCollection, id), {
    content,
  });
}
