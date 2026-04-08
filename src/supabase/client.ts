import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to your .env file.`,
    );
  }
  return value as string;
}

export const supabase = createClient(
  requiredEnv("VITE_SUPABASE_URL"),
  requiredEnv("VITE_SUPABASE_ANON_KEY"),
);

export const RESUME_BUCKET =
  (import.meta.env.VITE_SUPABASE_RESUME_BUCKET as string | undefined) ?? "resumes";
