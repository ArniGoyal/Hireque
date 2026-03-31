import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";

export type ApplicationStatus = "Applied" | "Shortlisted" | "Interview" | "Selected";

export type ApplicationDoc = {
  id: string;
  jobId: string;
  companyUid: string;
  companyName: string;
  studentUid: string;
  studentName: string;
  studentBranch?: string;
  studentCgpa?: number;
  studentSkills?: string[];
  role: string;
  appliedAt: unknown;
  status: ApplicationStatus;
  updatedAt?: unknown;
};

function toApplicationDoc(s: DocumentData, id: string): ApplicationDoc {
  return { id, ...(s as Omit<ApplicationDoc, "id">) };
}

export async function applyToJob(args: {
  jobId: string;
  companyUid: string;
  companyName: string;
  studentUid: string;
  studentName: string;
  studentBranch?: string;
  studentCgpa?: number;
  studentSkills?: string[];
  role: string;
}) {
  const applicationId = `${args.studentUid}_${args.jobId}`;

  const payload = {
    jobId: args.jobId,
    companyUid: args.companyUid,
    companyName: args.companyName,
    studentUid: args.studentUid,
    studentName: args.studentName,
    studentBranch: args.studentBranch,
    studentCgpa: args.studentCgpa,
    studentSkills: args.studentSkills,
    role: args.role,
    appliedAt: serverTimestamp(),
    status: "Applied" as ApplicationStatus,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "applications", applicationId), payload, { merge: false });
  return applicationId;
}

export async function listStudentApplications(studentUid: string): Promise<ApplicationDoc[]> {
  const q = query(collection(db, "applications"), where("studentUid", "==", studentUid));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => toApplicationDoc(d.data(), d.id));
}

export async function listCompanyApplications(companyUid: string): Promise<ApplicationDoc[]> {
  const q = query(collection(db, "applications"), where("companyUid", "==", companyUid));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => toApplicationDoc(d.data(), d.id));
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  await updateDoc(doc(db, "applications", applicationId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
