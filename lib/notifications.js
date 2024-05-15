import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
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

export async function createNotification({
  senderId,
  receiverId,
  message,
  data,
}) {
  await addDoc(notificationsCollection, {
    senderId,
    receiverId,
    message,
    data,
    createdAt: serverTimestamp(),
    clicked: false,
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

export async function updateNotification(id) {
  await updateDoc(doc(notificationsCollection, id), {
    clicked: true,
  });
}
