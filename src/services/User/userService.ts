import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface UserData {
  displayName: string;
  email: string;
  role: "user";
  imageActive?: string;   // ảnh đang dùng
  images?: string[];      // danh sách ảnh user đã từng upload
  dob?: Timestamp | null; // ngày sinh
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // cho phép thêm field khác
}

export async function createUserDoc(uid: string, data: Partial<UserData>) {
  await setDoc(doc(db, "users", uid), {
    displayName: "",
    email: "",
    role: "user",
    imageActive: "",
    images: [],
    ...data,
  });
}
export async function getUserDoc(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function deleteUserDoc(uid: string) {
  return await deleteDoc(doc(db, "users", uid));
}

export async function updateUserDoc(uid: string, data: Partial<UserData>) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function statusUser(uid: string) {
  const data = await getUserDoc(uid);
  return data !== null;
}
