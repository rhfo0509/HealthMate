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
} from "firebase/firestore";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const postsCollection = collection(firestore, "posts");

export async function createPost({
  author,
  URL,
  content,
  relatedUserId,
  postType,
  dietType,
}) {
  const post = {
    author,
    URL,
    content,
    relatedUserId,
    postType,
    createdAt: serverTimestamp(),
  };

  if (dietType) {
    post.dietType = dietType;
  }

  const docRef = await addDoc(postsCollection, post);
  return docRef;
}

export async function getPosts(authorId, relatedUserId, postType) {
  let q = query(
    postsCollection,
    orderBy("createdAt", "desc"),
    where("author.id", "in", [authorId, relatedUserId]),
    where("relatedUserId", "in", [authorId, relatedUserId]),
    where("postType", "==", postType)
  );
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
