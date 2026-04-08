import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";

export type JobStatus = "Active" | "Closed";
export type JobType = "Full-time" | "Internship";

export type Eligibility = {
  minCgpa?: number;
  branch?: string; // store a specific branch like "CSE", or omit for "All Branches"
  requiredSkills?: string[]; // optional: if present, client matches by intersection
};

export type JobDoc = {
  id: string;
  companyUid: string;
  companyName: string;
  role: string;
  type: JobType;
  package: string; // keep as string for UI ("12", "₹45 LPA", etc.)
  location: string;
  applicationsCount: number;
  status: JobStatus;
  eligibility: Eligibility;
  createdAt?: unknown;
};

function parseJobSnap(s: DocumentData, id: string): JobDoc {
  return {
    id,
    ...(s as Omit<JobDoc, "id">),
  };
}

export async function createJobPosting(args: {
  companyUid: string;
  companyName: string;
  role: string;
  type: JobType;
  location: string;
  package: string;
  eligibility: Eligibility;
}): Promise<string> {
  const payload = {
    companyUid: args.companyUid,
    companyName: args.companyName,
    role: args.role,
    type: args.type,
    location: args.location,
    package: args.package,
    applicationsCount: 0,
    status: "Active" as JobStatus,
    eligibility: args.eligibility,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "jobs"), payload);
  return docRef.id;
}

export async function listActiveJobs(): Promise<JobDoc[]> {
  const q = query(collection(db, "jobs"), where("status", "==", "Active"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => parseJobSnap(d.data(), d.id));
}

export async function listCompanyJobs(companyUid: string): Promise<JobDoc[]> {
  const q = query(collection(db, "jobs"), where("companyUid", "==", companyUid), where("status", "==", "Active"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => parseJobSnap(d.data(), d.id));
}

export async function listAllJobs(): Promise<JobDoc[]> {
  const q = query(collection(db, "jobs"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => parseJobSnap(d.data(), d.id));
}
