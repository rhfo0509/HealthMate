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
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const firestore = getFirestore();
const notificationsCollection = collection(firestore, "notifications");

// 알림 생성 함수
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

// 알림 가져오는 함수
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

// 알림 업데이트 함수
export async function updateNotification(id) {
  await updateDoc(doc(notificationsCollection, id), {
    clicked: true,
  });
}
