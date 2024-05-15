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
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { initFirebase } from "../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const notificationsCollection = collection(firestore, "notifications");

export async function createNotification(receiverId, message, data) {
  await addDoc(notificationsCollection, {
    receiverId,
    message,
    data,
    createdAt: serverTimestamp(),
  });
}

export async function getNotifications(userId) {
  let q = query(
    notificationsCollection,
    orderBy("createdAt", "desc"),
    where("receiverId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return notifications;
}
