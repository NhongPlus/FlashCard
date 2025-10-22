// services/authService.ts
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createUserDoc } from "./userService";

export async function register(email: string, password: string) {
  // ✅ Tạo auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {
    // ✅ Tạo firestore document
    await createUserDoc(userCredential.user.uid, {
      displayName: "",
      email: email,
      role: "user",
    });
  } catch {
    await userCredential.user.delete();
    throw new Error("Không thể tạo hồ sơ người dùng. Vui lòng thử lại.");
  }

  return userCredential;
}

export async function login(email: string, password: string) {
  // ℹ️ Login không cần tạo user doc
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}
