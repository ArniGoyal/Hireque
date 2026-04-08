import { collection, doc, getDocs, getDoc, query, setDoc, Timestamp, where } from "firebase/firestore";
import { db } from "./client";
import type { AppRole } from "@/types/app";
import type { StudentProfile, UserProfileDoc, RecruiterProfile } from "@/types/user";

const userDocRef = (uid: string) => doc(db, "users", uid);

export async function getUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfileDoc;
}

export async function createUserProfile(args: {
  uid: string;
  email: string;
  role: AppRole;
  name: string;
}): Promise<void> {
  const { uid, email, role, name } = args;
  const now = Timestamp.now();

  const base: Omit<UserProfileDoc, "student" | "recruiter" | "admin"> = {
    uid,
    email,
    role,
    name,
    createdAt: now,
  };

  const payload: Partial<UserProfileDoc> = {
    ...base,
  };

  // Only add role-specific fields if they match the user's role
  if (role === "student") {
    payload.student = { verified: false } satisfies StudentProfile;
  }
  if (role === "recruiter") {
    payload.recruiter = { companyName: name } satisfies RecruiterProfile;
  }
  if (role === "admin") {
    payload.admin = {};
  }

  // Use merge so re-signups don't blow away existing profile edits.
  await setDoc(userDocRef(uid), payload, { merge: true });
}

export async function updateStudentProfile(uid: string, patch: StudentProfile & { name?: string }): Promise<void> {
  const { name, ...studentData } = patch;
  const updates: any = {};
  if (Object.keys(studentData).length > 0) {
    updates.student = studentData;
  }
  if (name) {
    updates.name = name;
  }
  await setDoc(userDocRef(uid), updates, { merge: true });
}

export async function verifyUser(uid: string, role: AppRole): Promise<void> {
  if (role === "student") {
    await setDoc(userDocRef(uid), { student: { verified: true } }, { merge: true });
  } else if (role === "recruiter") {
    await setDoc(userDocRef(uid), { recruiter: { verified: true } }, { merge: true });
  }
}

export async function listPendingStudents(): Promise<Array<{ uid: string; name?: string }>> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "student"),
    where("student.verified", "==", false),
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ uid: d.id, name: (d.data() as UserProfileDoc).name }));
}

export async function listAllStudents(): Promise<UserProfileDoc[]> {
  const q = query(collection(db, "users"), where("role", "==", "student"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => d.data() as UserProfileDoc);
}

export async function listAllRecruiters(): Promise<UserProfileDoc[]> {
  const q = query(collection(db, "users"), where("role", "==", "recruiter"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => d.data() as UserProfileDoc);
}

