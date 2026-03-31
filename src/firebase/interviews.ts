import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";

export type InterviewStatus = "Scheduled" | "Completed";

export type InterviewDoc = {
  id: string;
  applicationId: string;
  jobId: string;
  companyUid: string;
  companyName: string;
  studentUid: string;
  studentName: string;
  role: string;
  type: string;
  scheduledAt: unknown;
  time: string;
  platform: string;
  link: string;
  status: InterviewStatus;
};

function toInterviewDoc(s: DocumentData, id: string): InterviewDoc {
  return { id, ...(s as Omit<InterviewDoc, "id">) };
}

export async function scheduleInterview(args: {
  applicationId: string;
  jobId: string;
  companyUid: string;
  companyName: string;
  studentUid: string;
  studentName: string;
  role: string;
  type: string;
  time: string;
  platform: string;
  link: string;
}) {
  const payload = {
    applicationId: args.applicationId,
    jobId: args.jobId,
    companyUid: args.companyUid,
    companyName: args.companyName,
    studentUid: args.studentUid,
    studentName: args.studentName,
    role: args.role,
    type: args.type,
    scheduledAt: serverTimestamp(),
    time: args.time,
    platform: args.platform,
    link: args.link,
    status: "Scheduled" as InterviewStatus,
  };

  // Deterministic ID: one interview schedule per application.
  const id = args.applicationId;
  await setDoc(doc(db, "interviews", id), payload, { merge: false });
  return id;
}

export async function listStudentInterviews(studentUid: string): Promise<InterviewDoc[]> {
  const q = query(collection(db, "interviews"), where("studentUid", "==", studentUid));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => toInterviewDoc(d.data(), d.id));
}

export async function listCompanyInterviews(companyUid: string): Promise<InterviewDoc[]> {
  const q = query(collection(db, "interviews"), where("companyUid", "==", companyUid));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => toInterviewDoc(d.data(), d.id));
}

