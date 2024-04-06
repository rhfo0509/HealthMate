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
import { initFirebase } from "../firebaseConfig";
import { createAsyncThunk } from "@reduxjs/toolkit";

initFirebase();

const firestore = getFirestore();
const postsCollection = collection(firestore, "posts");

const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ user, photoURL, description }) => {
    try {
      const newPostRef = await addDoc(postsCollection, {
        user,
        photoURL,
        description,
        createdAt: serverTimestamp(),
      });
      const newPostDoc = await getDoc(newPostRef);
      return { id: newPostDoc.id, ...newPostDoc.data() }
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
);

const getPosts = createAsyncThunk("posts/getPosts", async (userId) => {
  try {
    let q = query(postsCollection, orderBy("createdAt", "desc"));
    if (userId) {
      q = query(
        postsCollection,
        orderBy("createdAt", "desc"),
        where("user.id", "==", userId)
      );
    }
    const postSnap = await getDocs(q);
    const posts = postSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return posts;
  } catch (error) {
    throw new Error(error.response.data);
  }
});

const removePost = createAsyncThunk("posts/removePost", async (id) => {
  try {
    await deleteDoc(doc(postsCollection, id));
    return id;
  } catch (error) {
    throw new Error(error.response.data);
  }
});

const updatePost = createAsyncThunk("posts/updatePost", async ({id, description }) => {
  try {
    await updateDoc(doc(postsCollection, id), {
      description,
    });
    return id;
  } catch (error) {
    throw new Error(error.response.data);
  }
});

export { createPost, getPosts, removePost, updatePost };

// export function createPost({ user, photoURL, description }) {
//   return addDoc(postsCollection, {
//     user,
//     photoURL,
//     description,
//     createdAt: serverTimestamp(),
//   });
// }

// export async function getPosts(userId) {
//   let q = query(postsCollection, orderBy("createdAt", "desc"));
//   if (userId) {
//     q = query(
//       postsCollection,
//       orderBy("createdAt", "desc"),
//       where("user.id", "==", userId)
//     );
//   }
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

// export async function updatePost({ id, description }) {
//   await updateDoc(doc(postsCollection, id), {
//     description,
//   });
// }
