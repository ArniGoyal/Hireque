import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "./client";
import { createUserProfile, getUserProfile } from "./users";
import type { AppRole } from "@/types/app";

export type AuthenticatedUser = Pick<User, "uid" | "email">;

export function validateEmailRoleMatch(email: string, role: AppRole) {
  if (role === "student" && !email.toLowerCase().endsWith("@igdtuw.ac.in")) {
    throw new Error("Students must use an @igdtuw.ac.in email address.");
  }
  if (role === "recruiter" && !email.toLowerCase().endsWith("@company.com")) {
    throw new Error("Recruiters must use a @company.com email address.");
  }
}

export function listenToAuthStateChanges(cb: (user: AuthenticatedUser | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser?.uid) {
      cb(null);
      return;
    }
    cb({ uid: firebaseUser.uid, email: firebaseUser.email ?? "" });
  });
}

export async function signUp(args: { email: string; password: string; role: AppRole; name: string }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, args.email, args.password);
    await createUserProfile({
      uid: cred.user.uid,
      email: cred.user.email ?? args.email,
      role: args.role,
      name: args.name,
    });
    return { uid: cred.user.uid, email: cred.user.email ?? args.email };
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export async function signIn(args: { email: string; password: string }) {
  try {
    const cred = await signInWithEmailAndPassword(auth, args.email, args.password);
    return { uid: cred.user.uid, email: cred.user.email ?? args.email };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function ensureUserProfile(args: {
  uid: string;
  email: string;
  role: AppRole;
  name: string;
}) {
  const existing = await getUserProfile(args.uid);
  if (existing) return existing;
  await createUserProfile(args);
  return await getUserProfile(args.uid);
}


export function signOutUser() {
  return signOut(auth);
}

