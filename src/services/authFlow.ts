// authFlow.ts
import { register, login } from "./authService";
import { createUserDoc, getUserDoc } from "./userService";

export async function handleRegister(email: string, password: string) {
  const { user } = await register(email, password);
  await createUserDoc(user.uid, { email: user.email || ""});
  return user;
}

export async function handleLogin(email: string, password: string) {
  const { user } = await login(email, password);
  const userDoc = await getUserDoc(user.uid);

  if (!userDoc?.displayName || !userDoc?.email) {
    return { user, needUpdate: true };
  }

  return { user, needUpdate: false };
}
