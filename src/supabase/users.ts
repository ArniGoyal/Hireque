export async function updateStudentProfile(uid: string, data: any) {
  const { supabase } = await import("@/supabase/client");

  const { error } = await supabase.from("users").upsert({
    id: uid, // 🔥 CRITICAL FIX
    ...data,
  });

  if (error) throw error;
}