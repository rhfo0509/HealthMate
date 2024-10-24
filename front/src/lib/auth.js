import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updatePassword,
} from "firebase/auth";
import { initFirebase } from "../../firebaseConfig";

initFirebase();

const auth = getAuth();
export function logIn({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signUp({ email, password }) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// 앱 가동시, 로그인 상태 변경시 사용자 정보를 받아오는 함수
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function logOut() {
  return signOut(auth);
}

export function changePassword(password) {
  return updatePassword(auth.currentUser, password);
}
