import type { Timestamp } from "firebase/firestore";
import type { AppRole } from "./app";

export type ResumeInfo = {
  storagePath?: string;
  downloadUrl?: string;
  updatedAt?: Timestamp;
};

export type StudentProfile = {
  name?: string;
  cgpa?: number;
  branch?: string;
  skills?: string[];
  resume?: ResumeInfo;
  verified?: boolean;
  college?: string;
  year?: string;
  linkedin?: string;
  github?: string;
};

export type RecruiterProfile = {
  companyName?: string;
  verified?: boolean;
  sector?: string;
  package?: string;
  openRoles?: number;
};

// `Record<string, never>` avoids "empty object type" lint errors.
export type AdminProfile = Record<string, never>;

export type UserProfileDoc = {
  uid: string;
  email: string;
  role: AppRole;
  name: string;
  createdAt: Timestamp;
  student?: StudentProfile;
  recruiter?: RecruiterProfile;
  admin?: AdminProfile;
};

